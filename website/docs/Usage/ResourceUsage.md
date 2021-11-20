---
id: ResourceUsage
title:  Client Resource Usage
sidebar_label: Client Resource Usage
---

# Consensus Clients

| Client | Version | Date | DB Size  |  RAM | CPU | Notes |
|--------|---------|----  |----------|------|-----|-------|
| Teku   | 21.9.2  | Sept 2021 | ~20 GiB | ~4 GiB | 100-200% | |
| Lighthouse | 1.5.2  | Sept 2021 | ~55 GiB | ~1 GiB | 100-200% | |
| Nimbus | | | ? | ~1 Gib | 100% | single-threaded |
| Prysm | | | ? | ~4 GiB | ? | |

# Execution clients

For reference, here are disk, RAM and CPU requirements, as well as mainnet initial
synchronization times, for different Ethereum execution clients.

## Disk, RAM, CPU requirements

SSD, RAM and CPU use is after initial sync, when keeping up with head. 100% CPU is one core.

| Client | Version | Date | DB Size  | DB Growth | RAM | CPU | Notes |
|--------|---------|----  |----------|-----------|-----|-----|-------|
| Geth   | 1.10.9 | Sept 2021 | ~430 GiB | ~ 12 GiB / week | 9 GiB | 100-400% | DB size can be reduced by [offline(!) prune](../Support/GethPrune.md) |
| Nethermind | 1.11.7 | Nov 2021 | ~310 GiB | ~16 GiB / week | 13 GiB | 100-400% | memory use w/ pruning and prune-cache 4096; initial size lower bcs of ancient barrier |
| Besu | v21.10.0 | Nov 2021 | ~550 GiB | ~ 8 GiB / week | 8 - 9 GiB | 50-100% | with Bonsai tries |
| Erigon | 2021-09-05 alpha | Sept 2021 | ~ 635 GiB | ~ 1 GiB / week | 1 GiB | 50-100% | Erigon will use up to 16 GiB of RAM during initial sync. It will have the OS use all available RAM as a DB cache during post-sync operation, but this RAM is free to be used by other programs as needed |

## Test Systems

IOPS is random read-write IOPS [measured by fio with "typical" DB parameters](https://arstech.net/how-to-measure-disk-performance-iops-with-fio-in-linux/), 4G and 150G file.
Servers have been configured with [noatime](https://www.howtoforge.com/reducing-disk-io-by-mounting-partitions-with-noatime) and [no swap](https://www.geeksforgeeks.org/how-to-permanently-disable-swap-in-linux/) to improve available IOPS. read and write latencies are measured
with `sudo iostat -mdx` during Geth sync, look at `r_await` and `w_await`.

A note on Contabo: Stability of their service [is questionable](https://www.reddit.com/r/ethstaker/comments/l5d69l/if_youre_struggling_with_contabo/).

| Name                 | RAM    | SSD Size | CPU        | r/w IOPS | r/w latency | Notes |
|----------------------|--------|----------|------------|------|-------|--------|
| Homebrew Xeon        | 32 GiB | 700 GiB  | Intel Quad | 18k/6k (4G file) | | Xeon E3-2225v6 |
| Dell R420            | 32 GiB | 1 TB     | Dual Intel Octo | 28.9k/9.6k (4G file) | | Xeon E5-2450 |
| Contabo M/L VPS        | 16/30 GiB | 400/800 GiB  | Intel Hexa/Octa  | 3k/1k (4G file) | | Xeon E5-2630 v4 - some Contabo VPS are AMD |
| [Netcup](https://netcup.eu) VPS 2000/3000 G9   | 16/24 GiB | 320/600 GiB  | AMD Quad/Hexa | 15k/5k (4G file) 3k/1k (150G file) | 2.25/6 ms | |
| OVH Baremetal NVMe   | 32 GiB | 1.9 TB  | Intel Hexa | 267k/89k (4G file) 177k/59k (150G file) | 0.08/3.5 ms | |

## Initial sync times

NB: All execution clients need to [download state](https://github.com/ethereum/go-ethereum/issues/20938#issuecomment-616402016)
after getting blocks. If state isn't "in" yet, your sync is not done. This is a heavily disk IOPS dependent
operation, which is why HDD cannot be used for a node. For Nethermind, seeing "branches" percentage reset to "0.00%"
after state root changes with "Setting sync state root to" is normal and expected. With sufficient IOPS, the
node will "catch up" and get in sync.

Cache size default in all tests.

| Client | Version | Date | Test System | Time Taken |  Notes |
|--------|---------|------|-------------|------------|--------|
| Geth   | 1.10.1  | Mar 2021 | Homebrew Xeon | ~ 10 hours | |
| Geth   | 1.10.9  | Oct 2021 | OVH Baremetal | ~ 4.5 hours | |
| Geth   | 1.10.9  | Oct 2021 | Netcup VPS3000 | ~ 13 hours | |
| Nethermind | 1.10.7-beta | Jan 2021 | Contabo L VPS | Never | VPS IOPS too low to finish Nethermind sync |
| Nethermind | 1.10.44 | Mar 2021 | Homebrew Xeon | ~ 27 hours | |
| Nethermind | 1.10.9 | Jan 2021 | Netcup VPS 2000 | ~ 20 hours | |
| Besu | 20.11.0 | Nov 2021 | Netcup VPS 3000 | ~ 4 days 8 hours | |
| Erigon | 2021-09-05 alpha | Sept 2021 | Homebrew Xeon | ~ 6 days | |
