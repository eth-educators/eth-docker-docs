---
id: GethPrune
title:  Offline prune Geth.
sidebar_label: Prune Geth
---

The Geth DB will [grow over time](../Usage/ResourceUsage.md), and may fill a 1TB SSD in
about 6 months.

You can offline prune Geth, bringing it back down close to its initial DB size. You may
want [a failover execution client](../Usage/ClientSetup.md) configured for your consensus client.

### Semi-automated Geth prune

Run `./ethd prune-geth`. It will check prerequisites, prune Geth, and restart it

### Fully automated Geth prune

The script `./autoprune.sh` can be run in crontab to monitor disk space, and start a Geth prune when free disk space is below 100 GiB or below 10%, whichever comes first.

The script requires the `bc` package, install that first: `sudo apt install bc`

The script needs to be able to execute docker commands. If your user is a member of the `docker` group - that is, you can run `docker ps` without needing `sudo` - then you can `crontab -e` to add a crontab entry. If you require `sudo` for docker commands, place the script in root's crontab instead via `sudo crontab -e`.

An entry such as the following would run the script every day at 8AM local. Adjust the path to point to where your instance of eth-docker has been installed.

```
MAILTO=user@example.com
00 8 * * * /home/USER/eth-docker/auto-prune.sh
```

The `MAILTO` line will attempt to send you email when the script starts a prune. You'll need something like [ssmtp](https://help.ubuntu.com/community/EmailAlerts) for those mails to reach you.

The script can be run as `auto-prune.sh --dry-run` if you just want the email alert and not the automatic prune itself. `--dry-run` works without eth-docker installed, as well.

### Manual Geth prune

To prune the Geth database manually:

Check the prerequisites for offline pruning Geth, which are:
- [ ] The volume Geth stores its DB on has 40 GiB of free space or more. We know 25 GiB is not enough, and may corrupt the DB.
- [ ] Geth 1.10.x installed
- [ ] Geth is fully synced
- [ ] Geth has finished creating a snapshot, and this snapshot is 128 blocks old or older

You can observe Geth logs with `./ethd logs -f execution`. If it is importing (not syncing) blocks, is done with initial
state import, and does not show a snapshot ETA, it is fully synced and has finished the snapshot generation.

Then run these commands:

* `docker-compose stop execution && docker-compose rm execution` - stop Geth
* `docker-compose run --rm --name geth_prune -d execution snapshot prune-state` - start the pruning process
* Observe pruning progress with `docker logs -f --tail 500 geth_prune`
* When pruning is done: `docker-compose up -d execution`
* And observe that Geth is running correctly: `docker-compose logs -f execution`
