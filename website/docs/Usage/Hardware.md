---
id: Hardware
title: Resources, hardware
sidebar_label: Hardware
---

Recommended hardware profile:
* 16+ GiB of RAM - Nethermind recommends 32 GiB
* Quad Core CPU
* 2TB ["mainstream" SSD](https://gist.github.com/yorickdowne/f3a3e79a573bf35767cd002cc977b038) - neither QLC nor DRAMless. 1TB can work with some client combinations; 2TB affords more room for growth.

Generally, 8 GiB of RAM is a very tight fit, with only Nimbus/Geth reported to work, and 16+ GiB is recommended.

4 CPU cores are recommended to deal with spikes in processing. 

An SSD is required for storage because the node databases are so IOPS-heavy. The Geth execution client would require around 650GiB of storage by itself initially, which can fill a 1TB SSD within 2 months. Offline pruning is available.

Other execution clients grow at different rates, see [resource use](../Usage/ResourceUsage.md).

The consensus client database is small, around 20-100 GiB, but we don't know what growth will look like after the merge of Ethereum.

If you are running a slasher, that might be another 100 to 300 GiB by itself.

Two home server builds that I like and am happy to recommend are below. Both support
IPMI, which means they can be managed and power-cycled remotely and need neither
a GPU nor monitor. Both support ECC RAM, though the AMD option as of Sept 2020
was unable to report ECC errors via IPMI, only OS-level reporting worked.

**Intel**

* mITX: 
  * SuperMicro X11SCL-IF(-O) (1 NVMe)
    * Intel i3-9100F or Intel Xeon E-21xx/22xx (i5/7 do not support ECC)
  * SuperMicro X12STL-IF(-O) (1 NVMe)
    * Intel Xeon E-23xx 
* uATX:
  * SuperMicro X11SCL-F(-O) (1 NVMe) or X11SCH-F(-O) (2 NVMe). SCH supports an iGPU
    * Intel i3-9100(F) or Intel Xeon E-21xx/22xx(G) (i5/7 do not support ECC)
  * SuperMicro X12STL-F(-O) or X12STH-F(-O). STH supports an iGPU
    * Intel Xeon E-23xx(G)
* Common components:
  * 32 GiB of Micron or Samsung DDR4 UDIMM ECC RAM (unbuffered, **not** registered)
  * [2TB M.2 NVMe SSD](https://gist.github.com/yorickdowne/f3a3e79a573bf35767cd002cc977b038)

**AMD**

* mITX:
  * AsRock Rack X570D4I-2T (1 NVMe)
* uATX:
  * AsRock Rack X470D4U or X570D4U (2 NVMe both)
* Common components:
  * AMD Ryzen CPU (Zen2/3), but not APU (APUs do not support ECC)
  * 32 GiB of Micron or Samsung DDR4 UDIMM ECC RAM (unbuffered, **not** registered)
  * [2TB M.2 NVMe SSD](https://gist.github.com/yorickdowne/f3a3e79a573bf35767cd002cc977b038)

Plus, obviously, a case, PSU, case fans. Pick your own. Well-liked
options are Node 304 (mITX) and Node 804 (uATX) with Seasonic PSUs,
but really any quality case that won't cook your components will do.
For a small uATX form factor, consider Silverstone ML04B.

[Joe's hardware roundup](https://github.com/jclapis/rocketpool.github.io/blob/main/src/guides/local/hardware.md) has additional build ideas.

For the SSD, you'll want decent write endurance and good IOPS. You get better sync and prune performance with ["mainstream" SSDs](https://gist.github.com/yorickdowne/f3a3e79a573bf35767cd002cc977b038), that is, SSDs that are neither DRAMless nor use QLC Flash.

Intel SSDs are also well-liked: Their data center SSDs are quite reliable, if a bit pricey.

You may also consider getting two SSDs and running them in a software mirror
(RAID-1) setup, in the OS. That way, data loss becomes less likely for the
chain databases, reducing potential down time because of hardware issues.

Why ECC? This is a personal preference. The cost difference is minimal,
and the potential time savings huge. An Ethereum staking full node does not require
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
