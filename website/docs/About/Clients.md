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
- geth, local eth1 node
- openethereum, local eth1 node
- besu, local eth1 node - Feedback welcome.
- nethermind, local eth1 node - Feedback welcome.

> Use one of the local eth1 node options or a 3rd-party provider of eth1 chain data to "feed"
> your eth2 beacon node, so you can [propose](https://ethos.dev/beacon-chain/) blocks.

- Grafana dashboard
- Prysm Web UI

- slasher - running slasher is optional, but helps secure the chain

Please see [Prysm Web](../Usage/PrysmWeb.md) for experimental Web UI support on Prysm.
