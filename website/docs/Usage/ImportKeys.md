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

### Using the client CLI to import keys ... legacy

> This method will remain supported until the keymanager API is stable across all clients. It may be removed
> with the next Ethereum hardfork after merge. This is an alternative to using the keymanager API.

Import the validator key(s) to the validator client, assuming they are in `.eth/validator_keys` inside the
directory eth-docker is in. Any `slashing_protection*.json` files will also be imported:

`./ethd keyimport`

If they are in another directory, run:

`./ethd keyimport --path PATHTOKEYS`

replacing `PATHTOKEYS` with the actual path where they are.

> #### Prysm-specific
> - You will be asked whether you will be using the Web UI to import keys.
> Answer "y"es if you wish to use Prysm's Web UI to import keys. The Web UI
> is enabled by adding `prysm-web-shared.yml` to `COMPOSE_FILE`
> - You will be asked to provide a "New wallet password", independent of the
>   keystore password. 
> - If you choose not to store the wallet password with the validator,
>   you will need to edit `prysm-base.yml` and `prysm-web.yml` and comment out the wallet-password-file
>   parameter

If you choose to save the password during import, it'll be available to the client every
time it starts. If you do not, you'll need to be present to start the
validator client and start it interactively. 

> After import, the files in `.eth/validator_keys` can be safely removed from the node,
> once you have copied them off the node. You'll need the `deposit_data` file to
> deposit at the launchpad. The `keystore-m` files can be safeguarded in case
> the node needs to be rebuilt, or deleted and recreated from mnemonic if required.
> See [Recommendations.md](../Support/Recommendations.md) for some thoughts on key security.

### Importing keys from another validator instance

If you are migrating to eth-docker from another validator node that uses systemd or some other init system, please see [SwitchClient.md](../Support/SwitchClient.md) and [Moving.md](../Support/Moving.md) for advice. Ultimately, you'll likely need to move files manually to your docker volume mount. 

For exmample, for moving from a system+prysm setup, you'll either need to use prysm's export+import functionality, or you'll need to locate your `all-accounts.keystore.json` and `wallet-password.txt` files and move them manually to `/var/lib/docker/volumes/eth-docker_prysmvalidator-data/_data/`. 

Please read all of the warnings about slashing and make sure to exercise tons of caution when moving validators to avoid being slashed. 
