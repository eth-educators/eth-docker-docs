---
id: GethPrune
title:  Offline prune Geth.
sidebar_label: Prune Geth
---

The Geth DB will [grow over time](../Usage/ResourceUsage.md), and may fill a 1TB SSD in
about 6 months.

You can offline prune Geth, bringing it back down close to its initial DB size. You may
want [a failover execution client](../Usage/ClientSetup.md) configured for your consensus client.

The prerequisites for offline pruning Geth are:
- [ ] The volume Geth stores its DB on has 50 GiB of free space or more. We know 25 GiB is not enough, and may corrupt the DB.
- [ ] Geth 1.10.x installed
- [ ] Geth is fully synced
- [ ] Geth has finished creating a snapshot, and this snapshot is 128 blocks old or older

You can observe Geth logs with `sudo docker-compose logs -f execution`. If it is importing (not syncing) blocks, is done with initial
state import, and does not show a snapshot ETA, it is fully synced and has finished the snapshot generation.

To prune the Geth database automatically:
* `sudo ./ethd prune-geth`
  
To prune the Geth database manually:
* `sudo docker-compose stop execution && sudo docker-compose rm execution` - stop Geth
* `sudo docker-compose run --rm -d execution snapshot prune-state` - start the pruning process
* Observe pruning progress with: `sudo docker ps` to get the container name (it'll contain `execution_run`), and `sudo docker logs -f --tail 500 CONTAINERNAME`
* When pruning is done: `sudo docker-compose up -d execution`
* And observe that Geth is running correctly: `sudo docker-compose logs -f execution`
