---
id: Exit
title:  Voluntary validator exit.
sidebar_label: Voluntary exit
---

Ethereum PoS has a concept of "voluntary validator exit", which will remove the
validator from attesting duties. Locked ETH could be withdrawn after the "merge"
of the Proof-of-Work and Proof-of-Stake Ethereum chains, and not sooner.

Exiting a validator requires a fully synced consensus client. Checkpoint sync,
configured with `RAPID_SYNC_URL` in `.env`, can sync one in minutes.

## Teku

Teku will exit all validators that have been imported to it. Run
`./ethd cmd run --rm validator-exit` and follow the prompts.

## Prysm

To exit, run `./ethd cmd run --rm validator-exit` and follow the
prompts.

## Lighthouse

The exit procedure for Lighthouse requires a copy of the keystore JSON files.

- Copy the `keystore-m` JSON files into `.eth/validator_keys/` in this project directory.
- Run `./ethd cmd run --rm validator-exit /keys/<name-of-keystore-file>`, once for each keystore (validator) you wish to exit.
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

The exit procedure for Nimbus requires a copy of the keystore JSON files.

- Copy the `keystore-m` JSON files into `.eth/validator_keys/` in this project directory.
- Run `./ethd cmd run --rm validator-exit /keys/<name-of-keystore-file>`, once for each keystore (validator) you wish to exit.
- Follow prompts.

> The directory `.eth/validator_keys` is passed through to docker as `/keys`. Nimbus
> expects you to explicitly name the `keystore-m` file for which you wish to process an exit. Because this can
> be confusing, here's an example:
```
ubuntu@eth-testing:~/eth-docker-devel$ ./ethd cmd run --rm validator-exit /keys/keystore-m_12381_3600_0_0_0-1681561909.json
Please enter the password for decrypting '/keys/keystore-m_12381_3600_0_0_0-1681561909.json'
Password:
```

## Lodestar

To exit a specific validator, run `./ethd cmd run --rm validator-exit --pubkeys <0xPUBKEY>`.  
Multiple validators can be exited by providing a comma-separated list of public keys to `pubkeys`.  
If no `pubkeys` are provided, it will exit all validators that have been imported.

## Avoid penalties

Note you will need to continue running your validator until the exit
has been processed by the chain, if you wish to avoid incurring offline
penalties. You can check the status of your validator with tools such
as [beaconcha.in](https://beaconcha.in) and [beaconscan](https://beaconscan.com).
