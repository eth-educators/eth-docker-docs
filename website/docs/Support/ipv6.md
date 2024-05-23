---
id: ipv6
title: IPv6
sidebar_label: IPv6 support
---

## Y tho

As of early 2023:

CGNAT is becoming more prevalant, making it harder to make P2P ports available inbound and get good peering.

Docker support for IPv6 is slowly, ever so slowly, getting better.

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

You'll want to be on the latest version of docker-ce, as IPv6 support in Docker is a moving target.

`sudo nano /etc/docker/daemon.json` and make sure it contains this:

```
{
    "userland-proxy": false,
    "ipv6": true,
    "fixed-cidr-v6": "fd00::/64",
    "experimental": true,
    "ip6tables": true,
    "default-address-pools":[
      { "base": "172.17.0.0/16", "size": 16 },
      { "base": "172.18.0.0/16", "size": 16 },
      { "base": "172.19.0.0/16", "size": 16 },
      { "base": "172.20.0.0/14", "size": 16 },
      { "base": "172.24.0.0/14", "size": 16 },
      { "base": "172.28.0.0/14", "size": 16 },
      { "base": "192.168.0.0/16", "size": 20 },
      {"base": "fd00:0:1::/64", "size": 64},
      {"base": "fd00:0:1:1::/64", "size": 64},
      {"base": "fd00:0:1:2::/64", "size": 64},
      {"base": "fd00:0:1:3::/64", "size": 64},
      {"base": "fd00:0:1:4::/64", "size": 64},
      {"base": "fd00:0:1:5::/64", "size": 64},
      {"base": "fd00:0:1:6::/64", "size": 64},
      {"base": "fd00:0:1:7::/64", "size": 64},
      {"base": "fd00:0:1:8::/64", "size": 64},
      {"base": "fd00:0:1:9::/64", "size": 64},
      {"base": "fd00:0:1:a::/64", "size": 64},
      {"base": "fd00:0:1:b::/64", "size": 64},
      {"base": "fd00:0:1:c::/64", "size": 64},
      {"base": "fd00:0:1:d::/64", "size": 64},
      {"base": "fd00:0:1:e::/64", "size": 64},
      {"base": "fd00:0:1:f::/64", "size": 64},
      {"base": "fd00:0:1:10::/64", "size": 64},
      {"base": "fd00:0:1:11::/64", "size": 64},
      {"base": "fd00:0:1:12::/64", "size": 64},
      {"base": "fd00:0:1:13::/64", "size": 64},
      {"base": "fd00:0:1:14::/64", "size": 64},
      {"base": "fd00:0:1:15::/64", "size": 64},
      {"base": "fd00:0:1:16::/64", "size": 64},
      {"base": "fd00:0:1:17::/64", "size": 64},
      {"base": "fd00:0:1:18::/64", "size": 64},
      {"base": "fd00:0:1:19::/64", "size": 64},
      {"base": "fd00:0:1:1a::/64", "size": 64},
      {"base": "fd00:0:1:1b::/64", "size": 64},
      {"base": "fd00:0:1:1c::/64", "size": 64},
      {"base": "fd00:0:1:1d::/64", "size": 64},
      {"base": "fd00:0:1:1e::/64", "size": 64},
      {"base": "fd00:0:1:1f::/64", "size": 64}
    ]
}
```

Restart docker with `sudo systemctl restart docker`, then verify it's up with `systemctl status docker`, lastly check
its logs with `sudo journalctl -fu docker` to make sure it came up ok. If there are issues that keep it from starting,
fix those before going further.

### Configure Eth Docker

`nano .env` and set `IPV6=true` and add `:ipv6.yml` to `COMPOSE_FILE`, which will tell Compose to enable
v6 for the networks it creates.

### Dafuq

The many base networks are necessary until a [Docker fix](https://github.com/moby/moby/pull/43033) lands.
It's a hack so Docker Compose can create v6 networks, and this allows it to create 32 of them. Once the fix is in,
this could be a single v6 base with something like `{"base": "fd00:0:1::/56", "size": 64}`.

So, what's going on here. [Docker documentation](https://docs.docker.com/config/daemon/ipv6/) will
get you started. Basically, enable experimental ip6tables support which does a form of v6 NAT between the host address
and the container address, where the container address is a ULA in the `fd::/8` range. `fixed-cidr-v6` is used for the
`docker0` default bridge network, and the many many (many) base networks are used for networks that Compose creates.

## Safu?

Maybe. I still have to test ufw integration. I believe there is a v6 USER table for Docker since 23.x. The feature
itself, though experimental, shouldn't cause issues. On your LAN firewall, if this is in a LAN, you'd need rules to
allow the P2P ports incoming to the v6 address of your node.

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
