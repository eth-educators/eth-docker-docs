---
id: GethPrune
title:  Offline prune Geth / Online prune Nethermind.
sidebar_label: Prune Geth or Nethermind
---

### Automatic Nethermind prune

By default, Nethermind will prune when free disk space falls below 350 GiB. If you want to disable that, `nano .env` and change `AUTOPRUNE_NM` to `false`.

### Semi-automated Geth or Nethermind prune

The Geth DB will [grow over time](../Usage/ResourceUsage.md), and may fill a 2TB SSD in a year or two.

You can offline prune Geth, bringing it back down close to its initial DB size.

Run `./ethd prune-geth` if using Geth. It will check prerequisites, offline prune Geth, and restart it.

Run `./ethd prune-nethermind` if using Nethermind. It will check prerequisites, online prune Nethermind, and restart it.

### Automatic Geth prune

> This script is expected to become obsolete with the release of Geth 1.12 and pbss

The script `./autoprune.sh` can be run in crontab to monitor disk space, and start a Geth prune when free disk space is below 100 GiB or below 10%, whichever comes first.

The script requires the `bc` package, install that first: `sudo apt install bc`

The script needs to be able to execute docker commands. If your user is a member of the `docker` group - that is, you can run `docker ps` without needing `sudo` - then you can `crontab -e` to add a crontab entry. If you require `sudo` for docker commands, place the script in root's crontab instead via `sudo crontab -e`.

An entry such as the following would run the script every day at 8AM local. Adjust the path to point to where your instance of eth-docker has been installed.

```
MAILTO=user@example.com
00 8 * * * /home/USER/eth-docker/auto-prune.sh
```

The `MAILTO` line will attempt to send you email when the script starts a prune. You'll need something like [msmtp](https://blog.dftorres.ca/?p=478) for those mails to reach you.

The script can be run as `auto-prune.sh --dry-run` if you just want the email alert and not the automatic prune itself. `--dry-run` works without eth-docker installed, as well.
