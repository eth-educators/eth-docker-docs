---
id: Rocketpool
title: Integration with Rocketpool.
sidebar_label: Integration with Rocketpool
---

RocketPool node and eth-docker solo staking, it's like peanut butter and jelly. Both use docker, and they integrate seamlessly.

I'll be showing two configurations: Chain databases in Rocketpool, and chain databases in eth-docker.

This has been tested with Lighthouse. It should work without changes for any client that brings its own validator client inside Rocketpool, those being any but Nimbus. Prysm compatibility is not guaranteed as of RocketPool 1.3.0.

## Configuration A: Chain databases in RocketPool

For this example, the consensus client (beacon/eth2) and execution client (eth1) will run in RocketPool, and eth-docker will run just a validator client, but not "consensus" or "execution" containers.

### Configure RocketPool

If you are not running RocketPool already, install it [following their instructions](https://docs.rocketpool.net/guides/node/docker.html). When you get to the step where you configure RocketPool:

`rocketpool service config` and choose Locally Managed, any local Execution Client (Geth, Erigon, etc) and any Consensus Client, though I'd avoid Prysm.

Run `rocketpool service start`, and everything should come up. 

You can continue following the Rocketpool instructions at this point.

### Configure eth-docker

If you are not running eth-docker already, grab it with `git clone https://github.com/eth2-educators/eth-docker.git && cd eth-docker`.

Configure it with `./ethd config`. Make sure to choose the same Ethereum PoS network as RocketPool, and a "Validator client only" to match the Consensus client in RocketPool. Choose "http://eth2:5052" as your "remote consensus client".

> Lighthouse and Teku are mutually compatible, they can be mixed and matched
> Note that Nimbus has no standalone validator client, and Prysm support has not been tested

If you had previously already imported keys to eth-docker, restart eth-docker with `./ethd restart`.

Optional cleanup: If you had chain databases in eth-docker previously, do a `docker volume ls` and then `docker volume rm` the consensus/beacon and eth1/ec volumes, e.g. `eth-docker_geth-eth1-data` and `eth-docker_lhbeacon-data`.

### Import solo staking keys

If you haven't already imported validator keys to eth-docker, do so now. You will need the `keystore-m` files and their
pasword.

- Copy `keystore-m` files to `.eth/validator_keys` in the eth-docker directory
- From the eth-docker directory, stop eth-docker: `./ethd stop`
- Make sure client images have been built: `./ethd update`
- Import keys and follow prompts: `/.ethd keyimport`
- Start eth-docker: `./ethd start`

### Check logs

You expect `./ethd logs -f validator` to show a successful connection. 

`rocketpool service logs validator` should show the validator connecting to its own consensus client.
`docker ps` should show `rocketpool_eth1` and `rocketpool_eth2` containers, but no `consensus` or `execution` containers for eth-docker.

## Configuration B: Chain databases in eth-docker

For this example, the consensus client (beacon/eth2) and execution client (eth1) will run in eth-docker, as well as the solo staking validator client, and RocketPool will run its own validator client as well as its node container, but not "eth1" or "eth2" containers.

### Configure RocketPool

If you are not running RocketPool already, install it [following their instructions](https://docs.rocketpool.net/guides/node/docker.html). When you get to the step where you configure RocketPool:

- `rocketpool service config` and choose `Externally Managed` for the Execution Client, and as your http URL use `http://execution:8545` and as the websocket URL use `ws://execution:8546`. Choose `None` for your fallback client. Choose `Externally Managed` for the Consensus Client, and choose the client you want to run in eth-docker. As the http URL use `http://consensus:5052`. This requires a client that has a standalone validator client available: As of April 2022, your choices are Lighthouse, Teku and Prysm. I advise against choosing a majority client, which as of April 2022 is Prysm.

Set up eth-docker next before following the rest of the Rocketpool instructions.

### Configure eth-docker

If you are not running eth-docker already, grab it with `git clone https://github.com/eth2-educators/eth-docker.git && cd eth-docker`,
and configure it with `./ethd config`. Choose an Ethereum node deployment. Make sure to choose the same Ethereum PoS network and consensus client as you chose in RocketPool. It *should* work with any execution client, but I've only tested it with Geth so far.

Connect eth-docker to RocketPool's docker network.

- `nano .env` and add `:ext-network.yml` to `COMPOSE_FILE`
- `nano ext-network.yml` and change the line that reads `name: traefik_default` to `name: rocketpool_net`
- `./ethd start` or, if you already have eth-docker running, `./ethd update` followed by `./ethd restart`
- `rocketpool service start` and Rocketpool should come up

You can continue following the Rocketpool instructions at this point.

### Import solo staking keys

If you haven't already imported validator keys to eth-docker, do so now. You will need the `keystore-m` files and their
pasword.

- Copy `keystore-m` files to `.eth/validator_keys` in the eth-docker directory
- From the eth-docker directory, stop eth-docker: `./ethd stop`
- Make sure client images have been built: `./ethd update`
- Import keys and follow prompts: `/.ethd keyimport`
- Start eth-docker: `./ethd start`

### Check logs

`./ethd logs -f consensus` should show it starting up, ditto `./ethd logs -f execution`, and after consensus is up, you expect
`./ethd logs -f validator` to show a successful connection. Solo staking is (still) working.

`rocketpool service logs validator` should show the validator connecting to your consensus client.
`docker ps` should show no `rocketpool_eth1` or `rocketpool_eth2` containers.
