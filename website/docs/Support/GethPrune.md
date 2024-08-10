---
id: GethPrune
title: Execution client prune
sidebar_label: Prune execution client
---

### Automatic Nethermind prune

By default, Nethermind will prune when free disk space falls below 350 GiB on mainnet, or 50 GiB on testnet. If you
want to disable that, `nano .env` and change `AUTOPRUNE_NM` to `false`.

### Continuous Besu prune

Besu continuously prunes with BONSAI, and from 24.1.0 on also prunes its trie-logs. A long-running Besu may benefit
from a manual trie-log prune, once.

### Continuous Geth prune

Geth continuously prunes if synced with PBSS. If you are using an old hash-synced Geth, run `./ethd resync-execution`
to use PBSS. This will cause downtime while Geth syncs, which can take 6-12 hours.

### Manual Nethermind or Besu prune

Run `./ethd prune-nethermind` if using Nethermind. It will check prerequisites, online prune Nethermind, and restart it.

Run `./ethd prune-besu` if using a long-running Besu. It will check prerequisites, offline prune Besu trie-logs, and
restart it.
