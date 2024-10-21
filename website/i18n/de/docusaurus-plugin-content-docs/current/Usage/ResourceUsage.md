---
id: ResourceUsage
title:  Client Resource Usage
sidebar_label: Client Resource Usage
---

# Consensus Clients

| Client | Version | Date | DB Size  |  RAM | Notes |
|--------|---------|----  |----------|------|-------|
| Teku   | 24.8.0  | Sep 2024 | ~84 GiB | ~10 GiB |
| Lighthouse | 4.5.0  | Jan 2024 | ~130 GiB | ~5 GiB |
| Nimbus | 24.1.1 | Jan 2024 | ~170 GiB | ~2 to 3 GiB |
| Prysm | 4.1.1 | Jan 2024 | ~130 GiB | ~5 GiB |
| Lodestar | 1.13.0 | Jan 2024 | ~130 GiB | ~8 GiB |

Notes on disk usage
- Teku, Nimbus and Grandine continuously prune
- Lighthouse, Lodestar and Prysm can be resynced in minutes to bring space usage back down, with `./ethd resync-consensus`
- Lighthouse is working on tree states to continuously prune

# Execution clients

For reference, here are disk, RAM and CPU requirements, as well as mainnet initial synchronization times, for different Ethereum execution clients.

## Disk, RAM, CPU requirements

SSD, RAM and CPU use is after initial sync, when keeping up with head. 100% CPU is one core.

Please pay attention to the Version and Date. These are snapshots in time of client behavior. Initial state size increases over time, and execution clients are always working on improving their storage engines.

| Client | Version | Date | DB Size  | DB Growth | RAM | Notes |
|--------|---------|----  |----------|-----------|-----|-------|
| Geth   | 1.13.8 | Jan 2024 | ~1.1 TiB | ~7-8 GiB / week | ~ 8 GiB | with PBSS |
| Nethermind | 1.27.0 | Jun 2024 | ~800 GiB | ~11 GiB / week | ~ 7 GiB | With HalfPath, can automatic online prune at ~350 GiB free |
| Besu | v24.9.1 | Sep 2024 | ~1.2 TiB | ~7-8 GiB / week | ~ 10 GiB | |
| Reth | alpha.13 | Jan 2024 | ~1.1 TiB | ~ 3.5 GiB / week | ~ 9 GiB | throws away all logs except deposit contract, and so grows more slowly |
| Erigon | 2.56.1 | Jan 2024 | ~1.7 TiB | ~7-8 GiB / week | See comment | Erigon will have the OS use all available RAM as a DB cache during post-sync operation, but this RAM is free to be used by other programs as needed. During sync, it may run out of memory on machines with less than 32 GiB |

Notes on disk usage
- Reth, Besu, Geth and Erigon continously prune
- Nethermind - DB size can be reduced when it grew too large, by [online prune](../Support/GethPrune.md). Keep an eye
on [Paprika](https://github.com/NethermindEth/nethermind/pull/7157) and
[Path](https://github.com/NethermindEth/nethermind/pull/6499) work
- Erigon does not compress its DB, leaving that to the filesystem

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
| Nethermind | 1.24.0| Jan 2024 | OVH Baremetal NVMe | ~ 5 hours | Ready to attest after ~ 1 hour |
| Besu | v24.9.1 | Sep 2024 | OVH Baremetal NVMe | ~ 22 hours | |
| Erigon | 2.48.1 | August 2023 | OVH Baremetal NVMe | ~ 9 days | |
| Reth  | beta.1 | March 2024 | OVH Baremetal NVMe | ~ 2 days 16 hours | |

## Getting better IOPS

Ethereum execution layer clients need a decent amount of IOPS. HDD will not be sufficient.

For cloud providers, here are some results for syncing Geth.
- AWS, gp2 or gp3 with provisioned IOPS have both been tested successfully.
- Linode block storage, make sure to get NVMe-backed storage.
- Netcup is sufficient as of late 2021.
- There are reports that Digital Ocean block storage is too slow, as of late 2021.
- Strato V-Server is too slow as of late 2021.

Dedicated servers with SATA or NVMe SSD will always have sufficient IOPS. Do avoid hardware RAID though, see below.
OVH Advance line is a well-liked dedicated option; Linode or Strato or any other provider will work as well.

For own hardware, we've seen three causes of low IOPS:
- DRAMless or QLC SSD. Choose a ["mainstream" SSD](https://gist.github.com/yorickdowne/f3a3e79a573bf35767cd002cc977b038)
with TLC and DRAM. Enterprise / data center SSDs will always work great; consumer SSDs vary.
- Overheating of the SSD. Check `smartctl -x`. You want the SSD to be at ~ 40-50 degrees Celsius, so it does not
throttle.
- Hardware RAID, no TRIM support. [Flash the controller](https://gist.github.com/yorickdowne/fd36009c19fdbee0337bffc0d5ad8284)
to HBA and use software RAID.
