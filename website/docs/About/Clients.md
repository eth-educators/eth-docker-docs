---
id: Clients
title:  Supported Clients.
sidebar_label: Clients
---

This project builds from client teams' official docker images or from official source repositories, pulled
directly from docker hub or github, respectively. In most cases, binary is the default.

Currently supported consensus clients:
- Teku
- Lighthouse
- Nimbus
- Lodestar
- Prysm - client has close to a supermajority, it is recommended to choose any other

Currently supported (optional until merge) execution clients:
- Geth, local execution client
- Erigon, local execution client - for testing. Feedback welcome.
- Besu, local execution client - Feedback welcome.
- Nethermind, local execution client - Feedback welcome.

> Use one of the local execution client options or a 3rd-party provider of Ethereum chain data to "feed"
> your consensus client, so you can [propose](https://ethos.dev/beacon-chain/) blocks.

Currently supported additional options:
- Sending stats to https://beaconcha.in
- Prysm Web UI
- Grafana dashboard
- slasher - running slasher is optional and requires additional resources

Please see [Prysm Web](../Usage/PrysmWeb.md) for experimental Web UI support on Prysm.
