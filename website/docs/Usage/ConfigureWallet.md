---
id: ConfigureWallet
title: "Step 3: Generate Ethereum PoS key files"
sidebar_label: Generate keys
---

You will deposit ETH to the deposit contract, and receive staking rewards on this locked ETH in turn.<br />
> **Vital** [Recommendations.md](../Support/Recommendations.md) has comments on key security. If you haven't
read these yet, please do so now. You need to know how to guard your keystore password
and your seed phrase (mnemonic). **Without the mnemonic, you will be unable to withdraw your funds
after the "merge" of Ethereum PoS with Ethereum PoW. You need the seed phrase or your ETH is gone forever.**


### You brought your own keys

Skip right to [importing keys](../Usage/ImportKeys.md).

> You can transfer files from your PC to the node using scp. A graphical
> tool such as WinSCP will work, or you can use [command line scp](https://linuxize.com/post/how-to-use-scp-command-to-securely-transfer-files/).

### You want to create keys with eth-docker

> You can create the keys using eth-docker. For mainnet, you may want to create
> the keys on a machine that is not connected to the Internet, and will be wiped
> afterwards. This can be done by using an [Ubuntu Live USB](https://agstakingco.gitbook.io/eth-2-0-key-generation-ubuntu-live-usb/)
> with [staking-deposit-cli](https://github.com/ethereum/eth2.0-deposit-cli), then
> copy them to the machine the node will run on, and continue with [key import](../Usage/ImportKeys.md).

If you are going to use the deposit-cli that is bundled with eth-docker, please
make sure that `COMPOSE_FILE` contains `deposit-cli.yml`

Make sure you're in the project directory, `cd ~/eth-docker` by default.

When creating keys, you can specify an Ethereum address that a future
withdrawal will be paid to. If you have a hardware wallet that withdrawals
should go to, this is a good option.
> Make sure the Ethereum address is correct, you cannot change it after you deposit. You can also remove that parameter, in which  case withdrawals would be done with the mnemonic seed, not against a fixed address

This command will create the keys to deposit Eth against:<br />
`./ethd cmd run --rm deposit-cli-new --eth1_withdrawal_address YOURHARDWAREWALLETADDRESS --uid $(id -u)`
> Specifying the uid is optional. If this is not done, the generated files will be owned by the user with uid `1000`

Choose the number of validators you wish to create.
> A validator is synonymous to one 32 Ethereum stake. Multiple validators can be imported to a single validator client.

The created files will be in the directory `.eth/validator_keys` in this project.
> staking-deposit-cli shows you a different directory, that's because it has a view from inside the container.
 
This is also where you'd place your own keystore files if you already have some for import.

### Test your Seed Phrase

From the project directory:

```
./ethd cmd run --rm deposit-cli-existing --folder seed_check --eth1_withdrawal_address YOURHARDWAREWALLETADDRESS --uid $(id -u)
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
