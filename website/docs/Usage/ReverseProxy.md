---
id: ReverseProxy
title:  Reverse Proxy
sidebar_label: Reverse Proxy
---

# Additional security: Reverse proxy
 
You can use the "traefik" reverse proxy to be able to get to the Grafana Dashboard and Prysm Web UI via https:// instead
of insecure http://. It can also be used to encrypt the RPC and WS ports of your eth1 node, so they are reachable via
https:// and wss:// respectively.

You will require a domain name for this to work. Where you buy it is up to you. One option is NameCheap.

## Cloudflare for DNS management

With this option, CloudFlare will provide DNS management as well as DDoS protection. This also automatically updates the IP address of the domain, if
you are on a dynamic address, such as domestic Internet.

You'll add `traefik-cf.yml` to your `COMPOSE_FILE` in `.env`, for example: `lh-base.yml:geth.yml:lh-grafana.yml:traefik-cf.yml`

Create a (free) CloudFlare account and set up your domain, which will require pointing nameservers for your domain 
to Cloudflare's servers. How this is done depends on your domain registrar.

With NameCheap, "Manage" your domain from the Dashboard, then change "NameServers" to "Custom DNS", add the
CloudFlare servers, and finally hit the green checkmark next to "Custom DNS".

You will need a "scoped API token" from CloudFlare's [API page](https://dash.cloudflare.com/profile/api-tokens). Create a token with `Zone.DNS:Edit`, `Zone.Zone:Read` and `Zone.Zone Settings:Read` permissions,
for the zone (domain) you are going to use. Make a note of the Token secret, it will only be shown to you once.

With that, in the `.env` file:
- Set `CF_EMAIL` to your CloudFlare login email
- Set `CF_API_TOKEN` to the API token you just created
- Set `DDNS_SUBDOMAIN` if you want the Dynamic DNS IP address update to act on a specific subdomain name, rather than the main domain
- Set `DDNS_PROXY` to `false` if you do not want CloudFlare to proxy traffic to the domain / subdomain
- Read further down about common settings for Traefik

### CNAMEs and proxy settings

You will want CNAMEs for the services you make available. Assuming you have set the main domain with the IP address of your host, and keeping the
default names in `.env`:

- `grafana` CNAME to `@`, proxied for the grafana dashboard
- `prysm` CNAME to `@`, proxied, for the Prysm Web UI
- `eth1` CNAME to `@`, DNS only, for the eth1 RPC https:// port
- `eth1ws` CNAME to `@`, DNS only, for the eth1 WS wss:// port

If you are using CloudFlare to proxy Grafana / Prysm web, you'll also want to set these:

- SSL/TLS, Overview: "Full" or "Full (strict)" encryption mode
- SSL/TLS, Edge Certificates: Always use HTTPS on, Minimum TLS version to 1.2, Opportunistic Encryption on, TLS 1.3 on, Automatic HTTPS Rewrites on, Certificate Transparency Monitoring on

## AWS for DNS management

With this option, AWS Route53 will provide DNS management.

You'll add `traefik-aws.yml` to your `COMPOSE_FILE` in `.env`, for example: `lh-base.yml:geth.yml:lh-grafana.yml:traefik-aws.yml`

This setup assumes that you already have an AWS user profile in `~/.aws`. If not, please create one.

With that, in the `.env` file:
- Set `AWS_PROFILE` to the profile you want to use
- Set `AWS_HOSTED_ZONE_ID` to the Route53 zone you are going to use

### A records and CNAMEs

Assuming you use the default names in `.env`:

- An A record you can use for CNAMEs, pointing to your node
- CNAMEs for `grafana`, `prysm`, `eth1` and `eth1ws`, depending on which services you want to reverse-proxy on the node

## Traefik common settings

Two settings in `.env` are required, and a few are optional.

- `DOMAIN` needs to be set to your domain
- `ACME_EMAIL` is the email address Let's Encrypt will use to communicate with you. This need not be the same address as your DNS provider's account.

Optionally, you can change the names that services are reachable under, and adjust CNAMEs to match. These are the `_HOST` variables.
