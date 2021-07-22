---
id: Windows
title:  Windows
sidebar_label: Windows
---

Windows may seem like an "easy button". For eth-docker, it is anything but, and even for
other ways of running a client, there are multiple challenges. They can all be overcome,
and the [eth2 validator wizard project](https://github.com/stake-house/eth2-validator-wizard) aims
to do just that.

Things to think about with Windows:

- Time sync out of the box on not domain-joined Windows can be so badly "off" you can't attest. To improve this:
  - Change w32time to [start automatically](https://docs.microsoft.com/en-us/troubleshoot/windows-client/identity/w32time-not-start-on-workgroup). In Administrator cmd, but **not** PowerShell, `sc triggerinfo w32time start/networkon stop/networkoff`. Verify with `sc qtriggerinfo w32time`. To get into cmd that way, you can start Admin PowerShell and then just type `cmd`.
  - Make a few changes in regedit. 
    - In `Computer\HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\w32time\Config`, set `MaxPollInterval` to hex `c`, decimal `12`.
    - Check `Computer\HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\w32time\Parameters\NtpServer`. If it ends in `0x9` you are done. If it ends in `0x1` you need to adjust `SpecialPollInterval` in `Computer\HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\w32time\TimeProviders\NtpClient` to read `3600`
  - Reboot, then from Powershell run `w32tm /query /status /verbose` to verify that w32time service did start. If it didn't, check triggers again. If all else fails, set it to Automatic Delayed startup
- Time sync in WSL2 requires a kernel fix, which is available since 7/21/2021. Windows 10 20H2 or newer is required.
- Your node needs to run as a service for 24/7 uptime and security - user should not need to be logged in for node to run. How to differs between Docker Desktop
  and other ways of running. You'd be looking into Windows Task Scheduler.
- Client diversity. Prysm does Windows-native, Lighthouse may as well. The other two would rely on a setup that runs them in Docker Desktop and WSL2,
  thus Linux, afaik.
- execution client - Prysm sidesteps this with 3rd-party, and Geth runs natively. For other clients, you're looking at Docker Desktop again.
- Remote administration - SSH? RDP? If RDP, do you need a "proper" cert to encrypt?
- If using Docker Desktop and WSL2, consider that WSL2 runs as a virtual network. Work-around is to run a Powerscript that addresses needed port-forwarding.

The best bet for Windows is likely to run Prysm or Teku natively, with Geth, some way of starting them as a service without a user needing to be logged
in (Task Scheduler), and improved time sync.
