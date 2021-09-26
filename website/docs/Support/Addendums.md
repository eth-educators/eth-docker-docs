---
id: Addendums
title:  Addendums.
sidebar_label: Addendums
---

## Addendum: Remove all traces of the client

This project uses docker volumes to store the Ethereum PoW and PoS databases, as
well as validator keys for the validator client. You can see these volumes with
`sudo docker volume ls` and remove them with `sudo docker volume rm`, as long as they are
not in use.

This can be useful when moving between testnets or from a testnet to main net, without
changing the directory name the project is stored in; or when you want to start over
with a fresh database. Keep in mind that synchronizing Ethereum 1 can take days on main
net, however.

> **Caution** If you are removing the client to recreate it, please be careful
> to wait 10 minutes before importing validator key(s) and starting it again.
> The slashing protection DB will be gone, and you risk slashing your validator(s)
> otherwise.

## Addendum: Troubleshooting

A few useful commands if you run into issues. As always, `sudo` is a Linux-ism and may not be needed on MacOS.

`sudo docker-compose stop servicename` brings a service down, for example `docker-compose stop validator`.<br />
`sudo docker-compose down` will stop the entire stack.<br />
`sudo docker-compose up -d servicename` starts a single service, for example `sudo docker-compose up -d validator`.
The `-d` means "detached", not connected to your input session.<br />
`sudo docker-compose run servicename` starts a single service and connects your input session to it. Use the Ctrl-p Ctrl-q
key sequence to detach from it again.

`sudo docker ps` lists all running services, with the container name to the right.<br />
`sudo docker logs containername` shows logs for a container, `sudo docker logs -f --tail 500 containername` scrolls them.<br />
`sudo docker-compose logs servicename` shows logs for a service, `sudo docker-compose logs -f --tail 500 servicename` scrolls them.<br />
`sudo docker exec -it containername /bin/bash` will connect you to a running service in a bash shell.

You may start a service with `sudo docker-compose up -d servicename` and then find it's not in `sudo docker ps`. That means it terminated while
trying to start. To investigate, you could leave the `-d` off so you see logs on command line:<br />
`sudo docker-compose up consensus`, for example.<br />
You could also run `sudo docker-compose logs consensus` to see the last logs of that service and the reason it terminated.<br />

If a service is not starting and you want to bring up its container manually, so you can investigate, first bring everything down:<br />
`sudo docker-compose down`, tear down everything first.<br />
`sudo docker ps`, make sure everything is down.<br />

If you need to see the files that are being stored by services such as consensus, validator, execution, grafana, &c, in Ubuntu Linux you can find
those in /var/lib/docker/volumes. `sudo bash` to invoke a shell that has access.

**HERE BE DRAGONS** You can totally run N copies of an image manually and then successfully start a validator in each and get yourself slashed.
Take extreme care.

Once your stack is down, to run an image and get into a shell, without executing the client automatically:<br />
`sudo docker run -it --entrypoint=/bin/bash imagename`, for example `sudo docker run -it --entrypoint=/bin/bash lighthouse`.<br />
You'd then run Linux commands manually in there, you could start components of the client manually. There is one image per client.<br />
`sudo docker images` will show you all images.

## Addendum: Using eth-docker with a VPN on the node

VPNs typically need IP addressing in the RFC1918 (private) range, and docker by default will utilize the entire range, leaving the VPN to not find a free prefix.
This can be solved by [changing the configuration of Docker](https://docs.storagemadeeasy.com/appliance/docker_networking) to use only a portion of RFC1918 for its address pool.

## Addendum: Additional resources

[Youtube Channel](https://www.youtube.com/c/YorickDowne)
[Security Best Practices](https://www.coincashew.com/coins/overview-eth/guide-or-security-best-practices-for-a-eth2-validator-beaconchain-node)

