---
id: Hardware
title: Resources, hardware
sidebar_label: Hardware
---

Recommended hardware profile:
* 16 GiB of RAM
* Quad Core CPU
* 1TB "mainstream" SSD - neither QLC nor DRAMless

Generally, 8 GiB of RAM is a tight fit, and 16 GiB is recommended.


2 or 4 CPU cores, and an SSD for storage because the node databases
are so IOPS-heavy. The Geth eth1 node would require around 350GiB of storage by
itself initially, which can fill a 1TB SSD within 6 months. Offline pruning is available.

Other eth1 clients grow at different rates, see [resource use](../Usage/ResourceUsage.md).

The beacon node database is small, around 11 GiB, but we don't know what growth will
look like once the merge with Eth1 is done.

If you are running a slasher, that might be another 100 to 300 GiB by itself.

Two home server builds that I like and am happy to recommend are below. Both support
IPMI, which means they can be managed and power-cycled remotely and need neither
a GPU nor monitor. Both support ECC RAM, though the AMD option as of Sept 2020
was unable to report ECC errors via IPMI, only OS-level reporting worked.

**Intel**

* mITX: 
  * SuperMicro X11SCL-IF(-O) (1 NVMe)
* uATX:
  * SuperMicro X11SCL-F(-O) (1 NVMe) or X11SCH-F(-O) (2 NVMe)
* Common components:
  * Intel i3-9100F or Intel Xeon E-2xxx (i5/7 do not support ECC)
  * 16 GiB of Micron or Samsung DDR4 UDIMM ECC RAM (unbuffered, **not** registered)
  * 1TB M.2 NVMe SSD or SATA SSD, e.g. Samsung 970 EVO or Samsung 860 EVO

**AMD**

* mITX:
  * AsRock Rack X570D4I-2T (1 NVMe)
* uATX:
  * AsRock Rack X470D4U or X570D4U (2 NVMe both)
* Common components:
  * AMD Ryzen CPU, but not APU (APUs do not support ECC)
  * 16 GiB of Micron or Samsung DDR4 UDIMM ECC RAM (unbuffered, **not** registered)
  * 1TB M.2 NVMe SSD or SATA SSD, e.g. Samsung 970 EVO or Samsung 860 EVO

Plus, obviously, a case, PSU, case fans. Pick your own. Well-liked
options are Node 304 (mITX) and Node 804 (uATX) with Seasonic PSUs,
but really any quality case that won't cook your components will do.
For a small uATX form factor, consider Silverstone ML04B.

[Joe's hardware roundup](https://github.com/jclapis/rocketpool.github.io/blob/main/src/guides/local/hardware.md) has additional build ideas.

On SSD size, 1TB is conservative and assumes you are running
an eth1 node as well, which currently takes about 350 GiB and keeps
growing. The eth2 db is expected to be far smaller, though exact figures
won't be seen until the merge with eth1 is complete.

You'll want decent write endurance. The two models mentioned here have 600TB
write endurance each.<br />
Intel SSDs are also well-liked, their data center SSDs are quite reliable, if a bit pricey.

You may also consider getting two SSDs and running them in a software mirror
(RAID-1) setup, in the OS. That way, data loss becomes less likely for the
chain databases, reducing potential down time because of hardware issues.

Why ECC? This is a personal preference. The cost difference is minimal,
and the potential time savings huge. An eth2 client does not require
ECC RAM; I maintain it is very nice to have regardless.

With non-ECC RAM, if your RAM goes bad, you will be troubleshooting server
crashes, and potentially spending days with RAM testing tools.

With ECC RAM, if your RAM goes bad, your OS and, if Intel, IPMI, will alert
you to corrected (or uncorrected) RAM errors. You'll want to have set up
email alerts for this. You then buy replacement RAM and schedule downtime.
No RAM troubleshooting required, you will know whether your RAM is functional or has issues
because it will report this to you, and correct single-bit errors.

I am so protective of my time these days that I build even my
home PCs with ECC RAM. You know your own tolerance for troubleshooting
RAM best.
