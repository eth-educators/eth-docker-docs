---
id: Advanced
title: "Advanced use and manual setup"
sidebar_label: Advanced Use
---

## Client choice - manual setup

> You can refer back to the [Overview](/) to get a sense of how the
> validator client, consensus client and execution client are
> connected to each other, and which role each plays.

Please choose:

* The consensus client you wish to run
  * Lodestar
  * Nimbus
  * Teku
  * Lighthouse
  * Prysm
* Your execution client you wish to run
  * Nethermind
  * Besu
  * Geth - this client has a super-majority. Choosing another is safer.
  * Erigon
  * Reth (alpha)
* Whether to run a grafana dashboard for monitoring

First, copy the environment file.  
`cp default.env .env`

> This file is called `.env` (dot env), and that name has to be exact. docker compose
will otherwise show errors about not being able to find a `docker-compose.yml` file,
which this project does not use.
 
Then, adjust the contents of `.env`. On Ubuntu Linux, you can run `nano .env`.

- Set the `COMPOSE_FILE` entry depending on the client you are going to run,
and with which options. See below for available compose files. Think of this as
blocks you combine: One consensus client, optionally one execution client, optionally reporting,
optionally a reverse proxy for https:// access to reporting.
- Set the `NETWORK` variable to either "mainnet" or a test network such as "goerli"
- Set the `GRAFFITI` string if you want a specific string.
- If you are going to run a validator client only, without a consensus client, set `CL_NODE` to the URL of your
Ethereum PoS beacon, and choose one of the `CLIENT-vc-only.yml` entries in `COMPOSE_FILE`.
- If you are going to send statistics to https://beaconcha.in, set `BEACON_STATS_API` to your API key
- If you want to sync the consensus client quickly, set `RAPID_SYNC_URL` to a checkpoint provider such as checkpointz
- Adjust ports if you are going to need custom ports instead of the defaults. These are the ports
exposed to the host, and for the P2P ports to the Internet via your firewall/router.

## Compose files

The main concept to understand is that all files in `COMPOSE_FILE` inside `.env` are combined in order, and Docker
Compose will then act on the resulting config. It can be viewed with `docker compose config`.

Set the `COMPOSE_FILE` string depending on which client you are going to use. Add optional services with `:` between
the file names.

Choose one consensus client:

- `teku.yml` - Teku
- `lighthouse.yml` - Lighthouse
- `lodestar.yml` - Lodestar
- `nimbus.yml` - Nimbus
- `prysm.yml` - Prysm

Choose one execution client:

- `nethermind.yml` - nethermind execution client
- `besu.yml` - besu execution client
- `reth.yml` - reth execution client
- `erigon.yml` - erigon execution client
- `geth.yml` - geth execution client

Optionally, enable MEV boost:

- `mev-boost.yml` - add the mev-boost sidecar

Optionally, choose a reporting package:

- `grafana.yml` - Enable local Grafana dashboards
- `grafana-cloud.yml` - Run a local Prometheus with support for remote-write to Grafana Cloud

- `grafana-shared.yml` - to map the local Grafana port (default: 3000) to the host. This is not encrypted and should
not be exposed to the Internet. Used *in addition* to `grafana.yml`, not instead. Using encryption instead via
`traefik-*.yml` is recommended.
- `prysm-web-shared.yml` - to map the Prysm web port (default: 3500) to the host. This is not encrypted and should
not be exposed to the Internet. Using encryption instead via `traefik-*.yml` is recommended.
- `siren.yml` - Lighthouse's Siren UI

> See [Prysm Web](../Usage/PrysmWeb.md) for notes on using the Prysm Web UI

Optionally, add ethdo for beacon chain queries:

- `ethdo.yml` - add Attestant's ethdo tool for querying your consensus layer aka beacon node

Optionally, make the staking-deposit-cli available:

- `deposit-cli.yml` - Used to generate mnemonics and signing keys. Consider running key generation offline, instead,
and copying the generated `keystore-m` files into this tool.

Optionally, add encryption to the Grafana and/or Prysm Web pages:

- `traefik-cf.yml` - use encrypting secure web proxy and use CloudFlare for DNS management
- `traefik-aws.yml` - use encrypting secure web proxy and use AWS Route53 for DNS management
- `el-traefik.yml,` `cl-traefik.yml`, `ee-traefik.yml` - advanced use, use traefik for access to execution RPC,
consensus REST and execution engine RPC API ports respectively. Be very cautious with these, always
[firewall](../Support/Cloud.md) that access to trusted source IPs.

With these, you wouldn't use the `-shared.yml` files. Please see [Secure Web Proxy Instructions](../Usage/ReverseProxy.md)
for setup instructions for either option.

For example, Teku with Besu:
`COMPOSE_FILE=teku.yml:besu.yml`

## Sharing RPC and REST ports

These are largely for running RPC nodes, instead of validator nodes. Most users will not require them.

The `SHARE_IP` variable in `.env` can be used to restrict these shares to `127.0.0.1`, for local use or for use
with an SSH tunnel.

- `el-shared.yml` - as an insecure alternative to traefik-\*.yml, makes the RPC and WS ports of the execution client
available from the host. To be used alongside one of the execution client yml files. **Not encrypted**, do not expose
to Internet.
- `cl-shared.yml` - as an insecure alternative to traefik-\*.yml, makes the REST port of the consensus client available
from the host. To be used alongside one of the consensus client yml files. **Not encrypted**, do not expose to Internet.
- `ee-shared.yml` - as an insecure alternative to traefik-\*.yml, makes the engine API port of the execution client
available from the host. To be used alongside one of the execution client yml files. **Not encrypted**, do not expose
to Internet.

- `CLIENT-cl-only.yml` - for running a [distributed consensus client and validator client](../Usage/ReverseProxy.md)
setup.
- `CLIENT-vc-only.yml` - the other side of the distributed client setup.

## MEV Boost

Your Consensus Layer client connects to the mev-boost container. If you are running a CL in Eth Docker, then in `.env`
you'd add `mev-boost.yml` to `COMPOSE_FILE`, set `MEV_BOOST=true` and set `MEV_RELAYS` to the
[relays you wish to use](https://ethstaker.cc/mev-relay-list/).

If you are running a validator client only, such as with a RocketPool "reverse hybrid" setup, then all you need to do
is to set `MEV_BOOST=true` in `.env`. `mev-boost.yml` and `MEV_RELAYS` are not needed and won't be used if they are
set, as they are relevant only where the Consensus Layer client runs. See the [Overview](/) drawing for how thesei
components communicate.

## Specialty yml files

Eth Docker supports some specialty use cases. These are the corresponding yml files.

- `ext-network.yml` - Connect to another Docker network, for example for reverse hybrid with RocketPool or connecting
to a central traefik/prometheus.
- `v6-network.yml` - part of enabling IPv6 support
 - `central-metrics.yml` - Scrape metrics from a
[central prometheus](https://github.com/CryptoManufaktur-io/central-proxy-docker)
- `nimbus-stats.yml` - Send Nimbus stats to beaconcha.in app
- `prysm-stats.yml` - Send Prysm stats to beaconcha.in app
- `ssv.yml` - Run an SSV DVT node

## Multiple nodes on one host

In this setup, clients are isolated from each other. Each run their own validator client, and if an execution client
is in use, their own execution client. This is perfect for running a single client, or multiple isolated
clients each in their own directory.

If you want to run multiple isolated clients, just clone this project into a new directory for
each. This is great for running testnet and mainnet in parallel, for example.

## Prysm or Lighthouse Slasher

Running [slasher](https://docs.prylabs.network/docs/prysm-usage/slasher/) is an optional setting in `.env`, and helps
secure the chain. There are [no additional earnings](https://github.com/ethereum/consensus-specs/issues/1631) from
running a slasher: Whistleblower rewards are not implemented, and may not ever be implemented.

> Slasher can be a huge resource hog during times of no chain finality, which can manifest as massive RAM usage. Please
make sure you understand the risks of this, especially if you want high uptime for your Ethereum staking full node.
Slasher places significant stress on the consensus client when the chain has no finality, and might be the reason why
your validators are underperforming if your consensus client is under this much stress.

To run a slasher, add the relevant command(s) to `CL_EXTRAS` in your `.env` file.

## Build the client

Build all required images. `./ethd update`
