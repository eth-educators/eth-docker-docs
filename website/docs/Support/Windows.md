---
id: Windows
title:  Windows
sidebar_label: Windows
---

Windows may seem like an "easy button". For Eth Docker, it is anything but, and even for other ways of running a
client, there are multiple challenges. They can all be overcome, and the
[eth wizard project](https://github.com/stake-house/eth2-validator-wizard) aims to do just that.

If you wish to run Eth Docker on Windows regardless, these are the steps needed.

- Run Windows 11 2023 Update or later, ideally with 64 GiB RAM so that WSL defaults to 30 GiB
- From Windows Store, install WSL and Ubuntu current LTS. Debian is also an option, it is however quite bare-bones
without even man-db out of the box
- Install WSL 2 2.x.x or later
- Configure WSL 2 for [mirrored networking](https://github.com/microsoft/WSL/releases/tag/2.0.0)
- In my testing, this assigns a static MAC address. Set a DHCP reservation so WSL always has the same local IP
- Check memory assigned to WSL with `free -h`. If it's too low for your chosen client mix, edit `.wslconfig` in your
Windows home directory and add a memory section, for example
```
[wsl2]
memory=32GB
```
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) and configure it to use the WSL 2 backend
- Fix Windows time sync
  - Change w32time to [start automatically](https://docs.microsoft.com/en-us/troubleshoot/windows-client/identity/w32time-not-start-on-workgroup). In Administrator cmd, but **not** PowerShell, `sc triggerinfo w32time start/networkon stop/networkoff`. Verify with `sc qtriggerinfo w32time`. To get into cmd that way, you can start Admin PowerShell and then just type `cmd`.
  - In `Computer\HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\w32time\Config`, set `MaxPollInterval` to hex `c`, decimal `12`.
  - Check `Computer\HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\w32time\Parameters\NtpServer`. If it ends in `0x9` you are done. If it ends in `0x1` you need to adjust `SpecialPollInterval` in `Computer\HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\w32time\TimeProviders\NtpClient` to read `3600`
  - Reboot, then from Powershell run `w32tm /query /status /verbose` to verify that w32time service did start. If it didn't, check triggers again. If all else fails, set it to Automatic Delayed startup
- [Enable systemd](https://devblogs.microsoft.com/commandline/systemd-support-is-now-available-in-wsl/#set-the-systemd-flag-set-in-your-wsl-distro-settings)
for WSL and install chrony with `sudo apt install -y chrony`.
- If you see [clock skew](https://github.com/microsoft/WSL/issues/10006) in WSL, set a scheduled task to keep WSL in
sync with your Windows clock. From non-admin Powershell, run
`schtasks /Create /TN WSLTimeSync /TR "wsl -u root hwclock -s" /SC ONEVENT /EC System /MO "*[System[Provider[@Name='Microsoft-Windows-Kernel-Power'] and (EventID=107 or EventID=507) or Provider[@Name='Microsoft-Windows-Kernel-General'] and (EventID=1)]]" /F`.
- Create a scheduled task in Task Scheduler to keep WSL updated.
  - Call it WSLUpdate
  - Run every day at a time you like
  - Run only if any network is connected
  - Run as soon as possible if a start was missed
  - Stop task if it runs longer than 1 hour
  - Create two "Start Program" actions
    - The first is `wsl.exe -u root -e apt-get update`
    - The second is `wsl.exe -u root DEBIAN_FRONTEND=noninteractive apt-get -y --autoremove dist-upgrade`
- Your node needs to run after Windows reboot for 24/7 uptime. Docker Desktop only starts well with a logged-in user.
To solve this, use [Windows ARSO](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/component-updates/winlogon-automatic-restart-sign-on--arso-).
  - Start group policy editor, find "Computer Configuration > Administrative Templates > Windows Components > Windows sign in Options"
and enable "Sign-in and lock last interactive user automatically after a restart"
  - If you are not using Bitlocker, you may also need "Configure the mode of automatically signing in and locking last interactive user after a restart or cold boot"
I was unable to configure this from the GUI and ended up using RegEdit. Navigate to
`HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System` and create a new DWORD called
`AutomaticRestartSignOnConfig`. Set it to `0` if you use BitLocker, and to `1` if you are not.

- Optional: Improve your WSL experience with [Windows Terminal and oh-my-zsh](https://gist.github.com/zachrank/fc71ed301e9823264ddac4fb77975735)
- Optional: Use sparse VHD for WSL, `wsl.exe --list` and then `wsl.exe --manage DISTRO-NAME --set-sparse true`. I
have not tested the performance impact of this.
- Optional: Configure your Windows drive to be [encrypted with Bitlocker](https://www.windowscentral.com/how-use-bitlocker-encryption-windows-10).
Be very careful to print out the recovery key and keep it safe. Always suspend Bitlocker before doing a UEFI/BIOS
upgrade.

From here, you should be able to configure Eth Docker as usual, see [Quick Start](../Usage/QuickStart.md).
