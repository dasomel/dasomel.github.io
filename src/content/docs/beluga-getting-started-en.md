---
title: Cluster Setup Guide
description: Vagrant + Helm local cluster bootstrapping guide.
project: Beluga
path: beluga/getting-started
order: 1500
lastModified: 2026-08-23
---

# Cluster Setup Guide

Step-by-step instructions for booting the local data cluster.

## Bootstrap Commands
```bash
vagrant up
vagrant ssh master -c 'kubectl get pods -A'
```

## Related Links

- [Beluga Repository](https://github.com/dasomel/beluga)
- [English Project Home](/oss/en/beluga/)
