---
title: ldapium Overview
description: OpenLDAP 2.6 source compilation, web UI, and zero-default credential philosophy.
project: ldapium
path: ldapium/overview
order: 1700
lastModified: 2026-08-23
---

# ldapium Overview

**ldapium** is a high-security directory solution combining an OpenLDAP 2.6 server image compiled directly from upstream source, a modern web management UI, and Kubernetes Helm charts.

## Core Engineering Invariants

1. **Zero Default Passwords**: No default credentials exist; passwords injected exclusively via runtime secrets.
2. **Zero Bundled Sample Data**: Ships pristine baseline schemas without clutter or sample accounts.
3. **Compiled from Upstream Source**: Transparent compilation ensuring full supply chain trust.
