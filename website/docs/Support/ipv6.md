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

You'll likely want to be on the latest version of docker-ce, as IPv6 support in docker is a moving target.

Create a `/etc/docker/daemon.json` if it doesn't already exist, and make sure it contains this:

```
{
    "userland-proxy": false,
    "ipv6": true,
    "ip6tables": true,
    "fixed-cidr-v6": "fd00:1::/64",
    "default-address-pools":[
      {"base": "172.31.0.0/16", "size": 24},
      {"base": "fd12:3456::/64", "size": 64},
      {"base": "fd12:3456:1::/64", "size": 64},
      {"base": "fd12:3456:2::/64", "size": 64},
      {"base": "fd12:3456:3::/64", "size": 64},
      {"base": "fd12:3456:4::/64", "size": 64},
      {"base": "fd12:3456:5::/64", "size": 64},
      {"base": "fd12:3456:6::/64", "size": 64},
      {"base": "fd12:3456:7::/64", "size": 64},
      {"base": "fd12:3456:8::/64", "size": 64},
      {"base": "fd12:3456:9::/64", "size": 64},
      {"base": "fd12:3456:a::/64", "size": 64},
      {"base": "fd12:3456:b::/64", "size": 64},
      {"base": "fd12:3456:c::/64", "size": 64},
      {"base": "fd12:3456:d::/64", "size": 64},
      {"base": "fd12:3456:e::/64", "size": 64},
      {"base": "fd12:3456:f::/64", "size": 64},
      {"base": "fd12:3456:10::/64", "size": 64},
      {"base": "fd12:3456:11::/64", "size": 64},
      {"base": "fd12:3456:12::/64", "size": 64},
      {"base": "fd12:3456:13::/64", "size": 64},
      {"base": "fd12:3456:14::/64", "size": 64},
      {"base": "fd12:3456:15::/64", "size": 64},
      {"base": "fd12:3456:16::/64", "size": 64},
      {"base": "fd12:3456:17::/64", "size": 64},
      {"base": "fd12:3456:18::/64", "size": 64},
      {"base": "fd12:3456:19::/64", "size": 64},
      {"base": "fd12:3456:1a::/64", "size": 64},
      {"base": "fd12:3456:1b::/64", "size": 64},
      {"base": "fd12:3456:1c::/64", "size": 64},
      {"base": "fd12:3456:1d::/64", "size": 64},
      {"base": "fd12:3456:1e::/64", "size": 64},
      {"base": "fd12:3456:1f::/64", "size": 64}
    ],
    "experimental": true
}
```

Edit `.env` as well and add `:v6-network.yml` to `COMPOSE_FILE`, which will tell compose to enable v6 for the networks it creates.

### Dafuq

The many many base networks are necessary until a [docker fix](https://github.com/moby/moby/pull/43033) lands. It's a hack so docker compose can create v6 networks, and this allows it to create 32 of them. Once
the fix is in, this could be a single v6 base with something like `{"base": "fd12:3456:789a::/48", "size": 64}`.

So, what's going on here. Manuel Bauer's [blog](https://www.manuel-bauer.net/blog/docker-with-full-ipv6-support) will get you started. Basically, enable experimental ip6tables support which does a form of v6 NAT
between the host address and the container address, where the container address is a ULA in the `fd::/8` range. `fixed-cidr-v6` is used for the `docker0` default bridge network, and the many many (many) base
networks are used for networks that compose creates.

## Safu?

Maybe. I still have to test ufw integration. I believe there is a v6 USER table for docker since 23.x. The feature itself, though experimental, shouldn't cause issues. On your LAN firewall, if this is in a LAN,
you'd need rules to allow the P2P ports incoming to the v6 address of your node.
 
