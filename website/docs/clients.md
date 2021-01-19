---
id: clients
title:  Supported Clients
sidebar_label: clients
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
- besu, local eth1 node - has not been tested extensively by this team. Feedback welcome.
- nethermind, local eth1 node - pruning in beta. Feedback welcome.
- openethereum, local eth1 node - testing mainly, DB corruption resolved.
> Use one of the local eth1 node options or a 3rd-party provider of eth1 chain data to "feed"
> your eth2 beacon node, so you can [propose](https://ethos.dev/beacon-chain/) blocks.
- slasher, Running slasher is optional, but helps secure the chain and may result in additional earnings.
- Grafana dashboard

Please see [WEB](WEB.md) for experimental Web UI support on Prysm, and use the Web instead
of validator-import to import keys.