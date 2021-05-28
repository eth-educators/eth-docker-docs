---
id: Clients
title:  Supported Clients.
sidebar_label: Clients
---

This project builds from client teams' official docker images or from official source repositories, pulled
directly from docker hub or github, respectively. In most cases, binary is the default.

Currently supported clients:
- Lighthouse
- Prysm
- Teku
- Nimbus

Currently supported optional components:
- geth, local execution client
- besu, local execution client - Feedback welcome.
- nethermind, local execution client - Feedback welcome.

> Use one of the local execution client options or a 3rd-party provider of Ethereum chain data to "feed"
> your consensus client, so you can [propose](https://ethos.dev/beacon-chain/) blocks.

- Grafana dashboard
- Prysm Web UI

- slasher - running slasher is optional, but helps secure the chain

Please see [Prysm Web](../Usage/PrysmWeb.md) for experimental Web UI support on Prysm.
