---
id: BloxSSV
title: Run a Blox SSV node.
sidebar_label: Run a Blox SSV node
---

eth-docker supports running a Blox SSV node, together with a consensus client and execution client of choice. This is expected to work with Geth, Besu and Nethermind, but not Erigon as of 1/10/2022. It's been tested with Lighthouse, Teku and Nimbus, and should work with Prysm. I recommend not using Prysm because it has close to a supermajority of validators, which carries risk for node operators as well as the chain.

## Setup Prerequisites
### Get eth-docker
- Clone this tool
  - `git clone https://github.com/eth2-educators/eth-docker.git ssv-node && cd ssv-node`

### On Linux
- Install docker, unless you already have it
  - Run `./ethd install`

### On MacOS
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop) and allocate 16 GiB of RAM and around 1.5TB of storage to it
- Install pre-requisites via homebrew
  - `brew install coreutils newt`

## Setup an SSV Node

Run `./ethd config`, make sure to choose Prater testnet and Blox SSV Node, choose your preferred consensus and execution clients, and rapid sync for the consensus client. Choose Grafana for visibility.

Get the key for the SSV node and write it down somewhere safe: `docker-compose run --rm ssv-generate-keys`

Now put that key into the config file: `cp blox-ssv-config-sample.yaml blox-ssv-config.yaml` followed by `nano blox-ssv-config.yaml` and set the `OperatorPrivateKey:` to the value you were shown for the secret key `sk`, without quotes or curly braces.

Finally, start everything with `./ethd up`.

You can watch logs with `./ethd logs -f ssv2-node`.

>Right after startup, the ssv-node will fail because it cannot get to `http://consensus:5052`. This is normal! It will resolve once the consensus client has started and is listening on the REST API port. You can `./ethd logs -f consensus` to see it do that.

## Mapping ports

By default, the SSV node uses ports TCP 13,001 and UDP 12,001 for its P2P network with other nodes. These ports need to be reachable from the Internet.

If you need to change the ports, you can do so by changing the `SSV_P2P_PORT` and `SSV_P2P_PORT_UDP` variables in .env, and changing the corresponding values in `blox-ssv-config.yaml`.

If you are running the node in a home network, you'll want to [forward these ports](https://portforward.com/router.htm), then [test the TCP port](https://www.yougetsignal.com/tools/open-ports/). As long as the UDP port forward is set up the same way, you expect it to work, as well.

## Grafana

Grafana dashboards are included. Make sure to edit the dashboard, change the variables to `ssv2-node` and just the non-staging explorer, then "Save" with the checkbox ticked that makes these values the default.

Please see the [secure proxy](../Usage/ReverseProxy.md) docs if you'd like to run Grafana on a secured https port, rather than insecure 3000.

## Updating

When there is a new version of your execuction client, consensus client or of the SSV node, just run `./ethd update` inside the `ssv-node` directory, which will pull fresh images. Then when you are ready, run `./ethd up` to start using the new version(s).
