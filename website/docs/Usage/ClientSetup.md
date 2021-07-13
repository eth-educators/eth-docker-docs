---
id: ClientSetup
title: "Step 2: Client Setup and Linux security"
sidebar_label: Client Setup
---

With prerequisites installed, choose a client and configure this project to use it. This document also steps
you through some essential Linux security settings.

If you haven't already, please see [prerequisites](../Usage/Prerequisites.md) and meet them for your OS.

## Non-root user on Linux

If you are logged in as user `root` and do not have a non-root user already, create a non-root user 
with your `USERNAME` of choice to log in as, and give it sudo rights. `sudo` allows you to 
run commands `as root` while logged in as a non-root user. 

This step may be needed on a VPS, and is not typically needed on a local fresh install of Ubuntu,
as Ubuntu creates a non-root user by default.

```
adduser USERNAME
```

You will be asked to create a password for the new user, among other things. Then, give the new user
administrative rights by adding it to the `sudo` group.

```
usermod -aG sudo USERNAME
```

Optional: If you used SSH keys to connect to your Ubuntu instance via the `root` user you
will need to [associate the new user with your public key(s)](#ssh-key-authentication-with-linux).

## Optional: User as part of docker group

Optionally, you may want to avoid needing to type `sudo` every time you run a command. In that
case, you can make your local user part of the `docker` group.

> Please note that a user that is part of the docker group has `root` privileges through docker,
> even without the use of `sudo`. You may not want this convenience trade-off and choose to
> explicitly use `sudo` with all docker commands instead.

```
sudo usermod -aG docker USERNAME
```

followed by

```
newgrp docker
```

## Static IP

With a VPS, you have a static IP by default. In your home network, that is typically not the case.

You'll want a static IP address for your server, one that doesn't change. This allows easier
port-forwarding for your Ethereum client peering, and easier management and remote access for you:
You do not need to find a changing server address. You can do set an unchanging IP address a few
different ways.

- You can configure your router to use a [DHCP reservation](https://homenetworkadmin.com/dhcp-reservation/).
How to do this depends on your router.
- You could instead choose an IP address *outside* your DHCP range and [configure it as a static IP](https://linuxhint.com/setup_static_ip_address_ubuntu/).
In Ubuntu Desktop this is done through Network Manager from the UI, and in Ubuntu Server you'll handle it
from CLI via netplan. Check your router configuration to see where your DHCP range is, and what
values to use for default gateway and DNS.

## "Clone" the project

From a terminal and logged in as the user you'll be using from now on, and assuming
you'll be storing the project in your `$HOME`, run:

```
cd ~ && git clone https://github.com/eth2-educators/eth-docker.git && cd eth-docker
```

You know this was successful when your prompt shows `user@host:~/eth-docker`

> Note: All work will be done from within the `~/eth-docker` directory.
> All commands that have you interact with the "dockerized" client will
> be carried out from within that directory.

## eth-docker QuickStart Shell

To fully customize your eth-docker instance, follow the manual steps. To get a quick standard build you can use the included `./ethd config` config wizard.  Simply choose the Consensus Client, Execution Client, whether you want to use a Grafana dashboard, and which network you'll be running on.

The same script can also be used to stop, start and update the node. Run `./ethd` for a help screen.

## Client choice - manual setup

> You can refer back to the [Overview](../About/Overview.md) to get a sense of how the
> validator client, consensus client and execution client are
> connected to each other, and which role each plays.

Please choose:

* The consensus client you wish to run
  * Teku
  * Lighthouse
  * Prysm
  * Nimbus
* Your source of Ethereum PoW chain data
  * geth
  * erigon - alpha, source build only. Feedback welcome
  * besu - Feedback welcome.
  * nethermind - Feedback welcome.
  * 3rd-party
* Whether to run a grafana dashboard for monitoring

First, copy the environment file.<br />
`cp default.env .env`

> This file is called `.env` (dot env), and that name has to be exact. docker-compose
> will otherwise show errors about not being able to find a `docker-compose.yml` file,
> which this project does not use.
 
Then, adjust the contents of `.env`. On Ubuntu Linux, you can run `nano .env`.

- Set the `COMPOSE_FILE` entry depending on the client you are going to run,
and with which options. See below for available compose files. Think of this as
blocks you combine: One consensus client, optionally one execution client, optionally reporting,
optionally a reverse proxy for https:// access to reporting.
- If you are going to use a 3rd-party provider as your Ethereum PoW chain source, set `EC_NODE` to that URL.
  See [how to create your own Infura account](https://status-im.github.io/nimbus-eth2/infura-guide) or look into [Alchemy](https://alchemyapi.io)
- For Teku, Lighthouse and Nimbus, you can set `EC_NODE` to a comma-separated list, for example `http://execution:8545,https://<infura-url>`
  would use a local execution client first, and fail back to Infura when it does not respond.
- For Prysm, you can set `EC_FALLBACK_NODE1` and `EC_FALLBACK_NODE2` to be your first and second fallback,
respectively.
- Set the `NETWORK` variable to either "mainnet" or a test network such as "prater"
- If you are running your own execution client, set the `EC_NETWORK` variable to `mainnet` or `goerli` testnet
- Set the `GRAFFITI` string if you want a specific string.
- If you are going to run a validator client only, without a consensus client, set `CC_NODE` to the URL of your Ethereum PoS beacon/eth2 Infura project, and
  choose one of the `CLIENT-validator.yml` entries in `COMPOSE_FILE`.
- If you are going to send statistics to https://beaconcha.in, set `BEACON_STATS_API` to your API key
- If you intend to use Teku and want to sync quickly, set `TEKU_RAPID_SYNC` to your Infura beacon project
- Adjust ports if you are going to need custom ports instead of the defaults. These are the ports
exposed to the host, and for the P2P ports to the Internet via your firewall/router.

### Client compose files

Set the `COMPOSE_FILE` string depending on which client you are going to use. Add optional services like
geth with `:` between the file names.

Choose one consensus client:

- `teku-base.yml` - Teku
- `lh-base.yml` - Lighthouse
- `prysm-base.yml` - Prysm
- `nimbus-base.yml` - Nimbus

If you'd rather just run a validator client, and back-end to an Infura eth2/beacon project:

- `lh-validator.yml` - Lighthouse validator only
- `teku-validator.yml` - Teku validator only

> The `CC_NODE` variable in `.env` will need to be set to the URL your
> Infura eth2/beacon project shows you.

> Grafana is expected to not work with this option, as there is no consensus client
> to get data from. You can use https://beaconcha.in/ instead.

Optionally, choose one execution client, unless you are using a 3rd-party provider:

- `geth.yml` - local geth execution client
- `erigon.yml` - local erigon execution client - feedback welcome.
- `besu.yml` - local besu execution client - feedback welcome.
- `nm.yml` - local nethermind execution client - feedback welcome.

Optionally, choose a reporting package:

- `prysm-stats.yml` - send stats to https://beaconcha.in, requires API key
- `lh-stats.yml` - send stats to https://beaconcha.in, requires API key

- `prysm-web.yml` - Prysm Web UI.

- `teku-grafana.yml` - grafana dashboard for Teku
- `lh-grafana.yml` - grafana dashboard for Lighthouse
- `prysm-grafana.yml` - grafana dashboard for Prysm.
- `nimbus-grafana.yml` - grafana dashboard for Nimbus
- `geth-grafana.yml` - grafana dashboard for Geth, to be combined with one of the client dashboards, or with `blank-grafana.yml` if standalone. Example `COMPOSE_FILE=lh-base.yml:geth.yml:lh-grafana.yml:geth-grafana.yml:grafana-insecure.yml`
- `erigon-grafana.yml` - grafana dashboard for Erigon, to be combined with one of the client dashboards, or with `blank-grafana.yml` if standalone. Example `COMPOSE_FILE=lh-base.yml:erigon.yml:lh-grafana.yml:erigon-grafana.yml:grafana-insecure.yml`

- `grafana-insecure.yml` - to map the Grafana port (default: 3000) to the host. This is not encrypted and should not be exposed to the Internet. Used *in addition* to `CLIENT-grafana.yml`, not instead. Using encryption instead via `traefik-*.yml` is recommended.
- `prysm-web-insecure.yml` - to map the Prysm web port (default: 3500) to the host. This is not encrypted and should not be exposed to the Internet. Used *in addition* to `prysm-web.yml`, not instead. Using encryption instead via `traefik-*.yml` is recommended.

> See [Prysm Web](../Usage/PrysmWeb.md) for notes on using the Prysm Web UI

Optionally, make the eth2.0-deposit-cli available:

- `deposit-cli.yml` - Used to generate mnemonics and signing keys. Consider running key generation offline, instead, and copying the generated `keystore-m` files into this tool 

Optionally, add encryption to the Grafana and/or Prysm Web pages:

- `traefik-cf.yml` - use encrypting secure web proxy and use CloudFlare for DNS management
- `traefik-aws.yml` - use encrypting secure web proxy and use AWS Route53 for DNS management

With these, you wouldn't use the `-insecure.yml` files. Please see [Secure Web Proxy Instructions](../Usage/ReverseProxy.md) for setup instructions for either option.

For example, Lighthouse with local geth and beaconcha.in stats:
`COMPOSE_FILE=lh-base.yml:geth.yml:lh-stats.yml`

Advanced options:

- `ec-traefik.yml` - reverse-proxies and encrypts both the RPC and WS ports of your execution client, as https:// and wss:// ports respectively. To be used alongside one of the execution client yml files.
- `ec-shared.yml` - as an insecure alternative to ec-traefik, makes the RPC and WS ports of the execution client available from the host. To be used alongside one of the execution client yml files. **Not encrypted**, do not expose to Internet.

- `lh-consensus.yml`, `teku-consensus.yml`, `prysm-consensus.yml` - for running a [distributed consensus client and validator client](../Usage/ReverseProxy.md) setup.

- `prysm-slasher.yml` - Prysm experimental slasher. The experimental slasher can lead to missed attestations due to the additional resource demand.

### Multiple nodes on one host

In this setup, clients are isolated from each other. Each run their own validator client, and if an execution client
is in use, their own execution client. This is perfect for running a single client, or multiple isolated
clients each in their own directory.

If you want to run multiple isolated clients, just clone this project into a new directory for
each. This is great for running testnet and mainnet in parallel, for example.

### Prysm Slasher   

Running [slasher](https://docs.prylabs.network/docs/prysm-usage/slasher/) is an optional client compose file, but helps secure the chain and may result in additional earnings,
though the chance of additional earnings is low initially, as whistleblower rewards have not been implemented yet.

> Slasher can be a huge resource hog during times of no chain finality, which can manifest as massive RAM usage. Please make sure you understand the risks of this, 
> especially if you want high uptime for your Ethereum staking full node. Slasher places significant stress on the consensus client when the chain has no finality, and might be the reason
> why your validators are underperforming if your consensus client is under this much stress.

## Build the client

Build all required images. If building from source, this may take up to an hour. Assuming
you cloned the project into `eth-docker`:
```
cd ~/eth-docker && sudo docker-compose build --pull
```

## Additional and recommended Linux security steps
### Firewalling

You'll want to enable a host firewall. You can also forward the P2P ports of your execution and consensus
clients for faster peer acquisition.

These are the relevant ports. Docker will open execution and consensuns client P2P (Peer to Peer) ports and the grafana port automatically,
please make sure the grafana port cannot be reached directly. If you need to get to grafana remotely,
an [SSH tunnel](https://www.howtogeek.com/168145/how-to-use-ssh-tunneling/) is a good choice.

For a VPS/cloud setup, please take a look at notes on [cloud security](../Support/Cloud.md). You'll want to
place ufw "in front of" Docker if you are using Grafana or a standalone execution client without a reverse proxy,
and if your cloud provider does not offer firewall rules for the VPS.

Ports that I mention can be "Open to Internet" can be either forwarded
to your node if behind a home router, or allowed in via the VPS firewall.

> Opening the P2P ports to the Internet is optional. It will speed up peer acquisition, which
> can be helpful. To learn how to forward your ports in a home network, first verify
> that you are [not behind CGNAT](https://winbuzzer.com/2020/05/29/windows-10-how-to-tell-if-your-isp-uses-carrier-grade-nat-cg-nat-xcxwbt/).
> Then look at [port-forwarding instructions](https://portforward.com/) for your specific router/firewall. 

Open only the ports that you actually use, depending on your client choices.

- 30303 tcp/udp - local execution client P2P. Open to Internet.
- 9000 tcp/udp - Lighthouse consensus client P2P. Open to Internet.
- 13000/tcp - Prysm consensus client P2P. Open to Internet.
- 12000/udp - Prysm consensus client P2P. Open to Internet.
- 9000 tcp/udp - Teku consensus client P2P. Open to Internet. Note this is the same default port as Lighthouse.
- 9000 tcp/udp - Nimbus consensus client P2P. Open to Internet. Note this is the same default port as Lighthouse.
- 443 tcp - https:// access to Grafana and Prysm Web UI via traefik. Open to Internet.
- 22/tcp - SSH. Only open to Internet if you want to access the server remotely. If open to Internet, configure
  SSH key authentication.

On Ubuntu, the host firewall `ufw` can be used to allow SSH traffic. 

Docker bypasses ufw and opens additional ports directly via "iptables" for all ports that are public on the host,
which means that the P2P ports need not be explicitly listed in ufw, and the same is true for the r.

* Allow SSH in ufw so you can still get to your server, while relying on the default "deny all" rule.
  * `sudo ufw allow OpenSSH` will allow ssh inbound on the default port. Use your specific port if you changed
    the port SSH runs on.
* Check the rule you created and verify that you are allowing SSH, on the port you are running it on.
  You can **lock yourself out** if you don't allow your SSH port in. `allow OpenSSH` is sufficient
  for the default SSH port.
  * `sudo ufw show added`
* Enable the firewall and see numbered rules once more
  * `sudo ufw enable`
  * `sudo ufw status numbered`

> There is one exception to the rule that Docker opens ports automatically: Traffic that targets a port
> mapped by Docker, where the traffic originates somewhere on the same machine the container runs on,
> and not from a machine somewhere else, will not be automatically handled by the Docker firewall rules, 
> and will require an explicit ufw rule. 
> Steps to allow for this scenario are in [cloud security](../Support/Cloud.md)

### SSH key authentication with Linux

This step is vital if your node's SSH port is reachable via the Internet, for example, because
it runs on a VPS. This step is recommended if the SSH port is not reachable via the Internet. 

For security reasons, you want some form of two-factor authentication for SSH login, particularly if SSH
is exposed to the Internet. These instructions accomplish that by creating an SSH key with passphrase.
Alternatively or in addition, you could set up [two-factor authentication with one-time passwords](https://www.coincashew.com/coins/overview-eth/guide-or-security-best-practices-for-a-eth2-validator-beaconchain-node#setup-two-factor-authentication-for-ssh-optional).

To switch to SSH key authentication instead of password authentication, you will start
on the machine you are logging in from, whether that is Windows 10, MacOS or Linux, and then
make changes to the server you are logging in to.

On Windows 10, you expect the [OpenSSH client](https://winaero.com/blog/enable-openssh-client-windows-10/)
to already be installed. If it isn't, follow that link and install it.

From your MacOS/Linux Terminal or Windows Powershell, check whether you have an ssh key. You expect an id_TYPE.pub
file when running `ls ~/.ssh`.

#### Create an SSH key pair

Create a key if you need to, or if you don't have `id_ed25519.pub` but prefer that cipher:<br />
`ssh-keygen -t ed25519`. Set a strong passphrase for the key.
> Bonus: On Linux, you can also include a timestamp with your key, like so:<br />
> `ssh-keygen -t ed25519 -C "$(whoami)@$(hostname)-$(date -I)" -f ~/.ssh/id_ed25519`

#### MacOS/Linux, copy public key

 If you are on MacOS or Linux, you can then copy this new public key to the Linux server:<br />
`ssh-copy-id USERNAME@HOST`

#### Windows 10, copy public key

On Windows 10, or if that command is not available, output the contents of your public key file
to terminal and copy, here for `id_ed25519.pub`:<br />
`cat ~/.ssh/id_ed25519.pub`

On your Linux server, logged in as your non-root user, add this public key to your account:<br />
```
mkdir ~/.ssh
nano ~/.ssh/authorized_keys
```
And paste in the public key.

#### Test login and turn off password authentication

Test your login. `ssh user@serverIP` from your client's MacOS/Linux Terminal or Windows Powershell should log you in
directly, prompting for your key passphrase, but not the user password.

If you are still prompted for a password, resolve that first. Your ssh client should show you errors in that case. You
can run `ssh -v user@serverIP` to get more detailed output on what went wrong.

On Windows 10 in particular, if the ssh client complains about the "wrong permissions" on the `.ssh` directory or
`.ssh/config` file, go into Explorer, find the `C:\Users\USERNAME\.ssh` directory, edit its Properties->Security, click
Advanced, then make your user the owner with Full Access, while removing access rights to anyone else, such as SYSTEM
and Administrators. Check "Replace all child object permissions", and click OK. That should solve the issues the
OpenSSH client had.

Lastly, once key authentication has been tested, turn off password authentication. On your Linux server:<br />
`sudo nano /etc/ssh/sshd_config`

Find the line that reads `#PasswordAuthentication yes` and remove the comment character `#` and change it to `PasswordAuthentication no`.

And restart the ssh service, for Ubuntu you'd run `sudo systemctl restart ssh`.

### Set Linux to auto-update

Since this system will be running 24/7 for the better part of 2 years, it's a good idea to have it patch itself.
Enable [automatic updates](https://libre-software.net/ubuntu-automatic-updates/) and install software so the
server can [email you](https://www.havetheknowhow.com/Configure-the-server/Install-ssmtp.html).

For automatic updates, `"only-on-error"` mail reports make sense once you know email reporting is working and
if you choose automatic reboots, trusting that your services will all come back up on reboot. If you'd like
to keep a closer eye or schedule reboots yourself, `"on-change"` MailReport is a better choice.

For ssmtp, I followed the instructions as-is with one change: I do not see the sense of changing the `hostname`
to my email address, and so didn't.

If you are using Ubuntu, you may also want to look into [Ubuntu Livepatch](https://ubuntu.com/security/livepatch), which reduces the frequency of
reboots on update and is free for up to 3 machines. Do make a note to disable Livepatch again before decommissioning 
the machine, as it can only be disabled from the machine it is enabled on. This keeps your 3 free instances available.

### Time synchronization on Linux

The default time sync setting on Ubuntu will work. If you'd like to explore alternatives, please read on.

The blockchain requires precise time-keeping. You can use systemd-timesyncd if your system offers it,
or [ntpd](https://en.wikipedia.org/wiki/Network_Time_Protocol) to synchronize time on your Linux server.
systemd-timesyncd uses a single ntp server as source, and ntpd uses several, typically a pool.
My recommendation is to use ntpd for better redundancy.

For Ubuntu, first switch off the built-in, less redundant synchronization and verify it is off. 
You should see `NTP service: inactive`.

```
sudo timedatectl set-ntp no
timedatectl
```

Then install the ntp package. It will start automatically.<br />
`sudo apt update && sudo apt install ntp`

Check that ntp is running correctly: Run `ntpq -p` , you expect to see a number of ntp time servers with
IP addresses in their `refid`, and several servers with a refid of `.POOL.`

> If you wish to stay with systemd-timesyncd instead, check that `NTP service: active` via 
> `timedatectl`, and switch it on with `sudo timedatectl set-ntp yes` if it isn't. You can check
> time sync with `timedatectl timesync-status --all`.

### Set up IPMI

This step is highly hardware-dependent. If you went with a server that has IPMI/BMC - out of band management of
the hardware - then you'll want to configure IPMI to email you on error.

