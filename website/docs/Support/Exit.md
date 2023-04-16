---
id: Exit
title:  Voluntary validator exit
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

## Pre-sign exit messages

If you want to pre-sign exit messages, for example to leave for your heirs, you can do so
with `./ethd keys pre-sign from-keystore`, optionally with a parameter `--offline` added.

This uses `ethdo.yml` and will sign exit messages for all `keystore*.json` files in the
`.eth/validator_keys` directory. If `--offline` is used, it does not require connection
to a CL (consensus layer client) and instead expects a file `.eth/ethdo/offline-preparation.json`,
created with ethdo.

The created pre-signed exit messages will be in `.eth/exit_messages` and can be placed on a USB
stick for heirs, for example, and loaded via [beaconcha.in](https://beaconcha.in/tools/broadcast) when exit is desired.

Note that Ethereum pre-signed exit messages remain valid only for two hardforks: The current one, and the one after. It's good
practice to re-create the pre-signed messages after every hardfork.

This works when eth-docker is not the primary way to run the node. For example, for a systemd
setup, you could `nano .env`, set `COMPOSE_FILE=ethdo.yml`, and set `CL_NODE=http://HOSTIP:5052`,
adjusting `HOSTIP` to the IP address of your node and `5052` to the port REST is available on. Note
that for this to work, the REST port needs to be reachable by host IP, *not* just by `localhost`.
When in doubt, the `--offline` method will always work.
