---
id: Recommendations
title:  Recommendations.
sidebar_label: Recommendations
---

Some recommendations on security of the host, general operation,
and key security.

## Operation

**Do not run two validator clients with the same validator keys imported at the same time**<br />
You'd get yourself slashed, and no-one wants that. Protecting you from this
is a work in progress. Choose one client, and one client only, and run that.

## Host Security

The [bare metal installation guide](https://someresat.medium.com/guide-to-staking-on-ethereum-ubuntu-nimbus-31f56657ea8f)
by /u/SomerEsat has excellent notes on Linux host security. Running `ntpd`
is highly recommended, time matters to validators. Note the ports
you will need to open in `ufw` depend on the client you choose.

## Firewalling

execution client: 30303 tcp/udp, forwarded to your server<br />
consensus client: 9000 tcp/udp, forwarded to your server<br />
grafana/web UI: 443 tcp, forwarded to your server, assuming you are using the reverse proxy.<br />

> The grafana port is insecure http:// if no reverse proxy is in use,
> and should then only be access locally.
> An [SSH tunnel](https://www.howtogeek.com/168145/how-to-use-ssh-tunneling/)
> is also a great option if you do not want to use the reverse proxy.

## Before depositing

You likely want to wait to deposit your ETH until you can see in the logs
that the execution client (e.g. geth) is synchronized and the consensus client
is fully synchronized. This takes hours on testnet and could take days on mainnet.

If you deposit before your client stack is fully synchronized and running,
you risk getting penalized for being offline. The offline penalty during
the first 5 months of mainnet will be roughly 0.13% of your deposit per
week.

## Wallet and key security

The security of the wallet mnemonic you create is **critical**. If it is compromised, you will lose
your balance. Please make sure you understand Ethereum staking before you use this project.

When you create the deposit and keystore files, write down your wallet mnemonic and
choose a cryptographically strong password for your keystores. Something long
and not used anywhere else, ideally randomized by a generator.

The directory `.eth/validator_keys` will contain the `deposit_data-TIMESTAMP.json` and `keystore-m_ID.json`
files created by staking-deposit-cli.

Use `deposit_data-TIMESTAMP.json` for your initial deposit. After that, it can be disposed of.

Use `keystore-m_ID.json` files to import your validator secret keys into the validator client
instance of the client you are running. These files need to be secured when you are done
with the initial import.

### Validator Key Security

The `keystore-m_ID.json` files have to be stored securely outside of this server. Offline
is best, on media that cannot be remotely compromised. Keep the password(s) for
these files secure as well, for example in a local (not cloud-connected) password vault
on a PC that is not on the network, or at the very least not used for online access.

Once you have the keystore files secure and they've been imported to the validator client container
on your server, you should delete them from the `.eth` directory.

These files will be needed in case you need to restore your validator(s).

**Caution**<br />
An attacker with access to these files could slash your validator(s) or threaten
to slash your validator(s).

For more on validator key security, read this article: https://www.attestant.io/posts/protecting-validator-keys/

### Withdrawal Key Security

**Critical**<br />
When you ran staking-deposit-cli, a 24-word mnemonic was created. This mnemonic
is used for Ethereum validator exits and withdrawals. It must be securely kept offline.
Without this mnemonic, unless you set a withdrawal address via `--execution_address`, there is **no** way to withdraw your funds.

Precise methods are beyond this README, but consider something as simple as
a sheet of paper kept in a fireproof envelope in a safe, or one of the [steel
mnemonic safeguards](https://jlopp.github.io/metal-bitcoin-storage-reviews/) that are available.

Test your mnemonic **before** you deposit, so you know that you will be able
to withdraw funds in future.

An attacker with access to your mnemonic can drain your funds, if no withdrawal address was set during key generation. If one
was set, they can't get the validator funds, but can cause a "slashing", a penalty of around 1.1 ETH and forced exit of the validator.

For more on withdrawal key security, read this article: https://www.attestant.io/posts/protecting-withdrawal-keys/

> Testing your mnemonic can be as simple as typing it into deposit-cli
> with `existing-mnemonic`, then comparing the public key(s) of the resulting
> keystore-m signing key files to the public keys you know your validator(s)
> to have. The safest way to do this is offline, on a machine that will
> never be connected to Internet and will be wiped after use.

