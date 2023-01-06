---
id: Troubleshooting
title:  Troubleshooting.
sidebar_label: Troubleshooting
---

As always, add `sudo` to these commands if your user is not part of the `docker` group.

## Visibility

`./ethd logs -f consensus` and `./ethd logs -f execution` or more broadly `./ethd logs -f <servicename>` will show you logs. When the service has been running for a while, you may want to start at the end, like so: `./ethd logs -f --tail 50 consensus`.

`docker ps` will show you a list of running containers and their mapped ports.

## Stopping and starting, updating

`./ethd stop` stops all services, `./ethd up` starts them. `./ethd restart` does both. `./ethd update` brings in updates to the clients, `./ethd update --refresh-targets` does that while resetting docker tag targets in `.env` to defaults.

## Targets, source build

There are build targets in `.env` which, for the most part, you need not touch. For Lighthouse in particular, if your CPU is older than Broadwell (2014), you'll want the `latest` target, not `latest-modern`. Change `LH_DOCKER_TAG=latest` in `.env` and run `./ethd update`, then `./ethd up`.

If you want to build from source, change to `Dockerfile.source` instead of `Dockerfile.binary` for that particular client. The default source targets use the latest released tag on github; adjust to whichever tag or branch you want to build from.

## Remove all traces of the client

This project uses docker volumes to store the Ethereum PoW and PoS databases, as
well as validator keys for the validator client. `./ethd terminate` will remove all
volumes. 

If you prefer to do that manually, you can see the volumes with
`docker volume ls` and remove them with `docker volume rm`, as long as they are
not in use.

This can be useful when moving between testnets or from a testnet to main net, without
changing the directory name the project is stored in; or when you want to start over
with a fresh database. Keep in mind that synchronizing Ethereum 1 can take days on main
net, however.

> **Caution** If you are removing the client to recreate it, please be careful
> to wait 15 minutes before importing validator key(s) and starting it again.
> The slashing protection DB will be gone, and you risk slashing your validator(s)
> otherwise.

## Using eth-docker with a VPN on the node

VPNs typically need IP addressing in the RFC1918 (private) range, and docker by default will utilize the entire range, leaving the VPN to not find a free prefix.

This can be solved by [changing the configuration of Docker](https://docs.storagemadeeasy.com/appliance/docker_networking) to use only a portion of RFC1918 for its address pool.

## Interacting with Docker directly

`./ethd cmd` runs `docker-compose` or `docker compose`, depending on the compose version, and will use `sudo` as required. You can also run compose commands without using the `./ethd` wrapper.

`docker-compose stop servicename` brings a service down, for example `docker-compose stop validator`.<br />
`docker-compose down` will stop the entire stack.<br />
`docker-compose up -d servicename` starts a single service, for example `docker-compose up -d validator`.
The `-d` means "detached", not connected to your input session.<br />
`docker-compose run servicename` starts a single service and connects your input session to it. Use the Ctrl-p Ctrl-q
key sequence to detach from it again.

`docker ps` lists all running services, with the container name to the right.<br />
`docker logs containername` shows logs for a container, `docker logs -f --tail 500 containername` scrolls them.<br />
`docker-compose logs servicename` shows logs for a service, `docker-compose logs -f --tail 500 servicename` scrolls them.<br />
`docker exec -it containername bash` will connect you to a running service in a bash shell.

You may start a service with `docker-compose up -d servicename` and then find it's not in `docker ps`. That means it terminated while trying to start. To investigate, you could leave the `-d` off so you see logs on command line:<br />
`docker-compose up consensus`, for example.<br />
You could also run `docker-compose logs --tail 100 consensus` to see the last logs of that service and the reason it terminated.<br />

If a service is not starting and you want to bring up its container manually, so you can investigate, first bring everything down:<br />
`docker-compose down`, tear down everything first.<br />
`docker ps`, make sure everything is down.<br />

If you need to see the files that are being stored by services such as consensus, validator, execution, grafana, &c, in Ubuntu Linux you can find those in /var/lib/docker/volumes. `sudo bash` to invoke a shell that has access.

**HERE BE DRAGONS** You can totally run N copies of an image manually and then successfully start a validator in each and get yourself slashed if the built-in database lock fails.
Take extreme care.

Once your stack is down, to run an image and get into a shell, without executing the client automatically:<br />
`docker run -it --entrypoint=/bin/bash imagename`, for example `docker run -it --entrypoint=/bin/bash lighthouse:local`.<br />
You'd then run Linux commands manually in there, you could start components of the client manually. There is one image per client.<br />
`docker images` will show you all images.

