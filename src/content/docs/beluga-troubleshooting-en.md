---
title: Troubleshooting Guide
description: Debugging Kafka consumer lag, Flink checkpoint failures, and Trino query bottlenecks.
project: Beluga
path: beluga/troubleshooting
order: 1500
lastModified: 2026-08-23
---

# Troubleshooting Guide

Common data platform incidents and debugging procedures.

## Common Issues
- **Kafka Consumer Lag**: Increase partition count and Flink task parallelism
- **Flink Checkpoint Timeouts**: Audit MinIO storage throughput and RocksDB state size
- **Trino Out of Memory (OOM)**: Tune `query.max-memory` and partition filters

## Related Links

- [Beluga Repository](https://github.com/dasomel/beluga)
- [English Project Home](/oss/en/beluga/)
