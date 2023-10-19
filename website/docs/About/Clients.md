---
id: Clients
title:  Supported Clients.
sidebar_label: Clients
---

This project builds from client teams' official docker images or from official source repositories, pulled
directly from docker hub or github, respectively. In most cases, binary is the default.

Currently supported consensus clients:
- Lodestar
- Nimbus
- Teku
- Lighthouse
- Prysm

Currently supported execution clients:
- Nethermind
- Besu
- Geth
- Erigon
- Reth (alpha)

> An Ethereum node has one consensus client and one execution client. Eth Docker can be used to split this between two
machines, but that distributed setup is rare

Currently supported additional options:
- Sending stats to https://beaconcha.in
- Prysm Web UI
- Grafana dashboard
- slasher - running slasher is optional and requires additional resources

Please see [Prysm Web](../Usage/PrysmWeb.md) for Web UI support on Prysm.
