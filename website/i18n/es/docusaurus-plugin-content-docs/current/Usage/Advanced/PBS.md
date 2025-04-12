---
title: "Configure MEV aka Proposer Builder Separation"
sidebar_position: 3
sidebar_label: MEV setup
---

## Proposer Builder Separation

### MEV Boost

Your Consensus Layer client connects to the mev-boost container. If you are running a CL in Eth Docker, then in `.env`
you'd add `mev-boost.yml` to `COMPOSE_FILE`, set `MEV_BOOST=true` and set `MEV_RELAYS` to the
[relays you wish to use](https://ethstaker.cc/mev-relay-list/).

### Commit Boost

This is an alternative to MEV Boost. Your Consensus Layer client connects to the cb-pbs container. If you are running
a CL in Eth Docker, then in `.env` you'd add `commit-boost-pbs.yml` to `COMPOSE_FILE`, set `MEV_BOOST=true` and
set `MEV_NODE=http://cb-pbs:18550`.

Next, edit `commit-boost/cb-config.toml` and configure the relays you'd like to use.

### Verify

If you would like to verify whether your MEV relay has registered your validator, follow the documentation for your
chosen relays. For instance, if you have included Flashbots, you can see whether your validator has been registered by
querying their API. Add your validator's public key to the end of this endpoint:
https://boost-relay.flashbots.net/relay/v1/data/validator_registration?pubkey=

### Just a VC, example RocketPool

If you are running a validator client only, such as with a RocketPool "reverse hybrid" setup, then all you need to do
is to set `MEV_BOOST=true` in `.env`. `mev-boost.yml` and `MEV_RELAYS` are not needed and won't be used if they are
set, as they are relevant only where the Consensus Layer client runs. See the [Overview](/) drawing for how these
components communicate.
