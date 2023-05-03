---
id: SwitchClient
title:  Switching client(s).
sidebar_label: Switch Clients
---

## Overview

It may be desirable to switch clients if you are using one that is close to a supermajority of validators. If any one client has a supermajority of the chain, there is a risk that a [consensus bug could lead to a mass slashing](https://www.symphonious.net/2021/09/23/what-happens-if-beacon-chain-consensus-fails/) and validators on this client would lose 3/4th of their staked ETH in that worst-case scenario.  

Choose any consensus client and any execution client you'd like to use, and then follow the instructions below.

Note that you either need sufficient disk space to sync two execution clients, or keep the same execution client and move its database, or accept downtime while your new execution client syncs.

## Switching clients if you are already using eth-docker

### 1. Create a new client stack

We'll be running a second copy of eth-docker in its own directory. For example, if the new directory is going to be `~/eth-staker`: `cd ~ && git clone https://github.com/eth2-educators/eth-docker.git eth-staker && cd eth-staker` .

Configure the new stack. Make sure to choose "rapid sync" so the consensus client can sync in minutes. `./ethd config` followed by `./ethd up`.

**Do not** import validator keys yet. Your validators are still running on your old client, and moving them over needs to be done with care to avoid running them in two places and getting yourself slashed.

Observe consensus client logs with `./ethd logs -f consensus`. Once it is fully synced, you can move the execution client database if you kept the same execution client between the old and new setup.

> `sudo` commands for docker are necessary if your user is not part of the `docker` group. If `docker ps` does not succeed, you need to use `sudo` for `docker` or `docker-compose`, or make your user part of the `docker` group.

### 1a. Optional: Move the existing execution client database to its new location

This avoids a fresh sync of the execution client database in the new location. Note you might want to fresh sync if your DB has grown to the point where starting over is beneficial.

In the location for the new client stack, e.g. `~/eth-staker`, stop the stack: `./ethd stop`

`docker volume ls` to see the volume names of the old and new execution client. For Geth, you might see `eth-docker_geth-eth1-data` and `eth-staker_geth-eth1-data`.

Remove the partially synced contents of the **new** database location: `sudo rm -rf /var/lib/docker/volumes/NEWVOLUME/_data`, e,g. for Geth `sudo rm -rf /var/lib/docker/volumes/eth-staker_geth-eth1-data/_data`

Move the `_data` directory in the **old** volume to the new database location: `sudo mv /var/lib/docker/volumes/OLDVOLUME/_data -t /var/lib/docker/volumes/NEWVOLUME`. For Geth this might be `sudo mv /var/lib/docker/volumes/eth-docker_geth-eth1-data/_data -t /var/lib/docker/volumes/eth-staker_geth-eth1-data`

Start the new stack again: `./ethd up`, then observe that your execution client is running well and is synced to head: `./ethd logs -f execution`.

### 2. Move your validators

**Exercise extreme caution. Running your validators in two locations at once would lead to slashing**

Follow the [moving a validator](../Support/Moving.md) instructions. You'll be inside the old directory, e.g. `~/eth-docker`, for the first part where you delete the keys and make sure they are gone, and inside the new directory, e.g. `~/eth-staker`, for the second part where you import the keys again.

### 3. Shut down the old client and remove its storage

Inside the directory for the old client, e.g. `cd ~/eth-docker`, stop the client: `./ethd stop`. Then find its volumes via `docker volume ls`, they will all start with the name of the directory. And `docker volume rm VOLUMENAME` those.

Finally, you can remove the directory itself: For example, if it was `~/eth-docker`, `cd ~ && rm -rf eth-docker`.

### 4. Change auto-prune crontab

These is an optional component that you may not be using.

If you are using the `auto-prune.sh` script in crontab, change where crontab looks for it: `crontab -e` and adjust the path to the new directory.

## Switching clients from systemd to eth-docker

If you are using systemd with guides from Somer Esat, Coincashew or Metanull, and want to give eth-docker's automation a whirl, these instructions will show you how to make the switch.

### 1. Create a new eth-docker client stack

Clone eth-docker, for example into `~/eth-docker`: `cd ~ && git clone https://github.com/eth2-educators/eth-docker.git && cd eth-docker` .

Install prerequisites: `./ethd install`

Configure the client stack. Make sure to choose an Infura failover for your execution client, and any of the four minority consensus clients. "Rapid sync" can let the consensus layer client sync in minutes. `./ethd config`, followed by `./ethd start`.

**Do not** import validator keys yet. Your validators are still running on your old client, and moving them over needs to be done with care to avoid running them in two places and getting yourself slashed.

Observe the consensus client, and make sure it is synchronizing: `./ethd logs -f consensus`.

> `sudo` commands for docker are necessary if your user is not part of the `docker` group. If `docker ps` does not succeed, you need to use `sudo` for `docker` or `docker-compose`, or make your user part of the `docker` group.

### 1a. Optional: Move the existing execution client database to its new location

This only works if you've chosen the same execution client in eth-docker as you are running in systemd. This avoids a fresh sync of the execution client database in the new location. Note you might want to fresh sync if your DB has grown to the point where starting over is beneficial.

In the location for the new client stack, e.g. `~/eth-docker`, stop the stack: `./ethd stop`

`docker volume ls` to see the volume name of the new execution client. For Geth, you might see `eth-docker_geth-eth1-data`.

Remove the partially synced contents of the new database location: `sudo rm -rf /var/lib/docker/volumes/NEWVOLUME/_data`, e,g. for Geth `sudo rm -rf /var/lib/docker/volumes/eth-docker_geth-eth1-data/_data`

Move the directory of the systemd EL database to the new database location. This depends on what execution layer client you are using. This example assumes Geth.

#### Somer Esat's guide
 
Disable the Geth service and move its database: `sudo systemctl disable geth` and `sudo mv /var/lib/goethereum -t /var/lib/docker/volumes/eth-docker_geth-eth1-data`.

#### Metanull's guide

Disable the Geth service and move its database: `sudo systemctl disable geth` and `sudo mv /home/geth/* -t /var/lib/docker/volumes/eth-docker_geth-eth1-data`.

#### Coincashew's guide

Disable the Geth service and move its database: `sudo systemctl disable eth1` and `sudo mv ~/.ethereum -t /var/lib/docker/volumes/eth-docker_geth-eth1-data`.

#### Change permissions and start the stack

Change permissions so eth-docker can access the Geth database: `sudo chown -R 10001:10001 /var/lib/docker/volumes/eth-docker_geth-eth1-data`

Start the new stack again: `./ethd up`, then observe that your execution client is running well and is synced to head: `./ethd logs -f execution`.

### 1b. If you did not move Geth with 1a: Shut down Geth

This will stop your validators from attesting. You will incur downtime until the new execution layer database has been fully synced.

#### Somer Esat's guide
 
Disable the Geth service and remove its database: `sudo systemctl disable geth` and `sudo rm -rf /var/lib/goethereum`.

#### Metanull's guide

Disable the Geth service and remove its database: `sudo systemctl disable geth` and `sudo rm -rf /home/geth/*`.

#### Coincashew's guide

Disable the Geth service and remove its database: `sudo systemctl disable eth1` and `sudo rm -rf ~/.ethereum`.

### 2. Move your validators

**Exercise extreme caution. Running your validators in two locations at once would lead to slashing**

Make sure you have your `keystore-m_ETC.json` files and the password for them. Ideally, you should also have a `slashing-protection.json` file.

Stop the validator service. Somer Esat: `sudo systemctl stop prysmvalidator`. Metanull and Coincashew: `sudo systemctl stop validator`.

To export the slashing protection DB from Prysm, adjust this command line to your username and location eth-docker is in and run `sudo validator slashing-protection-history export --datadir=/var/lib/prysm/validator --slashing-protection-export-dir=/home/ubuntu/eth-docker/.eth/validator_keys`

To export the keys from Prysm, run `sudo validator accounts backup --wallet-dir=/var/lib/prysm/validator --backup-dir=/tmp/keys` and then move them to the eth-docker directory, again adjusting for your username: `sudo unzip /tmp/keys/backup.zip -d /home/ubuntu/eth-docker/.eth/validator_keys`. Lastly, remove the zip file again: `sudo rm /tmp/keys/backup.zip`
 
#### Somer Esat's guide

First, remove the validator keys from the existing setup. `sudo systemctl stop prysmvalidator`. Remove the keys: `sudo rm -rf /var/lib/prysm/validator`. 

Verify that the validator can't find them: `sudo systemctl start prysmvalidator` and `journalctl -fu prysmvalidator`, observe that it complains it cannot find its keys. **Do not proceed if the keys are still accessible to the validator**

`sudo systemctl stop prysmvalidator` and `sudo systemctl disable prysmvalidator` to shut it down for good.

Follow the [moving a validator](../Support/Moving.md#import-keys-into-new-client) instructions. You already removed the keys: Wait 15 minutes after that to protect against slashing, then import them again from inside the `~/eth-docker` directory.

#### Metanull's guide

First, remove the validator keys from the existing setup. `sudo systemctl stop validator`. Remove the keys: `sudo rm -rf /home/validator/.eth2validators`

Verify that the validator can't find them: `sudo systemctl start validator` and `journalctl -fu validator`, observe that it complains it cannot find its keys. **Do not proceed if the keys are still accessible to the validator**

`sudo systemctl stop validator` and `sudo systemctl disable validator` to shut it down for good.

Follow the [moving a validator](../Support/Moving.md#import-keys-into-new-client) instructions. You already removed the keys: Wait 15 minutes after that to protect against slashing, then import them again from inside the `~/eth-docker` directory.

#### Coincashew's guide

First, remove the validator keys from the existing setup. `sudo systemctl stop validator`. Remove the keys: `sudo rm -rf ~/.eth2validators`.

Verify that the validator can't find them: `sudo systemctl start validator` and `journalctl -fu validator`, observe that it complains it cannot find its keys. **Do not proceed if the keys are still accessible to the validator**

`sudo systemctl stop validator` and `sudo systemctl disable validator` to shut it down for good.

Follow the [moving a validator](../Support/Moving.md#import-keys-into-new-client) instructions. You already removed the keys: Wait 15 minutes after that to protect against slashing, then import them again from inside the `~/eth-docker` directory.

### 3. Remove old beacon database

We can remove the old beacon chain database and disable the service.

#### Somer Esat's guide

`sudo systemctl stop prysmbeacon && sudo systemctl disable prysmbeacon` and `sudo rm -rf /var/lib/prysm`.

Optionally, remove the goeth and prysm users: `sudo deluser goeth && sudo deluser prysmbeacon && sudo deluser prysmvalidator`.

Optionally, remove the old executables: `sudo apt remove -y geth && sudo apt -y auto-remove && sudo rm /usr/local/bin/validator && sudo rm /usr/local/bin/beacon-chain`.


#### Metanull's guide

`sudo systemctl stop beacon-chain && sudo systemctl disable beacon-chain` and `sudo rm -rf /home/beacon/*`.

Optionally, remove the geth and prysm users: `sudo deluser --remove-home geth && sudo deluser --remove-home beacon && sudo deluser --remove-home validator`.

Optionally, remove the old Geth package: `sudo apt remove -y ethereum && sudo apt -y auto-remove`.

#### Coincashew's guide

`sudo systemctl stop beacon-chain && sudo systemctl disable beacon-chain` and `sudo rm -rf ~/prysm`.

Optionally, remove the old Geth package: `sudo apt remove -y ethereum && sudo apt -y auto-remove`.

### 4. Set an auto-prune crontab

This is an optional component for [auto-pruning Geth or Nethermind](../Support/GethPrune.md#fully-automated-geth-prune).

