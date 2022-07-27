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

# Execution clients

For reference, here are disk, RAM and CPU requirements, as well as mainnet initial synchronization times, for different Ethereum execution clients.

## Disk, RAM, CPU requirements

SSD, RAM and CPU use is after initial sync, when keeping up with head. 100% CPU is one core.

| Client | Version | Date | DB Size  | DB Growth | RAM | CPU | Notes |
|--------|---------|----  |----------|-----------|-----|-----|-------|
| Geth   | 1.10.18 | Jun 2022 | ~560 GiB | ~13.5 GiB / week | 8 GiB | 100-400% | default cache size |
| Geth   | 1.10.18 | Jun 2022 | ~560 GiB | ~12 GiB / week | 9-10 GiB | 100-400% | `--cache 5336`, max value at 16 GiB RAM, reduces DB growth rate |
| Geth   | 1.10.18 | Jun 2022 | ~560 GiB | ~8 GiB / week | 16-19 GiB | 100-400% | `--cache 10704`, max value at 32 GiB RAM, reduces DB growth rate |
| Nethermind | 1.12.4 | Feb 2022 | ~660 GiB | ~16 GiB / week | 15-16 GiB | 50-200% | memory use w/ pruning and prune-cache 4096; 18 GiB memory and 8 cores during sync |
| Besu | 22.4.1 | May 2022 | ~610 GiB | ~8 GiB / week | 8 - 9 GiB | 50-100% | with Bonsai tries |
| Erigon | 2021-09-05 alpha | Sept 2021 | ~635 GiB | ~1 GiB / week | 1 GiB | 50-100% | Erigon will use up to 16 GiB of RAM during initial sync. It will have the OS use all available RAM as a DB cache during post-sync operation, but this RAM is free to be used by other programs as needed |

Notes on disk usage
- Geth -  DB size can be reduced when it grew too large by [offline(!) prune](../Support/GethPrune.md)
- Nethermind - DB size can be reduced when it grow too large by online prune: Switch to full prune, manually start prune, switch back to memory prune
- Erigon does not compress its DB, leaving that to the filesystem. With ZFS and lz4, it compresses around 1.4x. Be sure to set recordsize 16k on Erigon's dataset.


## Test Systems

IOPS is random read-write IOPS [measured by fio with "typical" DB parameters](https://arstech.net/how-to-measure-disk-performance-iops-with-fio-in-linux/), 4G and 150G file, without other processes running.

Specifically `fio --randrepeat=1 --ioengine=libaio --direct=1 --gtod_reduce=1 --name=test --filename=test --bs=4k --iodepth=64 --size=4G --readwrite=randrw --rwmixread=75` followed by `fio --randrepeat=1 --ioengine=libaio --direct=1 --gtod_reduce=1 --name=test --filename=test --bs=4k --iodepth=64 --size=150G --readwrite=randrw --rwmixread=75`, then `rm test` to get rid of the 150G test file. If the 150G test shows it'd take hours to complete, feel free to cut it short once the IOPS display for the test looks steady.

150G was chosen to "break through" any caching strategems the SSD uses for bursty writes. Execution clients write steadily, and the performance of an SSD under heavy write is more important than its performance with bursty writes.

Read and write latencies are measured with `sudo iostat -mdx 240 2` during Geth sync, look at `r_await` and `w_await` of the second output block.

Servers have been configured with [noatime](https://www.howtoforge.com/reducing-disk-io-by-mounting-partitions-with-noatime) and [no swap](https://www.geeksforgeeks.org/how-to-permanently-disable-swap-in-linux/) to improve available IOPS. 

A note on Contabo: Stability of their service [is questionable](https://www.reddit.com/r/ethstaker/comments/l5d69l/if_youre_struggling_with_contabo/).

| Name                 | RAM    | SSD Size | CPU        | r/w IOPS | r/w latency | Notes |
|----------------------|--------|----------|------------|------|-------|--------|
| Homebrew Xeon ZFS zvol | 32 GiB | 1.2 TiB | Intel Quad | 19.3k/6.4k (4G file) 3.5k/1k (150G file) | | Xeon E3-2225v6. 16k recordsize, stripe, xfs; fio with --bs=16k |
| Dell R420 w/ HBA     | 32 GiB | 1 TB | Dual Intel Octo | 44.7k/14k (4G file) 35.9k/11k (150G file) | | Xeon E5-2450 |
| Contabo L VPS SSD  | 30 GiB | 800 GiB | Intel Octa  | 3.1k/1k (4G file) 2.5k/800 (150G file) | | This was not sufficient to sync Geth |
| [Netcup](https://netcup.eu) VPS 3000 G9   | 24 GiB | 600 GiB  | AMD Hexa | 25.8k/8.6k (4G file) 11.2k/3.7k (150G file) | 2.25/6 ms | |
| Netcup RS 8000 G9.5 | 64 GiB | 2 TB | AMD EPYC 7702 | 47.8k/16k (4G file) 15.6k/5k (150G file) | 3.4/1.5 ms | |
| OVH Baremetal NVMe   | 32 GiB | 1.9 TB  | Intel Hexa | 267k/89k (4G file) 177k/59k (150G file) | 0.08/3.5 ms | |
| AWS io1 w/ 10K IOPS  | 8 GiB  | NA      | Intel Dual | 7.7k/2.6k (4G file) 7.6k/2.5k (150G file) | | t2.large, could not sync Geth. Note t2 throttles CPU |
| AWS gp3 w/ 16K IOPS  | 16 GiB | NA      | Intel Quad | 12.5k/4.2k (4G file) 12.2k/4.1k (150G file) | | m6i.xlarge |

## Initial sync times

NB: All execution clients need to [download state](https://github.com/ethereum/go-ethereum/issues/20938#issuecomment-616402016) after getting blocks. If state isn't "in" yet, your sync is not done. This is a heavily disk IOPS dependent operation, which is why HDD cannot be used for a node. 

For Nethermind, seeing "branches" percentage reset to "0.00%" after state root changes with "Setting sync state root to" is normal and expected. With sufficient IOPS, the node will "catch up" and get in sync.

For Geth, you will see "State heal in progress" after initial sync, which will persist for a few hours if IOPS are low-ish. 

This should complete in under 4 hours. If it does not, or even goes on for a week+, you do not have sufficient IOPS for Geth to "catch up" with state.

Cache size default in all tests.

| Client | Version | Date | Test System | Time Taken |  Notes |
|--------|---------|------|-------------|------------|--------|
| Geth   | 1.10.1  | Mar 2021 | Homebrew Xeon | ~ 10 hours | |
| Geth   | 1.10.9  | Oct 2021 | OVH Baremetal | ~ 4.5 hours | |
| Geth   | 1.10.9  | Oct 2021 | Netcup VPS3000 | ~ 13 hours | |
| Geth   | 1.10.13  | Nov 2021 | Contabo L | Never | VPS IOPS too low to finish Geth sync |
| Nethermind | 1.10.7-beta | Jan 2021 | Contabo L | Never | VPS IOPS too low to finish Nethermind sync |
| Nethermind | 1.10.44 | Mar 2021 | Homebrew Xeon | ~ 27 hours | |
| Nethermind | 1.10.9 | Jan 2021 | Netcup VPS 2000 | ~ 20 hours | |
| Besu | 22.4.1 | May 2022 | OVH Baremetal NVMe | ~ 30 hours | With X_SNAP sync |
| Erigon | 2021-09-05 alpha | Sept 2021 | Homebrew Xeon | ~ 6 days | |

## Getting better IOPS

Geth needs a decent amount of IOPS, as do Besu and Nethermind. Erigon can run on very low IOPS, though should also not be used with HDD.

For cloud providers, here are some results for syncing Geth. 
- AWS, gp2 or gp3 with provisioned IOPS have both been tested successfully.
- Linode block storage, make sure to get NVMe-backed storage. 
- Netcup is sufficient as of late 2021.
- Contabo VPS SSD cannot sync Geth as of late 2021.
- There are reports that Digital Ocean block storage is too slow, as of late 2021. 
- Strato V-Server is too slow as of late 2021.

Dedicated servers with SSD or NVMe will always have sufficient IOPS. Do avoid hardware RAID though, see below. OVH Advance line as well as Hetzner are well-liked dedicated options; Linode or Strato or any other provider will work as well.

For own hardware, we've seen three causes of low IOPS:
- Overheating of the SSD. Check `smartctl -x`. You want the SSD to be at or below 40 degrees Celsius.
- External SSD with a USB controller that can't keep up. Samsung T5 has been shown to work, as has Samsung T7 with the right firmware. T7 is slower.
- Hardware RAID, no TRIM support. [Flash the controller](https://gist.github.com/yorickdowne/fd36009c19fdbee0337bffc0d5ad8284) to HBA and use software RAID.

In some cases, the SSD itself can't keep up, e.g. reports of this with WD Green SN350, Crucial BX500. While they sync slowly, even QLC/DRAMless SSDs can be "enough" - this depends heavily on model. Given the option, you may want to [choose a "mainstream" SSD](https://gist.github.com/yorickdowne/f3a3e79a573bf35767cd002cc977b038) for better sync and pruning performance.
