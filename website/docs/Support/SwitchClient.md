---
id: SwitchClient
title:  Switching client(s).
sidebar_label: Switch Clients
---

## Overview

It may be desirable to switch clients if you are using one that is close to a [supermajority of clients](https://twitter.com/sproulM_/status/1440512518242197516). If any one client has a supermajority of the chain, there
is a risk that a [consensus bug could lead to a mass slashing](https://www.symphonious.net/2021/09/23/what-happens-if-beacon-chain-consensus-fails/) and validators on this client would lose 3/4th of their staked ETH in that
worst-case scenario.  

As of September 2021, Prysm is the client that has close to a supermajority (64.8%). While it is an excellent, high-quality client, its share of the network introduces a slashing risk that is best avoided. The other clients
are just as robust, and we are encouraging a move to one of those, until no one client has more than around 50% of the network. An ideal distribution would see no one client with more than 25% of the network, but this is
not a realistic goal now, and maybe ever.

To make the switch operationally easy, we'll be suggesting to use Infura as an interim execution client during the switch.

Choose any consensus client and any execution client you'd like to use, and then follow the instructions below.

## Switching clients if you are already using eth-docker

1. Create free Infura projects

If you do not already have an Ethereum project with Infura: Create an account with [Infura](https://infura.io/), and log in. From the Dashboard, choose "Ethereum" and "Create New Project". Give it a name. This will be your remote execution client ("eth1").

If you are going to use a consensus client with rapid sync capability (as of September 2021, Teku): From the Dashboard, choose "ETH 2" and "Create New Project". Give it a name. This will be your remote consensus client ("beacon").

2. Switch the existing setup to use Infura

Skip this step if you are already using Infura instead of your own execution client such as Geth.

Edit the `.env` file, for example `cd ~/eth-docker && nano .env`. Remove `geth.yml` and, if you use it, `geth-grafana.yml` from the `COMPOSE_FILE` line. Similarly for other clients such as Erigon, Nethermind and Besu, if you are using those instead.

Change `EC_NODE` to use the Infura URL, which you can see in the Settings of your Infura project.

Save the file and `sudo ./ethd restart`, then confirm that the consensus and validator client are up and running correctly: `sudo ./ethd logs -f consensus` and `sudo ./ethd logs -f validator`

Lastly, remove the execution client database volume: `docker volume ls` followed by `sudo docker volume rm ECVOLUME`, e.g. for Geth `sudo docker volume rm eth-docker_geth-eth1-data`.

> [!TIP]
> As always, `sudo` commands for docker are only necessary if your user is not part of the `docker` group. If `docker ps` succeeds, you do not need to use `sudo` for `./ethd` or `docker` or `docker-compose`.

3. Create a new client stack

We'll be running a second copy of eth-docker in its own directory. For example, if the new directory is going to be `~/eth-staker`: `cd ~ && git clone https://github.com/eth2-educators/eth-docker.git eth-staker && cd eth-staker` .

Configure the new stack. Make sure to choose an Infura failover for your execution client, and any of the three minority consensus clients. If using Teku, "rapid sync" can let it sync in minutes. `./ethd config` followed by `sudo ./ethd start`.

**Do not** import validator keys yet. Your validators are still running on your old client, and moving them over needs to be done with care to avoid running them in two places and getting yourself slashed.

Observe the consensus client, and take the next step once it is fully synced: `sudo ./ethd logs -f consensus`. This can take a few days.

4. Move your validators

**Exercise extreme caution. Running your validators in two locations at once would lead to slashing**

Follow the [moving a validator](../Support/Moving.md) instructions. You'll be inside the old directory, e.g. `~/eth-docker`, for the first part where you delete the keys and make sure they are gone, and inside the new directory, e.g. `~/eth-staker`, for
the second part where you import the keys again.

5. Shut down the old client and remove its storage

Inside the directory for the old client, e.g. `cd ~/eth-docker`, stop the client: `sudo ./ethd stop`. Then find its volumes via `sudo docker volume ls`, they will all start with the name of the directory. And `sudo docker volume rm VOLUMENAME` those.

Finally, you can remove the directory itself: For example, if it was `~/eth-docker`, `cd ~ && rm -rf eth-docker`.

6. Change startup service and auto-prune crontab

These are optional components that you may not be using.

- If you are using the belt-and-suspenders approach to auto-start with a systemd service that starts eth-docker: `sudo nano /etc/systemd/system/eth.service` and change the `WorkingDirectory` line. E.g. with user `ubuntu` and old directory `eth-docker`
and new directory `eth-staker`, you'd change it from `WorkingDirectory=/home/ubuntu/eth-docker` to `WorkingDirectory=/home/ubuntu/eth-staking`. Finally, tell systemd you made the change: `sudo systemctl daemon-reload`.

- If you are using the `auto-prune.sh` script in crontab, change where crontab looks for it: `crontab -e` and adjust the path to the new directory.

7. Get with Superphiz and claim your POAP

[TBD](https://twitter.com/superphiz/status/1442043723790102528?s=19) and, this is really an excellent idea.

## Switching clients from systemd to eth-docker

If you are using systemd with guides from Somer Esat, Coincashew or Metanull, and want to give eth-docker's automation a whirl, these instructions will show you how to make the switch.

1. Create free Infura projects

If you do not already have an Ethereum project with Infura: Create an account with [Infura](https://infura.io/), and log in. From the Dashboard, choose "Ethereum" and "Create New Project". Give it a name. This will be your remote execution client ("eth1").

If you are going to use a consensus client with rapid sync capability (as of September 2021, Teku): From the Dashboard, choose "ETH 2" and "Create New Project". Give it a name. This will be your remote consensus client ("beacon").

2. Switch the existing setup to use Infura

Skip this step if you are already using Infura instead of your own execution client such as Geth.

### Somer Esat's guide

`sudo nano /etc/systemd/system/prysmbeacon.service` and change `--http-web3provider=` in `ExecStart` to the Infura URL, which you can see in the Settings of your Infura project. E.g. `ExecStart=/usr/local/bin/beacon-chain --datadir=/var/lib/prysm/beacon --http-web3provider=https://mainnet.infura.io/v3/MYINFURAID --accept-terms-of-use`.

`sudo systemctl daemon-reload` and `sudo systemctl restart prysmbeacon`. Verify that the beacon is still working well with `journalctl -fu prysmbeacon`.

Disable the Geth service and remove its database: `sudo systemctl disable geth` and `sudo rm -rf /var/lib/goethereum`.

### Metanull's guide

`sudo -u beacon nano /home/beacon/prysm-beacon.yaml` and change `http-web3provider:` to the Infura URL, which you can see in the Settings of your Infura project. E.g. `http-web3provider: "https://mainnet.infura.io/v3/MYINFURAID"`.

`sudo systemctl restart beacon-chain` and verify that the beacon is still working well with `journalctl -fu beacon-chain`.

Disable the Geth service and remove its database: `sudo systemctl disable geth` and `sudo rm -rf /home/geth/*`.

### Coincashew's guide

`sudo nano /etc/systemd/system/beacon-chain.service` and change `--http-web3provider=` in `ExecStart` to the Infura URL, which you can see in the Settings of your Infura project. E.g. `ExecStart=/home/MYUSER/prysm/prysm.sh beacon-chain --p2p-host-ip=${ClientIP} --monitoring-host="0.0.0.0" --http-web3provider=https://mainnet.infura.io/v3/MYINFURAID --accept-terms-of-use`.

`sudo systemctl daemon-reload` and `sudo systemctl restart beacon-chain`. Verify that the beacon is still working well with `journalctl -fu beacon-chain`.

Disable the Geth service and remove its database: `sudo systemctl disable eth1` and `sudo rm -rf ~/.ethereum`.

3. Create a new eth-docker client stack

Install prerequisites: `sudo snap remove --purge docker` just in case a snap docker is installed, then `sudo apt update && sudo apt install -y git docker.io docker-compose`.

Optionally, make your user part of the docker group: `sudo usermod -aG docker MYUSER && newgrp docker`.

Clone eth-docker, for example into `~/eth-docker`: `cd ~ && git clone https://github.com/eth2-educators/eth-docker.git && cd eth-docker` .

Configure the client stack. Make sure to choose an Infura failover for your execution client, and any of the three minority consensus clients. If using Teku, "rapid sync" can let it sync in minutes. `./ethd config` followed by `sudo ./ethd start`.

**Do not** import validator keys yet. Your validators are still running on your old client, and moving them over needs to be done with care to avoid running them in two places and getting yourself slashed.

Observe the consensus client, and take the next step once it is fully synced: `sudo ./ethd logs -f consensus`. This can take a few days.

> [!TIP]
> `sudo` commands for docker are only necessary if your user is not part of the `docker` group. If `docker ps` succeeds, you do not need to use `sudo` for `./ethd` or `docker` or `docker-compose`.

4. Move your validators

**Exercise extreme caution. Running your validators in two locations at once would lead to slashing**

Make sure you have your `keystore-m_ETC.json` files and the password for them.

### Somer Esat's guide

First, remove the validator keys from the existing setup. `sudo systemctl stop prysmvalidator`. Remove the keys: `sudo rm -rf /var/lib/prysm/validator`. 

Verify that the validator can't find them: `sudo systemctl start prysmvalidator` and `journalctl -fu prysmvalidator`, observe that it complains it cannot find its keys. **Do not proceed if the keys are still accesible to the validator**

`sudo systemctl stop prysmvalidator` and `sudo systemctl disable prysmvalidator` to shut it down for good.

Follow the [moving a validator](../Support/Moving.md) instructions. You already removed the keys: Wait 10 minutes after that, then import them again from inside the `~/eth-docker` directory.

### Metanull's guide

First, remove the validator keys from the existing setup. `sudo systemctl stop validator`. Remove the keys: `sudo rm -rf /home/validator/.eth2validators`

Verify that the validator can't find them: `sudo systemctl start validator` and `journalctl -fu validator`, observe that it complains it cannot find its keys. **Do not proceed if the keys are still accesible to the validator**

`sudo systemctl stop validator` and `sudo systemctl disable validator` to shut it down for good.

Follow the [moving a validator](../Support/Moving.md) instructions. You already removed the keys: Wait 10 minutes after that, then import them again from inside the `~/eth-docker` directory.

### Coincashew's guide

First, remove the validator keys from the existing setup. `sudo systemctl stop validator`. Remove the keys: `sudo rm -rf ~/.eth2validators`.

Verify that the validator can't find them: `sudo systemctl start validator` and `journalctl -fu validator`, observe that it complains it cannot find its keys. **Do not proceed if the keys are still accesible to the validator**

`sudo systemctl stop validator` and `sudo systemctl disable validator` to shut it down for good.

Follow the [moving a validator](../Support/Moving.md) instructions. You already removed the keys: Wait 10 minutes after that, then import them again from inside the `~/eth-docker` directory.

5. Remove old beacon database

We can remove the old beacon chain database and disable the service.

### Somer Esat's guide

`sudo systemctl stop prysmbeacon && sudo systemctl disable prysmbeacon` and `sudo rm -rf /var/lib/prysm`.

Optionally, remove the goeth and prysm users: `sudo deluser goeth && sudo deluser prysmbeacon && sudo deluser prysmvalidator`.

Optionally, remove the old executables: `sudo apt remove -y geth && sudo apt -y auto-remove && sudo rm /usr/local/bin/validator && sudo rm /usr/local/bin/beacon-chain`.


### Metanull's guide

`sudo systemctl stop beacon-chain && sudo systemctl disable beacon-chain` and `sudo rm -rf /home/beacon/*`.

Optionally, remove the geth and prysm users: `sudo deluser --remove-home geth && sudo deluser --remove-home beacon && sudo deluser --remove-home validator`.

Optionally, remove the old Geth package: `sudo apt remove -y ethereum && sudo apt -y auto-remove`.

### Coincashew's guide

`sudo systemctl stop beacon-chain && sudo systemctl disable beacon-chain` and `sudo rm -rf ~/prysm`.

Optionally, remove the old Geth package: `sudo apt remove -y ethereum && sudo apt -y auto-remove`.

6. Set an auto-prune crontab

This is an optional component for [auto-pruning Geth](../Support/GethPrune.md#fully-automated-geth-prune).

7. Get with Superphiz and claim your POAP

[TBD](https://twitter.com/superphiz/status/1442043723790102528?s=19) and, this is really an excellent idea.
