---
title: "Web UI"
description: "Guide to the built-in dashboard of the NFS Quota Agent, including its tab layout and API endpoints"
project: "NFS Quota Agent"
order: 403
lastModified: 2026-07-17
---

## Enabling the Embedded Dashboard

The NFS Quota Agent includes a built-in web dashboard that visualizes storage management. It can be enabled at runtime using the following flags.

- **Via CLI**: `nfs-quota-agent run --enable-ui --ui-addr=:8080`
- **Via Helm**: Set `webUI.enabled=true` and `webUI.addr=":8080"` in your `values.yaml`

Once activated, you can access the dashboard through your browser at `http://<node-ip>:8080`.

## Main Tab Layout

### 1. Quotas (Main View)
Displays the status of all directories with applied quotas in a table format.
- Click on any column header to sort by usage, directory name, etc.
- Clicking a directory row expands an **inline file browser** that shows subdirectories (📁) and files with their sizes (📄).
- The top section features summary cards providing quick insights into total disk capacity and overall usage percentage.

### 2. Orphans (Orphan Directory Management)
Lists orphaned directories found on the filesystem that lack a corresponding PV in the cluster.
- Requires the `--enable-auto-cleanup` feature.
- When running in `Live` mode, you can select specific orphaned directories via checkboxes and immediately delete them using the "Delete Selected" button.
- Indicates deletion eligibility based on the grace period ("Can Delete" or "In Grace Period").

### 3. Trends
Analyzes storage usage trends based on historically collected snapshots.
- Requires the `--enable-history` feature.
- Displays the usage changes over 24-hour, 7-day, and 30-day periods, and uses directional trend arrows to help gauge directory growth rates.

### 4. Policies
Aggregates and displays quota configurations per namespace (such as LimitRange and Annotations) along with any policy violations.
- Requires the `--enable-policy` feature.

### 5. Audit Logs
Provides a historical log of quota creations, updates, and deletions.
- Requires the `--enable-audit` feature.
- Filters at the top of the screen allow you to easily search for specific records, such as isolating failed actions ("Fails only") or targeting creations ("CREATE").

## Convenience Features

- **Dark Mode**: Toggle between light and dark themes using the moon icon in the top right corner. The preference is stored in localStorage.
- **Keyboard Shortcuts**: Supports `R` for refresh, number keys `1-5` for quick tab switching, and `/` to focus the search bar.

## REST API Reference

All dashboard data is exposed via REST APIs, allowing for integration with external monitoring tools or custom scripting.

- `/api/status`: Overall disk and quota summary info (GET)
- `/api/quotas`: Complete quota list including PV/PVC information (GET)
- `/api/files?path=/export/default`: Browse contents within a specific directory (GET)
- `/api/orphans/delete`: Force delete orphaned directories (POST, functions only in Live mode)
- Others: `/api/audit`, `/api/trends`, `/api/policies`, etc.
