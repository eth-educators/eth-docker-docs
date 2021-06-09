---
id: ReverseProxy
title: "Additional security: Secure Web Proxy"
sidebar_label: Secure Web Proxy
---

You can use the "[traefik](https://traefik.io/)" secure web proxy to get to the Grafana Dashboard and Prysm Web UI via https:// instead
of insecure http://. It can also be used to encrypt the RPC and WS ports of your execution client, so they are reachable via
https:// and wss:// respectively. In addition, it can be used to separate the consensus client and validator client to different machines.

You will require a domain name for this to work. Where you buy it is up to you. One option is NameCheap.

As a 450m overview, traefik will be reachable via port 443 / https from the Internet (configurable, could be 8443 if you prefer). All
browsing attempts to it will be checked by traefik for their hostname, and it steers traffic to the right container thereby: To Grafana, to Prysm Web UI,
and to the execution client. Grafana and Prysm Web UI are reachable via traefik automatically if you have them and traefik enabled at the same time; execution client reachability
requires an additional `ec-traefik.yml`, since having it reachable is not a standard use case.

For example, say I have a domain `example.com`, left the `_HOST` and port settings in `.env` at default, and am running Prysm with Grafana and Web UI.
`https://grafana.example.com/` will get me to my Grafana dashboard, and `https://prysm.example.com` to my Prysm Web UI.
## Cloudflare for DNS management

With this option, CloudFlare will provide DNS management as well as DDoS protection. Traefik uses CloudFlare to issue a Let's Encrypt certificate for
your domain. This also automatically updates the IP address of the domain, which is useful if you are on a dynamic address, such as domestic Internet. Either for
the main domain `example.com` or if desired for a subdomain such as `grafana.example.com`.

You'll add `traefik-cf.yml` to your `COMPOSE_FILE` in `.env`, for example: `lh-base.yml:geth.yml:lh-grafana.yml:traefik-cf.yml`

Create a (free) CloudFlare account and set up your domain, which will require pointing nameservers for your domain 
to Cloudflare's servers. How this is done depends on your domain registrar.

With NameCheap, "Manage" your domain from the Dashboard, then change "NameServers" to "Custom DNS", add the
CloudFlare servers, and finally hit the green checkmark next to "Custom DNS".

You will need a "scoped API token" from CloudFlare's [API page](https://dash.cloudflare.com/profile/api-tokens). Create a token with `Zone.DNS:Edit`, `Zone.Zone:Read` and `Zone.Zone Settings:Read` permissions, for all zones. This will not work if it is issued for a specific zone only. Make a note of the Token secret, it will only be shown to you once.

With that, in the `.env` file:
- Set `CF_EMAIL` to your CloudFlare login email
- Set `CF_API_TOKEN` to the API token you just created
- Set `DDNS_SUBDOMAIN` if you want the Dynamic DNS IP address update to act on a specific subdomain name, rather than the main domain
- Set `DDNS_PROXY` to `false` if you do not want CloudFlare to proxy traffic to the domain / subdomain
- Read further down about common settings for Traefik

### CNAMEs and proxy settings

You need CNAMEs or A records for the services you make available. Assuming you have set the main domain with the IP address of your host, and keeping the
default names in `.env`, set the CNAMEs for only the services you use:

- `grafana` CNAME to `@`, proxied, for the Grafana dashboard
- `prysm` CNAME to `@`, proxied, for the Prysm Web UI
- `ec` CNAME to `@`, DNS only, for the execution client RPC https:// port
- `ecws` CNAME to `@`, DNS only, for the execution client WS wss:// port

If you are using CloudFlare to proxy Grafana / Prysm web, you'll also want to set these:

- SSL/TLS, Overview: "Full" or "Full (strict)" encryption mode
- SSL/TLS, Edge Certificates: Always use HTTPS on, Minimum TLS version to 1.2, Opportunistic Encryption on, TLS 1.3 on, Automatic HTTPS Rewrites on, Certificate Transparency Monitoring on

## AWS for DNS management

With this option, AWS Route53 will provide DNS management. Traefik uses CloudFlare to issue a Let's Encrypt certificate for
your domain. It does not create an A record for you, that is left up to you.

You'll add `traefik-aws.yml` to your `COMPOSE_FILE` in `.env`, for example: `lh-base.yml:geth.yml:lh-grafana.yml:traefik-aws.yml`

This setup assumes that you already have an AWS named user profile in `~/.aws` on the node itself. If not, [please create one](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html). The IAM user will need to have the AWS-managed `AmazonRoute53DomainsFullAccess` policy [attached to it](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_manage-attach-detach.html).

With that, in the `.env` file:
- Set `AWS_PROFILE` to the profile you want to use
- Set `AWS_HOSTED_ZONE_ID` to the Route53 zone you are going to use

### A records and CNAMEs

Assuming you use the default names in `.env`:

- An A record for your first service such as `grafana.example.com`, or on the domain itself `example.com` to use for CNAMEs. The A record will be the IP
  address of your node
- Optionally, additional CNAMEs for `grafana`, `prysm`, `ec` and `ecws`, depending on which services you want to reverse-proxy on the node

## Traefik common settings

Two settings in `.env` are required, and a few are optional.

- `DOMAIN` needs to be set to your domain
- `ACME_EMAIL` is the email address Let's Encrypt will use to communicate with you. This need not be the same address as your DNS provider's account.

Optionally, you can change the names that services are reachable under, and adjust CNAMEs to match. These are the `_HOST` variables.

## Separating consensus client and validator client

eth-docker supports separating the consensus client and validator client on different machines, with TLS encryption between them.

### Consensus client machine

On the machine that runs the consensus client, you'll need `CLIENT-consensus.yml` with `CLIENT` one of `teku`, `lh` or `prysm`, as well as one of the `traefik-XXX.yml` files. For example, with Lighthouse and CloudFlare: `COMPOSE_FILE=lh-consensus.yml:traefik-cf.yml`.

Traefik needs to be configured as per the above. Make sure you have a DNS entry for the machine, something like `cc.example.com` if `CC_HOST` is at default and your `DOMAIN` is `example.com`. For Lighthouse and Teku with CloudFlare, you can proxy this entry; for Prysm,
make sure it is set to DNS without proxy.

For Teku and Lighthouse, make sure port 443/tcp is reachable from the outside.

For Prysm, make sure port 4000/tcp is reachable from the outside.

In both cases it is prudent to restrict communications to just the IP address of the validator client machine.

### Validator client machine

On the machine that runs the validator client, you'll need `CLIENT-validator.yml` with `CLIENT` one of `teku`, `lh` or `prysm`. For example, for Lighthouse: `COMPOSE_FILE=lh-validator.yml`

Teku and Lighthouse are interoperable; Prysm only works with a Prysm consensus client.

The `CC_NODE` variable needs to be set to point to the consensus client.

For Teku and Lighthouse: `CC_NODE=https://cc.example.com` , assuming you left the `CC_HOST` variable at default on the consensus client, the Traefik port at default, and your domain is `example.com`.
Lighthouse also supports a failover node, which means you could configure `CC_NODE=https://cc.example.com,https://MY_INFURA_BEACON_PROJECT_URL`.

For Prysm: `CC_NODE=cc.example.com:4000`, assuming you left the `CC_HOST` variable at default on the consensus client, and your domain is `example.com`.
