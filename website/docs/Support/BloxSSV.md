---
id: BloxSSV
title: Run a Blox SSV node.
sidebar_label: Run a Blox SSV node
---

eth-docker supports running a Blox SSV node, together with a consensus client and execution client of choice. This is expected to work with Geth, Besu and Nethermind, but not Erigon as of 1/10/2022. It's been tested with Lighthouse, Teku and Nimbus, and should work with Prysm. I recommend not using Prysm because it has close to a supermajority of validators, which carries risk for node operators as well as the chain.

## Setup

You can run `./ethd config`, make sure to choose Prater testnet, choose your preferred consensus and execution clients, and rapid sync for the consensus client, then make some manual changes. Or you can set everything up manually.
Note that Grafana support for the SSV node isn't implemented as of 1/10/2022.

You'll want to `nano .env` and change `COMPOSE_FILE` to use the `*-consensus.yml` instead of `*-base.yml` as well as `blox-ssv.yml`, e.g. with Lighthouse, Geth and Blox SSV: `COMPOSE_FILE=lh-consensus.yml:geth.yml:blox-ssv.yml`.

Save and close the editor.

Get the key for the SSV node and write it down somewhere safe: `docker-compose run --rm ssv-generate-keys`

Now put that key into the config file: `cp blox-ssv-config-sample.yaml blox-ssv-config.yaml` followed by `nano blox-ssv-config.yaml` and set the `OperatorPrivateKey:` to the value you were shown for the secret key `sk`.

Finally, start everything with `./ethd up`.

You can watch logs with `./ethd logs -f ssv-node`.

>Right after startup, the ssv-node will fail because it cannot get to `http://consensus:5052`. This is normal! It will resolve once the consensus client has started and is listening on the REST API port. You can `./ethd logs -f consensus` to see it do that.
