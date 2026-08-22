---
title: Cluster Setup Guide
description: Vagrant + Helm + Argo CD local data platform 1-click bootstrap guide.
project: Beluga
path: beluga/getting-started
order: 1502
lastModified: 2026-08-23
---

# Cluster Setup Guide

Step-by-step guide to bootstrapping the Beluga data platform locally.

## 1. Boot Cluster

```bash
git clone https://github.com/dasomel/beluga.git
cd beluga
vagrant up
```

## 2. Run Demo Pipeline & Verify

```bash
# Launch sample database and CDC ingestion
make demo-pipeline

# Query Iceberg tables via Trino CLI
vagrant ssh master -c "trino --server http://localhost:8080 --catalog iceberg --schema default --execute 'SELECT * FROM order_events LIMIT 10;'"
```
