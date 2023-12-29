---
id: ResourceUsage
title:  Client Resource Usage
sidebar_label: Client Resource Usage
---

# Consensus Clients

| Client | Version | Date | DB Size  |  RAM | CPU | Notes |
|--------|---------|----  |----------|------|-----|-------|
| Teku   | 22.1.1  | Jan 2022 | ~30 GiB | ~9 GiB | 100-300% | |
| Lighthouse | 2.1.1  | Jan 2022 | ~90 GiB | ~1.7 GiB | 50-200% | |
| Nimbus | 1.6.0 | Jan 2022 | ~40 GiB | ~2.3 GiB | 50-200% | |
| Prysm | 2.1.3 | Jul 2022 | ~100 GiB | ~4 GiB | 100-300% | |
| Lodestar | 1.3.0 | Jan 2023 | ~30 GiB | ~4 GiB | 50-150% | |

# Execution clients

For reference, here are disk, RAM and CPU requirements, as well as mainnet initial synchronization times, for different Ethereum execution clients.

## Disk, RAM, CPU requirements

SSD, RAM and CPU use is after initial sync, when keeping up with head. 100% CPU is one core.

Please pay attention to the Version and Date. These are snapshots in time of client behavior. Initial state size increases over time, and execution clients are always working on improving their storage engines.

| Client | Version | Date | DB Size  | DB Growth | RAM | CPU | Notes |
|--------|---------|----  |----------|-----------|-----|-----|-------|
| Geth   | 1.13.0 | August 2023 | ~830 GiB | ~8 GiB / week | 8 GiB | 100-400% | with PBSS |
| Nethermind | 1.16.1 | Jan 2023 | ~860 GiB | ~30 GiB / week | 15-16 GiB | 50-200% | Can automatic online prune at ~350 GiB free | 
| Besu | v23.10.4-dev | December 2023 | 1.1 TiB | TBD / week | 8 - 9 GiB | 50-100% | YoY fresh synced DB growth 2022->2023 was around 200 GiB |
| Reth | alpha.7 | Aug 2023 | ~960 GiB | ~ 2 GiB / week | 9 GiB | 5-120% | |
| Erigon | 2.48.1 | August 2023 | ~1.3 TiB | ~7-8 GiB / week | See comment | 50-100% | Erigon will have the OS use all available RAM as a DB cache during post-sync operation, but this RAM is free to be used by other programs as needed. During sync, it may run out of memory on machines with less than 32 GiB |

Notes on disk usage
- Geth - continously prunes when synced with PBSS
- Besu - can continuously prune its trie log, and continously prunes state with BONSAI
- Nethermind - DB size can be reduced when it grew too large, by [online prune](../Support/GethPrune.md). Keep an eye
on Paprika
- Erigon does not compress its DB, leaving that to the filesystem
- Reth does not compress its DB, leaving that to the filesystem

## Test Systems

IOPS is random read-write IOPS [measured by fio with "typical" DB parameters](https://arstech.net/how-to-measure-disk-performance-iops-with-fio-in-linux/), 150G file, without other processes running.

Specifically `fio --randrepeat=1 --ioengine=libaio --direct=1 --gtod_reduce=1 --name=test --filename=test --bs=4k --iodepth=64 --size=150G --readwrite=randrw --rwmixread=75`, then `rm test` to get rid of the 150G test file. If the test shows it'd take hours to complete, feel free to cut it short once the IOPS display for the test looks steady.

150G was chosen to "break through" any caching strategems the SSD uses for bursty writes. Execution clients write steadily, and the performance of an SSD under heavy write is more important than its performance with bursty writes.

Read and write latencies are measured with `sudo iostat -mdx 240 2` during Geth sync, look at `r_await` and `w_await` of the second output block.

Servers have been configured with [noatime](https://www.howtoforge.com/reducing-disk-io-by-mounting-partitions-with-noatime) and [no swap](https://www.geeksforgeeks.org/how-to-permanently-disable-swap-in-linux/) to improve available IOPS.


| Name                 | RAM    | SSD Size | CPU        | r/w IOPS | r/w latency | Notes |
|----------------------|--------|----------|------------|------|-------|--------|
| Homebrew Xeon ZFS zvol | 32 GiB | 1.2 TiB | Intel Quad | 3.5k/1k | | Intel SATA SSD, 16k recordsize, stripe, xfs; fio with --bs=16k |
| Homebrew Xeon ZFS dataset | 32 GiB | 1.2 TiB | Intel Quad | 1.2k/500 | | Intel SATA SSD, 16k recordsize, stripe, xfs; 16G Optane SLOG |
| Dell R420 w/ HBA     | 32 GiB | 1 TB | Dual Intel Octo | 35.9k/11k | Xeon E5-2450 |
| [Contabo](https://contabo.com) Storage VPS L  | 16 GiB | 1600 GiB | AMD EPYC Hexa  | 3k/1k | |  |
| [Netcup](https://netcup.eu) VPS 3000 G9   | 24 GiB | 600 GiB  | AMD Hexa | 11.2k/3.7k | 2.25/6 ms | |
| Netcup RS 8000 G9.5 | 64 GiB | 2 TB | AMD EPYC 7702 | 15.6k/5k | 3.4/1.5 ms | |
| [OVH](https://ovhcloud.com/) Baremetal NVMe   | 32 GiB | 1.9 TB  | Intel Hexa | 177k/59k | 0.08/3.5 ms | |
| [AWS](https://aws.amazon.com/) io1 w/ 10K IOPS  | 8 GiB  | NA      | Intel Dual | 7.6k/2.5k | | t2.large, could not sync Geth. Note t2 throttles CPU |
| AWS gp3 w/ 16K IOPS  | 16 GiB | NA      | Intel Quad | 12.2k/4.1k | | m6i.xlarge |

## Initial sync times

Please pay attention to the Version and Date. These are snapshots in time of client behavior.

NB: All execution clients need to [download state](https://github.com/ethereum/go-ethereum/issues/20938#issuecomment-616402016) after getting blocks. If state isn't "in" yet, your sync is not done. This is a heavily disk IOPS dependent operation, which is why HDD cannot be used for a node.

For Nethermind, seeing "branches" percentage reset to "0.00%" after state root changes with "Setting sync state root to" is normal and expected. With sufficient IOPS, the node will "catch up" and get in sync.

For Geth, you will see "State heal in progress" after initial sync, which will persist for a few hours if IOPS are low-ish.

This should complete in under 4 hours. If it does not, or even goes on for a week+, you do not have sufficient IOPS for Geth to "catch up" with state.

Cache size default in all tests.

| Client | Version | Date | Test System | Time Taken |  Notes |
|--------|---------|------|-------------|------------|--------|
| Geth   | 1.13.0  | August 2023 | OVH Baremetal NVMe | ~ 6 hours | |
| Nethermind | 1.15 | December 2022 | Baremetal NVMe | ~ 24 hours | |
| Besu | v23.10.4-dev | December 2023 | OVH Baremetal NVMe | ~ 16 hours | With X_SNAP sync |
| Erigon | 2.48.1 | August 2023 | OVH Baremetal NVMe | ~ 9 days | |
| Reth  | alpha.7 | August 2023 | OVH Baremetal NVMe | ~ 3 days 5 hours | |

## Getting better IOPS

Geth needs a decent amount of IOPS, as do Besu and Nethermind. Erigon can run on very low IOPS, though should also not be used with HDD.

For cloud providers, here are some results for syncing Geth.
- AWS, gp2 or gp3 with provisioned IOPS have both been tested successfully.
- Linode block storage, make sure to get NVMe-backed storage.
- Netcup is sufficient as of late 2021.
- There are reports that Digital Ocean block storage is too slow, as of late 2021.
- Strato V-Server is too slow as of late 2021.

Dedicated servers with SSD or NVMe will always have sufficient IOPS. Do avoid hardware RAID though, see below. OVH Advance line as well as Hetzner are well-liked dedicated options; Linode or Strato or any other provider will work as well.

For own hardware, we've seen three causes of low IOPS:
- Overheating of the SSD. Check `smartctl -x`. You want the SSD to be at or below 40 degrees Celsius.
- External SSD with a USB controller that can't keep up. Samsung T5 has been shown to work, as has Samsung T7 with the right firmware. T7 is slower.
- Hardware RAID, no TRIM support. [Flash the controller](https://gist.github.com/yorickdowne/fd36009c19fdbee0337bffc0d5ad8284) to HBA and use software RAID.

In some cases, the SSD itself can't keep up, e.g. reports of this with WD Green SN350, Crucial BX500. While they sync slowly, even QLC/DRAMless SSDs can be "enough" - this depends heavily on model. Given the option, you may want to [choose a "mainstream" SSD](https://gist.github.com/yorickdowne/f3a3e79a573bf35767cd002cc977b038) for better sync and pruning performance.
