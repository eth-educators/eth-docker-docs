---
id: ConfigureWallet
title:  Configure Wallet
sidebar_label: Configure Wallet
---

You will deposit eth to the deposit contract, and receive locked eth2 in turn.<br />
> **Vital** [Recommendations.md](../Support/Recommendations.md) has comments on key security. If you haven't
read these yet, please do so now. You need to know how to guard your keystore password
and your seed phrase (mnemonic). **Without the mnemonic, you will be unable to withdraw your funds
after the "merge" of Ethereum 2.0 with Ethereum 1. You need the seed phrase or your eth is gone forever.**

> You can create the keys using eth2-docker. For mainnet, you may want to create
> the keys on a machine that is not connected to the Internet, and will be wiped
> afterwards. This can be done by using an [Ubuntu Live USB](https://agstakingco.gitbook.io/eth-2-0-key-generation-ubuntu-live-usb/)
> with [eth2.0-deposit-cli](https://github.com/ethereum/eth2.0-deposit-cli), then
> copy them to the machine the node will run on, and continue from
> "You brought your own keys", below.

Make sure you're in the project directory, `cd ~/eth2-docker` by default.

This command will create the keys to deposit Eth against:<br />
`sudo docker-compose run --rm deposit-cli`

Choose the number of validators you wish to create.
> A validator is synonymous to one 32 Ethereum stake. Multiple validators
> can be imported to a single validator client.

The created files will be in the directory `.eth2/validator_keys` in this project.
> eth2.0-deposit-cli shows you a different directory, that's because it has a view
> from inside the container.
 
This is also where you'd place your own keystore files if you already have some for import.

### You brought your own keys

They go into `.eth2/validator_keys` in this project directory, not directly under `$HOME`.

### Test your Seed Phrase
Update validator_start_index, num_validators, and chain to match your settings above.

From the project directory...

```
mkdir seed_checker
sudo docker run -it eth2.0-deposit-cli existing-mnemonic --validator_start_index 0 --num_validators 3 --chain mainnet --folder seed_checker
```

type your seed, and password

compare the deposit_data to ensure the files are identical.
```
diff -s .eth2/validator_keys/deposit_data*.json seed_checker/deposit_data*.json
```

Cleanup duplicate deposit_data.
```
rm -rf seed_checker
```