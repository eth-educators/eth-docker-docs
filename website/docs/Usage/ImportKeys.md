---
id: ImportKeys
title: "Create and import validator keys to the client"
sidebar_label: Import Validator Keys
---

You will deposit ETH to the deposit contract, and receive staking rewards on this locked ETH in turn.

> **Vital** [Recommendations.md](../Support/Recommendations.md) has comments on key security. If you haven't
read these yet, please do so now. You need to know how to guard your keystore password and your seed phrase (mnemonic). **Without the mnemonic, you may be unable to withdraw your funds. You need the seed phrase or your ETH could be gone forever.**

## Create keys

For mainnet, best practice is to create keys using a Linux Live USB and the official [staking-deposit-cli](https://github.com/ethereum/staking-deposit-cli). I have a [YouTube walkthrough](https://www.youtube.com/watch?v=oDELXYNSS5w) for this process. Make sure to safeguard your mnemonic and only ever keep it offline! In steel and in a safe is best.

### You want to create keys with eth-docker

If you are going to use the deposit-cli that is bundled with eth-docker, please make sure to edit `.env` and that the `COMPOSE_FILE` line contains `:deposit-cli.yml`. You can edit with `nano .env`.

Make sure you're in the project directory, `cd ~/eth-docker` by default.

When creating keys, you can specify an Ethereum address that withdrawals will be paid to. If you have a hardware wallet that withdrawals should go to, this is a good option.
> Make sure the Ethereum address is correct, you cannot change it after you deposit. You can also remove that parameter, in which  case withdrawals would be done with the mnemonic seed, not against a fixed address

This command will create the keys to deposit ETH against:

`./ethd cmd run --rm deposit-cli-new --execution_address YOURHARDWAREWALLETADDRESS --uid $(id -u)`
> Specifying the uid is optional. If this is not done, the generated files will be owned by the user with uid `1000`

Choose the number of validators you wish to create.
> A validator is synonymous to one 32 Ethereum stake. Multiple validators can be imported to a single validator client.

The created files will be in the directory `.eth/validator_keys` in this project.
> staking-deposit-cli shows you a different directory, that's because it has a view from inside the container.
 
This is also where you'd place your own keystore files if you already have some for import.

### Test your Seed Phrase

From the project directory:

```
./ethd cmd run --rm deposit-cli-existing --folder seed_check --execution_address YOURHARDWAREWALLETADDRESS --uid $(id -u)
```
> Specifying the uid is optional. If this is not done, the generated files will be owned by the user with uid `1000`

Select your language preference.

Type your mnemonic seed.

Enter the index (key number). 
> If generated 1 previous validator key file and entered 1 initially, then it is index[0]. So you will enter 0. Hence, you are entering the index from which to start generating the key file from.

Enter how may new validators you with to run.
> Enter the number of validators you entered when initially generating the key file.
> If you are running 1 previous validator and entered 1 initially, then enter 1.

Type any password you like, as you'll throw away the duplicate `keystore-m` files.

Compare the `deposit_data` JSON files to ensure the files are identical.
```
diff -s .eth/validator_keys/deposit_data*.json .eth/seed_check/deposit_data*.json
```

Cleanup duplicate deposit_data.
```
rm .eth/seed_check/*
```

## Using the keymanager API to import keys

**Warning** Import your validator key(s) to only *one* client. If you run them in two locations at once,
you will be slashed: Forcibly exited and assessed a penalty greater than 1 ETH.

> If you use the [Prysm Web](../Usage/PrysmWeb.md), you can use it
> or this command-line process to import keys.

### Prysm - create a wallet

Prysm requires a wallet first. Run `./ethd cmd run --rm create-wallet`, which will set up a wallet and a password for it. You can then print the password with `./ethd keys get-prysm-wallet`

### Start the client and import keys

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

## Importing keys from another validator instance

If you are migrating to eth-docker from another validator node that uses systemd or some other init system, please see [SwitchClient.md](../Support/SwitchClient.md) and [Moving.md](../Support/Moving.md) for advice. Ultimately, you'll likely need to export your keys from your old client and move them to your new node manually, and then use eth-docker's key management commands to import the keys into clients managed by eth-docker.

For example, for moving from a system+prysm setup, you'll want to use prysm's [export functionality](https://docs.prylabs.network/docs/advanced/migrating-keys). For other clients, check their official documentation to find out how to export your validator keys. You can then use eth-docker's key management API to import your keys with `./ethd keys import`.

Please read all of the warnings about slashing and make sure to exercise tons of caution when moving validators to avoid being slashed.

## Deposit at launchpad

**Caution**: You may wish to wait until the consensus and execution client are fully synchronized before you deposit. Check their logs with `./ethd logs -f consensus` and `./ethd logs -f execution`. This safe-guards against the validator being marked offline if your validator is activated before the consensus client syncs.

Once you are ready, you can send eth to the deposit contract by using
the `.eth/validator_keys/deposit_data-TIMESTAMP.json` file at the [Goerli launchpad](https://goerli.launchpad.ethereum.org/)
or [Mainnet launchpad](https://launchpad.ethereum.org).

> You can transfer files from your node to a machine with a browser using scp. A graphical
> tool such as WinSCP will work, or you can use [command line scp](https://linuxize.com/post/how-to-use-scp-command-to-securely-transfer-files/).
