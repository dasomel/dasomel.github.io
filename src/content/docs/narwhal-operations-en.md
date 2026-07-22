---
title: "Operations & Disaster Recovery"
description: "Day-2 operations, backup/restore, and recovery runbooks for the Narwhal IDP cluster"
project: "Narwhal"
order: 107
lastModified: 2026-07-17
---

## Cluster Lifecycle

Since Narwhal is based on a local Vagrant environment, it is crucial to prepare for frequent power events such as host reboots and sleep modes.

### Start and Stop

- **Full Start**: `vagrant up --provider=vmware_desktop`
- **Full Stop**: `vagrant halt` (The `kubelet` is stopped gracefully first via the `trigger.before :halt` setting).
- **Partial Start**: `vagrant up master-1 worker-1`
- **Restart**: `vagrant halt && vagrant up`

### Reboot Survivability

When VMs are cold booted, nodes can fall into a `CrashLoopBackOff` state due to `CreateContainerError` from containerd holding stale container metadata, and Istio/Cilium network synchronization delays. Two systemd services handle this automatically:

1. **`narwhal-boot-heal.service` (All nodes)**: Runs on boot and periodically to detect wedged `kubelet` and `containerd` states. If it detects stale container reservation errors, it automatically restarts containerd.
2. **`narwhal-cluster-heal.service` (master-1 only)**: Force-deletes `Unknown` state Cilium/Istio pods and crashing core components so they can be cleanly recreated by their controllers.

**Clock Skew Bug:**
Immediately after the host wakes from sleep mode, the time gets out of sync, causing a flood of `Unauthorized` errors and `kube-apiserver` authentication rejections.

```shell
# Resolve immediately by restarting time sync on all nodes
for node in master-1 master-2 master-3 worker-1 worker-2 worker-3; do
  vagrant ssh $node -c "sudo systemctl restart systemd-timesyncd"
done
```

## Storage & Backup

Kubernetes resources are backed up by Velero, and databases are handled by CloudNative-PG (CNPG). The backup target is the internal SeaweedFS S3-compatible storage.

<Mermaid chart={`flowchart TB
  subgraph K8S["Kubernetes Cluster"]
    API["API Server<br/>(Cluster State)"]
    PVC["Persistent Volumes<br/>(File Data)"]
    DB["CNPG narwhal-db<br/>(PostgreSQL)"]
  end

  subgraph S3["SeaweedFS S3 Store"]
    VB["velero bucket<br/>(Kopia Backups)"]
    CB["cnpg-backups bucket<br/>(WALs & Base Backups)"]
  end

  VELERO["Velero Controller"]
  CNPG["CNPG Operator<br/>(Barman)"]

  API -->|"Manifests"| VELERO
  PVC -->|"Kopia Node Agent"| VELERO
  VELERO -->|"Daily Backup"| VB

  DB -->|"Continuous WAL + Daily Base"| CNPG
  CNPG --> CB

  VB -.->|"Full/Namespace Restore"| VELERO
  CB -.->|"PITR Restore"| CNPG

  style S3 fill:#fafafa,stroke:#d1d5db,color:#374151
  style K8S fill:#fafafa,stroke:#d1d5db,color:#374151
  style VB fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style CB fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#111
  style VELERO fill:#f0fdf4,stroke:#059669,color:#111
  style CNPG fill:#f0fdf4,stroke:#059669,color:#111
  style API fill:#fff,stroke:#9ca3af,color:#111
  style PVC fill:#fff,stroke:#9ca3af,color:#111
  style DB fill:#fff,stroke:#9ca3af,color:#111
`} />

### Velero Cluster Backup & Restore

```shell
# 1. Create a manual backup
vagrant ssh master-1 -c "kubectl exec -n velero deployment/velero -- velero backup create manual-full-backup"

# 2. Extract the name of the latest completed backup
LATEST_BACKUP=$(vagrant ssh master-1 -c "kubectl exec -n velero deployment/velero -- velero backup get -o json | jq -r '[.items[] | select(.status.phase==\"Completed\")] | sort_by(.status.completionTimestamp) | last | .metadata.name'")

# 3. Execute full restore (excluding core namespaces)
vagrant ssh master-1 -c "kubectl exec -n velero deployment/velero -- velero restore create full-restore-$(date +%Y%m%d) --from-backup ${LATEST_BACKUP} --include-namespaces '*' --exclude-namespaces kube-system,storage,monitoring"
```

### CNPG Database (PITR)

CloudNative-PG operates a single integrated `narwhal-db` cluster in the `database` namespace. In the event of a Primary instance failure, a Replica is automatically promoted (Failover).

```shell
# Check the current Primary instance
kubectl get cluster narwhal-db -n database -o jsonpath='{.status.currentPrimary}'

# Apply manifest to restore the cluster to a Point-in-Time
apiVersion: postgresql.cnpg.io/v1
kind: Cluster
metadata:
  name: narwhal-db-restored
  namespace: database
spec:
  instances: 2
  bootstrap:
    recovery:
      source: narwhal-db
      recoveryTarget:
        targetTime: "2026-02-26 02:00:00"
```

## Recovery Runbooks

### 1. APISIX etcd Empty-Prefix Deadlock

Because `apisix-etcd` uses an `emptyDir` volume, its data vanishes on pod restart. When this happens, APISIX returns 404 errors, causing the `apisix-ingress-controller` to fail route synchronization indefinitely (deadlock).

- **Symptoms**: Traffic is entirely cut off, and the ingress controller logs repeat `unexpected status code 404`.
- **Solution**: You must create a Bootstrap Seed pod to forcefully `PUT` dummy keys into the paths returning 404.
  ```shell
  ADMIN_KEY=$(kubectl -n platform-system get secret apisix-admin-key -o jsonpath='{.data.key}' | base64 -d)
  BASE="http://apisix-admin.platform-system.svc.cluster.local:9180/apisix/admin"
  
  # Inject dummy data (routes, upstreams, etc.) using curl from a temporary container
  kubectl -n platform-system exec seed-batch -- curl -s -X PUT -H "X-API-KEY: ${ADMIN_KEY}" -H "Content-Type: application/json" -d '{"uri":"/__bootstrap-seed-delete-me__","upstream":{"type":"roundrobin","nodes":{"127.0.0.1:1":1}}}' "${BASE}/routes/bootstrap-seed"
  
  # Restart the ingress controller afterwards
  kubectl -n platform-system rollout restart deployment/apisix-ingress-controller
  ```

### 2. Master Node Failure & etcd Quorum

The cluster is composed of 3 masters, providing `1 fault tolerance`.

| Master Node | Impact and Recovery |
|---|---|
| `master-2` / `master-3` | 2/3 quorum is maintained, so the cluster operates normally. They will automatically rejoin upon VM restart (`vagrant up`). |
| `master-1` | The `192.168.56.100` VIP automatically fails over. However, since the NFS volume (`nfs-server`) and the primary dnsmasq are halted, immediate VM recovery is essential. |

If 2 or more masters are lost, resulting in **etcd quorum loss**:
```shell
# Force cluster initialization on the 1 remaining master
sudo sed -i '/--initial-cluster=/s/,.*//' /etc/kubernetes/manifests/etcd.yaml
# Add the --force-new-cluster=true flag and restart the kubelet
```

### 3. Master Node Memory Pressure

- **Symptoms**: Frequent SIGKILL of the API server pod (preventing OOM), and nodes flapping between `Ready` and `NotReady` states.
- **Cause**: In a 4GB RAM environment, `kube-apiserver` (consuming ~2GB) alongside mandatory DaemonSets pushes memory to the limit (~500Mi headroom).
- **Solution**: This has currently been resolved by bumping `MASTER_MEMORY` to `6144`. If similar symptoms appear, further increases may be necessary.

### 4. Unsealing OpenBao (Vault)

By default security policy, OpenBao instances do not automatically unseal upon VM reboot. Dependent apps will fail as they cannot retrieve secrets.

```shell
# Check Sealed status
kubectl exec -n storage openbao-0 -- bao status

# Extract the Unseal Key from the init secret and apply it
BAO_UNSEAL_KEY=$(kubectl get secret openbao-init -n storage -o jsonpath='{.data.unseal_keys_b64}' | base64 -d)
kubectl exec -n storage openbao-0 -- bao operator unseal $BAO_UNSEAL_KEY
```

### 5. OIDC Authentication Chicken-and-Egg Error

- **Symptoms**: `kube-apiserver` pod crashes with the error `jwt[0].issuer.url: Invalid value: URL scheme must be https`.
- **Solution**: As of Kubernetes v1.35, HTTPS is mandatory for OIDC setups. You must ensure `cert-manager` and APISIX TLS are fully deployed before executing `11-4-keycloak-apiserver.sh` to enable the OIDC flags.
