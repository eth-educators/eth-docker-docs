---
id: ImportKeys
title: "Step 4: Import validator keys to the client"
sidebar_label: Import Validator Keys
---

**Warning** Import your validator key(s) to only *one* client. If you run them in two locations at once,
you will be slashed: Forcibly exited and assessed a penalty greater than 1 ETH.

> If you use the [Prysm Web](../Usage/PrysmWeb.md), you can use it
> or this command-line process to import keys.

### Using the keymanager API to import keys

#### Prysm - create a wallet

Prysm requires a wallet first. Run `./ethd cmd run --rm create-wallet`, which will set up a wallet and a password for it. You can then print the password with `./ethd keys get-prysm-wallet`

#### Start the client and import keys

`./ethd up` to start the client and the client's keymanager API

`./ethd keys` to see all options available to you

`./ethd keys import` to import keys and their slashing protection data. This looks in `.eth/validator_keys` for `keystore*.json` files and optionally `slashing_protection*.json` files.

If the key JSON files are in another directory, run:

`./ethd keys import --path PATHTOKEYS`

replacing `PATHTOKEYS` with the actual path where they are.

`./ethd keys list` to list all imported keys

> After import, the files in `.eth/validator_keys` can be safely removed from the node,
> once you have copied them off the node. You'll need the `deposit_data` file to
> deposit at the launchpad. The `keystore-m` files can be safeguarded in case
> the node needs to be rebuilt, or deleted and recreated from mnemonic if required.
> See [Recommendations.md](../Support/Recommendations.md) for some thoughts on key security.

### Importing keys from another validator instance

If you are migrating to eth-docker from another validator node that uses systemd or some other init system, please see [SwitchClient.md](../Support/SwitchClient.md) and [Moving.md](../Support/Moving.md) for advice. Ultimately, you'll likely need to export your keys from your old client and move them to your new node manually, and then use eth-docker's key management commands to import the keys into clients managed by eth-docker.

For example, for moving from a system+prysm setup, you'll want to use prysm's [export functionality](https://docs.prylabs.network/docs/advanced/migrating-keys). For other clients, check their official documentation to find out how to export your validator keys. You can then use eth-docker's key management API to import your keys with `./ethd keys import`.

Please read all of the warnings about slashing and make sure to exercise tons of caution when moving validators to avoid being slashed.
