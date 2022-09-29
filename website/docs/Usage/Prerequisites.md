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

This project has been tested on Ubuntu 22.04 "Jammy Jellyfish" and Ubuntu 20.04 "Focal Fossa". A [LTS](https://wiki.ubuntu.com/Releases), Long Term Support, version of Ubuntu is recommended, either Ubuntu Desktop or Ubuntu Server. If installing Ubuntu Server, make doubly sure to extend the "lv", logical volume, to use your entire disk.

### Automatic installation

Clone the project: `git clone https://github.com/eth-educators/eth-docker.git && cd eth-docker`

Run `./ethd install` and follow prompts

### Manual installation

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

Ubuntu 20.04 ships with docker-compose 1.25.0, too low for eth-docker 2.x. On 20.04, update docker-compose manually to 1.29.2. This is *not* necessary on Ubuntu 22.04.

```
sudo apt update && sudo install -y curl
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

## macOS Prerequisites

> The following prerequisites apply if you are going to use macOS as a server
> to run an Ethereum staking full node. If you use macOS to connect *to* a node server, all
> you need is an SSH client.

- Install [Docker Desktop](https://www.docker.com/products/docker-desktop) and allocate 16 GiB of RAM and 1.5TB or so of storage space to it.
- Install prerequisites via homebrew: `brew install coreutils newt`

## Windows 10/11 discouraged

While it is technically possible to run this project, and thus a node, on Windows 10/11,
I want to [discourage that idea](../Support/Windows.md). Windows 10/11 is fine as an SSH client to connect *to*
your Linux server, but not as a basis to run the node server itself inside Docker.

The challenges inherent in running on Windows 10/11 are easier to solve when using the Windows-native
versions of the clients, rather than wrapping Docker around them.
