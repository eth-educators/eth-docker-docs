---
id: ImportKeys
title:  Import Validator Keys
sidebar_label: Import Validator Keys
---

# Step4: Import validator keys to the client

**Warning** Import your validator key(s) to only *one* client.

> If you use the [Prysm Web](../Usage/PrysmWeb.md), you can use it
> or this command-line process to import keys.

Import the validator key(s) to the validator client:

`sudo docker-compose run --rm validator-import`

> #### Prysm-specific
> - You will be asked whether you will be using the Web UI to import keys.
> Answer "y"es if you wish to use Prysm's Web UI to import keys. The Web UI
> is enabled by adding `prysm-web.yml` to `COMPOSE_FILE`
> - You will be asked to provide a "New wallet password", independent of the
>   keystore password. 
> - If you choose not to store the wallet password with the validator,
>   you will need to edit `prysm-base.yml` and `prysm-web.yml` and comment out the wallet-password-file
>   parameter

If you choose to save the password during import, it'll be available to the client every
time it starts. If you do not, you'll need to be present to start the
validator client and start it interactively. Determine your own risk profile.

> After import, the files in `.eth2/validator_keys` can be safely removed from the node,
> once you have copied them off the node. You'll need the `deposit_data` file to
> deposit at the launchpad. The `keystore-m` files can be safeguarded in case
> the node needs to be rebuilt, or deleted and recreated from mnemonic if required.
> See [Recommendations.md](../Support/Recommendations.md) for some thoughts on key security.
