---
id: AddValidator
title: Manage validator keys.
sidebar_label: Manage validator keys
---

You can use staking-deposit-cli to either recover validator signing keys or add
additional ones, if you wish to deposit more validators against the same mnemonic.

> The same cautions apply as when creating keys in the first place. You
> may wish to take these steps on a machine that is disconnected from Internet
> and will be wiped immediately after creating the keys.

## Recover keys

In order to recover all your validator signing keys, run `docker-compose run --rm deposit-cli-existing --uid $(id -u)`
and provide your mnemonic, then set index to "0" and the number of validators to the number you had created previously
and are now recreating.
> Specifying the uid is optional. If this is not done, the generated files will be owned
> by the user with the user id `1000`

## Create additional keys

In order to add additional validator signing keys, likewise run `docker-compose run --rm deposit-cli-existing --eth1_withdrawal_address YOURHARDWAREWALLETADDRESS --uid $(id -u)`
and provide your mnemonic, but this time set the index to the number of validator keys you had created previously,
for example, `4`. Specify how many *new, additional* validators you want to create. You will receive new `keystore-m` signing keys
and a new `deposit_data` JSON.
> This example assumes that you want to fix withdrawals to an Ethereum address you control,
> ideally a hardware wallet. You can leave the `--eth1_withdrawal_address` parameter out
> and withdrawals will work with your seed phrase (mnemonic), to any address you
> specify during withdrawal.

**Caution**

Please triple-check your work here. You want to be sure the new validator keys are created after
the existing ones. Launchpad will likely safeguard you against depositing twice, but don't rely
on it. Verify that the public keys in `deposit_data` are new and you did not deposit for them
previously.

### Import new keys into existing validator client

Your validator keys, each backed by 32 ETH, "live inside" the validator client. Each key represents one "validator". To add them, simply run `./ethd keys import`, with the new `keystore-m` JSON files in `.eth/validator_keys`. This uses the keymanager API and is done while the client is running.

> **Caution** Please be sure to only import the keys into one validator client. If they are imported to multiple clients, you will slash yourself: A harsh penalty
> and forced exit of the validator.

## Delete keys and get the slashing protection database

Run `./ethd keys list`, then `./ethd keys delete 0xPUBKEY` with the public key of the key you wish to delete. It will
be remove from the validator client, and its slashing protection database written to `.eth/validator_keys`

## Set individual fee recipient

Run `./ethd keys list`, then `./ethd keys set-recipient 0xPUBKEY 0xADDRESS` with the public key of the key you wish to set a separate fee recipient for, and the Ethereum address fees should go to.

`./ethd keys get-recipient 0XPUBKEY` shows the recipient

`./ethd keys delete-recipient 0xPUBKEY` deletes the custom recipient, falling back to the default

## Set individual gas limit

Run `./ethd keys list`, then `./ethd keys set-gas 0xPUBKEY AMOUNT` with the public key of the key you wish to set a separate fee recipient for, and the gas limit you wish to set.

`./ethd keys get-gas 0XPUBKEY` shows the gas limit

`./ethd keys delete-gas 0xPUBKEY` deletes the custom gas limit, falling back to the default
