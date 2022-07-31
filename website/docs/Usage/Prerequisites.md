---
id: Prerequisites
title: "Step 1: Install Prerequisites."
sidebar_label: Prerequisites
---

This project relies on docker and docker-compose, and git to bring the
project itself in. It has been tested on Linux, and is expected to work on MacOS.

## Ubuntu Prerequisites

> Ubuntu can be installed with the Docker snap package, which can cause
> issues including complete data loss on upgrade. We highly recommend removing this
> via `sudo snap remove --purge docker`. Note this action will delete all data kept
> in docker. If you are running the snap Docker package and have data you need to keep,
> please ask for help in the ethstaker Discord.

> The following prerequisites will be installed on the Linux server you
> will run your node on. The machine you use to connect *to* the Linux server
> only requires an SSH client.

Update all packages
```
sudo apt update && sudo apt -y dist-upgrade
```
and install prerequisites
```
sudo apt install -y docker-compose
```
then enable the docker service
```
sudo systemctl enable --now docker
```

> After installation, the docker service might not be enabled to start on
> boot. The systemctl command above enables it.
> Verify the status of the docker service with `sudo systemctl status docker`

You know it was successful when you saw messages scrolling past that install docker and docker-compose.

### Ubuntu 20.04 changes

Ubuntu 20.04 ships with docker-compose 1.25.0, too low for eth-docker 2.x. On 20.04, update
docker-compose manually to 1.29.2. This is *not* necessary on Ubuntu 22.04.

```
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/bin/docker-compose && sudo chmod +x /usr/bin/docker-compose
docker-compose version
```

## Debian 11

On Debian 11, you'd want to use docker-ce with the compose plugin. This will bring in docker-ce:

```
sudo apt-get update
sudo apt-get -y install ca-certificates curl gnupg lsb-release
sudo mkdir -p /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

If you like, you can also add an alias, replacing `MYUSERNAME` with your actual user name: `echo 'alias docker-compose="docker compose"' >>/home/MYUSERNAME/.profile`

## Generic Linux

Other distributions are expected to work as long as they support
git, docker, and docker-compose.

On Linux, docker-compose runs as root by default. The individual containers do not,
they run as local users inside the containers. "Rootless mode" is expected to
work for docker with this project, as it does not use AppArmor.

## MacOS Prerequisites

> The following prerequisites apply if you are going to use MacOS as a server
> to run an Ethereum staking full node. If you use MacOS to connect *to* a node server, all
> you need is an SSH client.

- Install [Docker Desktop](https://www.docker.com/products/docker-desktop) and allocate 16 GiB of RAM and 1.5 TB of storage to it.
- Install prerequisites via homebrew: `brew install coreutils newt`

## Windows 10/11 discouraged

While it is technically possible to run this project, and thus a node, on Windows 10/11,
I want to [discourage that idea](../Support/Windows.md). Windows 10/11 is fine as an SSH client to connect *to*
your Linux server, but not as a basis to run the node server itself inside Docker.

The challenges inherent in running on Windows 10/11 are easier to solve when using the Windows-native
versions of the clients, rather than wrapping Docker around them.
