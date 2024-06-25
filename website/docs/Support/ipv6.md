---
id: ipv6
title: IPv6
sidebar_label: IPv6 support
---

## Y tho

As of mid 2024:

CGNAT is becoming more prevalant, making it harder to make P2P ports available inbound and get good peering.

Docker support for IPv6 is better.

Ethereum clients are starting to add v6 support, which can benefit from testing.

## How then

### Check you have v6

You can test, from a PC on your LAN, that [whatismyip](https://whatismyip.com) shows both a public v6 and v4 address.
If so, your router is set correctly. This will likely be the case "out of the box" on any ISP that uses CGNAT, and on
several that don't, like Comcast in the US.

On your node, `ip address show` should show you both a v4 `inet` and public v6 `inet6` address on the interface. If
all you see is an `fe80::` address for inet6, you don't have a routable v6 address configured, and you'll want to fix
that, first.

### Configure Docker

You'll want to be on the latest version of docker-ce, at least `27.0.1`.

If you previously had IPv6-specific settings in `/etc/docker/daemon.json`, you can remove them now.

### Configure Eth Docker

`nano .env` and set `IPV6=true`, which will tell Compose to enable v6 for the networks it creates.

## Safu?

Maybe. I still have to test ufw integration.  
On your LAN firewall, if this is in a LAN, you'd need rules to allow the P2P ports incoming to the v6 address of your
node.

## Which clients?

CL

- [x] Lighthouse
- [x] Lodestar
- [x] Nimbus
- [ ] Teku: Unsure, advertisement not tested
- [ ] Prysm: Maybe, `--p2p-local-ip ::`, but [not dual-stack](https://github.com/prysmaticlabs/prysm/issues/12303)
- [ ] Grandine: Unsure
- [ ] Lambda: Unsure

EL

- [ ] Besu: not fully tested
- [ ] Geth: not fully tested
- [ ] Erigon: not fully tested
- [ ] Nethermind: Possibly no advertisement, no explicit discv5 option
- [ ] Reth: No IPv6 connectivity on `main` as of mid Nov 2023
- [ ] Nimbus: Unsure
