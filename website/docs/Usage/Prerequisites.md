---
id: Prerequisites
title: "Step 1: Install Prerequisites."
sidebar_label: Prerequisites
---

This project relies on docker and docker-compose, and git to bring the
project itself in. It has been tested on Linux, and is expected to work on MacOS.

> The following prerequisites will be installed on the Linux server you
> will run your node on. The machine you use to connect *to* the Linux server
> only requires an SSH client.

## Ubuntu Prerequisites

> Ubuntu can be installed with the Docker snap package, which can cause
> issues including complete data loss on upgrade. We highly recommend removing this
> via `sudo snap remove --purge docker`. Note this action will delete all data kept
> in docker. If you are running the snap Docker package and have data you need to keep,
> please ask for help in the ethstaker Discord.

This project has been tested on Ubuntu 22.04 "Jammy Jellyfish" and Ubuntu 20.04 "Focal Fossa". A [LTS](https://wiki.ubuntu.com/Releases), Long Term Support, version of Ubuntu is recommended, either Ubuntu Desktop or Ubuntu Server. If installing Ubuntu Server, make doubly sure to extend the "lv", logical volume, to use your entire disk.

### Automatic installation

Clone the project: `git clone https://github.com/eth-educators/eth-docker.git && cd eth-docker`

Run `./ethd install` and follow prompts

### Manual installation

Install docker-ce:

```
sudo apt-get update
sudo apt-get -y install ca-certificates curl gnupg lsb-release whiptail
sudo mkdir -p /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

You know it was successful when you saw messages scrolling past that install docker and docker compose.

If you like, you can also add a docker-compose alias, replacing `MYUSERNAME` with your actual user name: `echo 'alias docker-compose="docker compose"' >>/home/MYUSERNAME/.profile`

## Debian 10/11

### Automatic installation

Clone the project: `git clone https://github.com/eth-educators/eth-docker.git && cd eth-docker`

Run `./ethd install` and follow prompts

### Manual installation

Install docker-ce:

```
sudo apt-get update
sudo apt-get -y install ca-certificates curl gnupg lsb-release whiptail
sudo mkdir -p /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

You know it was successful when you saw messages scrolling past that install docker and docker compose.

If you like, you can also add a docker-compose alias, replacing `MYUSERNAME` with your actual user name: `echo 'alias docker-compose="docker compose"' >>/home/MYUSERNAME/.profile`

## Generic Linux

Other distributions are expected to work as long as they support
git, docker, and docker compose.

On Linux, docker compose runs as root by default. The individual containers do not,
they run as local users inside the containers. "Rootless mode" is expected to
work for docker with this project, as it does not use AppArmor.

## Change Docker storage location

Taken from the [RocketPool docs](https://docs.rocketpool.net/guides/node/docker.html#configuring-docker-s-storage-location)

By default, Docker will store all of its container data on your operating system's drive. In some cases, this is **not** what you want. For example, you may have a small boot drive and a second larger SSD for the chain data.

> If you just one drive and are good with the default behavior, don't make these adjustments

To change the docker volume location, create a new file called /etc/docker/daemon.json as the root user:

```
sudo nano /etc/docker/daemon.json
```

Add this as the contents:

```
{
    "data-root": "<your external mount point>/docker"
}
```

where `<your external mount point>` is the directory that your other drive is mounted to.

Next, make the folder:

```
sudo mkdir -p <your external mount point>/docker
```

If you already have existing volumes that you want to move, stop docker and move them over:

```
sudo systemctl stop docker
sudo cp -rp /var/lib/docker <your external mount point>/
```

Now, restart the docker daemon so it picks up on the changes:

```
sudo systemctl restart docker
```

After that, Docker will store its data on your desired disk.

## Switching from docker.io to docker-ce

If you are currently running Canonical's docker.io and you'd like to switch to docker-ce, the
"Community Edition" released by Docker, Inc., this is how.

You do not need to stop running containers manually, and they will be back up and running after. All
volumes and other data kept in Docker will stay intact.

Prepare docker-ce repo:

```
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg lsb-release

sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list >/dev/null
 
sudo apt-get update
```

Remove docker.io:

```
sudo apt-get remove --autoremove -y docker.io containerd runc docker-compose
```

Reboot - yes this is mandatory:

```
sudo reboot
```

Install docker-ce:

```
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

Verify that all containers started automatically:
```
sudo docker ps
```

If you like, you can also add a docker-compose alias, replacing `MYUSERNAME` with your actual user name: `echo 'alias docker-compose="docker compose"' >>/home/MYUSERNAME/.profile`

## rootless Docker

eth-docker works with [rootless Docker](https://docs.docker.com/engine/security/rootless/).

If using Grafana, use `grafana-rootless.yml` instead of `grafana.yml`. This omits node-exporter, cadvisor, promtail and Loki.

If using traefik, either change its ports in `.env` to be above `1024`, or [expose privileged ports](https://docs.docker.com/engine/security/rootless/#exposing-privileged-ports).

## macOS Prerequisites

> The following prerequisites apply if you are going to use macOS as a server to run an Ethereum staking full node. If you use macOS to connect *to* a node server, all you need is an SSH client.

- Install [Docker Desktop](https://www.docker.com/products/docker-desktop) and allocate 16+ GiB of RAM and 1.5TB or so of storage space to it, in Preferences->Resources->Advanced.
- Install prerequisites via homebrew: `brew install coreutils newt bash`
- You may need to log out and back into your terminal session to have the right version of bash. Try `bash --version` and verify it's 5.x or higher.
- Verify git is installed with `git --version`. It will show a Desktop prompt to install it if it isn't.

> Docker Desktop on macOS has its ideosyncrasies. An arguable easier path could be to keep macOS just for firmware updates and [dual-boot into Debian Linux](https://wiki.debian.org/InstallingDebianOn/Apple).

## Windows 10/11 discouraged

While it is technically possible to run this project, and thus a node, on Windows 10/11,
I want to [discourage that idea](../Support/Windows.md). Windows 10/11 is fine as an SSH client to connect *to*
your Linux server, but not as a basis to run the node server itself inside Docker.

The challenges inherent in running on Windows 10/11 are easier to solve when using the Windows-native
versions of the clients, rather than wrapping Docker around them.
