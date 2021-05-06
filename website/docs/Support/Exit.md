---
id: Exit
title:  Voluntary validator exit.
sidebar_label: Voluntary exit
---

Ethereum 2.0 has a concept of "voluntary validator exit", which will remove the
validator from attesting duties. Locked Eth could be withdrawn after the "merge"
of the Proof-of-Work and Proof-of-Stake Ethereum chains, and not sooner.

Exiting a validator requires a fully synced beacon node.

## Teku

Teku will exit all validators that have been imported to it. Run
`sudo docker-compose run --rm validator-exit` and follow the prompts.

## Prysm

To exit, run `sudo docker-compose run --rm validator-exit` and follow the
prompts.

## Lighthouse

The exit procedure for lighthouse is not very refined, yet.

- Copy the `keystore-m` JSON files into `.eth2/validator_keys/` in this project
  directory.
- Run `sudo docker-compose run --rm validator-exit /keys/<name-of-keystore-file>`,
  once for each keystore (validator) you wish to exit.
- Follow prompts.

> The directory `.eth2/validator_keys` is passed through to docker as `/keys`. Lighthouse
> expects you to explicitly name the `keystore-m` file for which you wish to process an exit. Because this can
> be confusing, here's an example:
```
yorick@ethlinux:~/eth2-pyrmont$ ls .eth2/validator_keys/
deposit_data-1605672506.json  keystore-m_12381_3600_0_0_0-1605672506.json
yorick@ethlinux:~/eth2-pyrmont$ sudo docker-compose run --rm validator-exit /keys/keystore-m_12381_3600_0_0_0-1605672506.json
Starting eth2-pyrmont_beacon_1 ... done
Running account manager for pyrmont testnet
validator-dir path: "/keys" 
Enter the keystore password for validator in "/keys/keystore-m_12381_3600_0_0_0-1605672506.json"  
```

## Nimbus

You will need to know the index of your validator as it shows on https://beaconcha.in/ or https://pyrmont.beaconcha.in/ if on Pyrmont testnet, or its public key.

Run `sudo docker-compose run --rm validator-exit <INDEX or 0xPUBKEY>` and follow prompts to exit. For example:
- If using an index, here 0, `sudo docker-compose run --rm validator-voluntary-exit 0`
- If using a public key, you need to include "0x" in front of it, for example `sudo docker-compose run --rm validator-voluntary-exit 0xb0127e191555550fae82788061320428d2cef31b0807aa33b88f48c53682baddce6398bb737b1ba5c503ca696d0cab4a`

## Avoid penalties

Note you will need to continue running your validator until the exit
has been processed by the chain, if you wish to avoid incurring offline
penalties. You can check the status of your validator with tools such
as [beaconcha.in](https://beaconcha.in) and [beaconscan](https://beaconscan.com).
