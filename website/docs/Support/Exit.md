---
id: Exit
title:  Voluntary validator exit.
sidebar_label: Voluntary exit
---

Ethereum PoS has a concept of "voluntary validator exit", which will remove the
validator from attesting duties. Locked ETH could be withdrawn after the "merge"
of the Proof-of-Work and Proof-of-Stake Ethereum chains, and not sooner.

Exiting a validator requires a fully synced consensus client.

## Teku

Teku will exit all validators that have been imported to it. Run
`./ethd cmd run --rm validator-exit` and follow the prompts.

## Prysm

To exit, run `./ethd cmd run --rm validator-exit` and follow the
prompts.

## Lighthouse

The exit procedure for Lighthouse requires a copy of the keystore JSON files.

- Copy the `keystore-m` JSON files into `.eth/validator_keys/` in this project
  directory.
- Run `./ethd cmd run --rm validator-exit /keys/<name-of-keystore-file>`,
  once for each keystore (validator) you wish to exit.
- Follow prompts.

> The directory `.eth/validator_keys` is passed through to docker as `/keys`. Lighthouse
> expects you to explicitly name the `keystore-m` file for which you wish to process an exit. Because this can
> be confusing, here's an example:
```
yorick@ethlinux:~/eth-pyrmont$ ls .eth/validator_keys/
deposit_data-1605672506.json  keystore-m_12381_3600_0_0_0-1605672506.json
yorick@ethlinux:~/eth-pyrmont$ ./ethd cmd run --rm validator-exit /keys/keystore-m_12381_3600_0_0_0-1605672506.json
Starting eth-pyrmont_consensus_1 ... done
Running account manager for pyrmont testnet
validator-dir path: "/keys" 
Enter the keystore password for validator in "/keys/keystore-m_12381_3600_0_0_0-1605672506.json"  
```

## Nimbus

You will need to know the index of your validator as it shows on https://beaconcha.in/ or https://pyrmont.beaconcha.in/ if on Pyrmont testnet, or its public key.

Run `./ethd cmd run --rm validator-exit <INDEX or 0xPUBKEY>` and follow prompts to exit. For example:
- If using an index, here 0, `./ethd cmd run --rm validator-voluntary-exit 0`
- If using a public key, you need to include "0x" in front of it, for example `./ethd cmd run --rm validator-voluntary-exit 0xb0127e191555550fae82788061320428d2cef31b0807aa33b88f48c53682baddce6398bb737b1ba5c503ca696d0cab4a`

## Lodestar

To exit a specific validator, run `./ethd cmd run --rm validator-exit --pubkeys <0xPUBKEY>`.  
Multiple validators can be exited by providing a comma-separated list of public keys to `pubkeys`.  
If no `pubkeys` are provided, it will exit all validators that have been imported.

## Avoid penalties

Note you will need to continue running your validator until the exit
has been processed by the chain, if you wish to avoid incurring offline
penalties. You can check the status of your validator with tools such
as [beaconcha.in](https://beaconcha.in) and [beaconscan](https://beaconscan.com).
