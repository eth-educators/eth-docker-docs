---
id: GethPrune
title:  Offline prune Geth / Online prune Nethermind.
sidebar_label: Prune Geth or Nethermind
---

### Automatic Nethermind prune

By default, Nethermind will prune when free disk space falls below 350 GiB. If you want to disable that, `nano .env` and change `AUTOPRUNE_NM` to `false`.

### Automatic Geth prune

Geth can continuously prune from version 1.13.0 on. If you are on that version, run `./ethd resync-execution` to use PBSS. This will cause downtime while Geth syncs, which can take 6-12 hours.

### Semi-automated Geth or Nethermind prune

The Geth DB if not using PBSS will grow over time, and may fill a 2TB SSD in a year or two.

You can offline prune Geth, bringing it back down close to its initial DB size.

Run `./ethd prune-geth` if using Geth. It will check prerequisites, offline prune Geth, and restart it.

Run `./ethd prune-nethermind` if using Nethermind. It will check prerequisites, online prune Nethermind, and restart it.

