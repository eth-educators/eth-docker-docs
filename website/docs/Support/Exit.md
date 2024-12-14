---
id: Exit
title:  Voluntary validator exit
sidebar_label: Voluntary exit
---

# Voluntary validator exit

Ethereum PoS has a concept of "voluntary validator exit", which will remove the
validator from attesting duties. Staked ETH will be withdrawn automatically
to the withdrawal address, as long as one has been set.

**Do not** set your withdrawal address to an exchange wallet. The funds will not
be credited, and you will battle support for them.

Exiting a validator requires a fully synced consensus client. Checkpoint sync,
configured with `RAPID_SYNC_URL` in `.env`, can sync one in minutes.

## Exit using keymanager API

- Get a list of your keys with `./ethd keys list`
- Sign an exit message with `./ethd keys sign-exit <0xpubkey>`

This signed message is valid for the life of your validator; you do not have to use it right away
(you could, for example, keep it for your heirs). 

As and when you want to submit a voluntary exit you can:
- Submit the JSON file to [beaconcha.in](https://beaconcha.in/tools/broadcast)  
OR
- Use `./ethd keys send-exit` to send all created exits through your own consensus layer client

You can track the status of your voluntary exit request at `https://beaconcha.in/validator/<validator-id>`. 
There are three steps:
- Your validator becomes 'Exited' (5-6 epochs (~35 minutes), assuming no [exit queue](https://www.validatorqueue.com/))
- Your validator exit becomes 'Withdrawable' (256 epochs (~27 hours))
- Your 32 Eth is returned to your withdrawal address (currently a maximum of just under a week, see the 'Withdrawals' 
tab at `https://beaconcha.in/validator/<validator-id>` for the next scheduled withdraw for your validator)


## Avoid penalties

Note you will need to continue running your validator until the exit has been processed by the chain, if you wish to
avoid incurring offline penalties. You can check the status of your validator with tools such as
[beaconcha.in](https://beaconcha.in).

## Exit using keystore-m and ethdo

- Place all keys to be exited into `.eth/validator-keys`
- Run `./ethd keys sign-exit from-keystore`, optionally with `--offline` if you have an `offline-preparation.json` for
ethdo

This will sign exit messages with ethdo, which you can then store for your heirs or submit.

This method has the advantage of not requiring the keys to be loaded into a validator client first, and is ideal when
the validators are being run by a 3rd-party service.

This works when Eth Docker is not the primary way to run the node. For example, for a systemd setup, you could
`nano .env`, set `COMPOSE_FILE=ethdo.yml`, and set `CL_NODE=http://HOSTIP:5052`, adjusting `HOSTIP` to the IP address
of your node and `5052` to the port REST is available on. Note that for this to work, the REST port needs to be
reachable by host IP, *not* just by `localhost`. When in doubt, the `--offline` method will always work.

## Legacy exit using client-specific tools

### Teku

Teku will exit all validators that have been imported to it. Run
`./ethd cmd run --rm validator-exit` and follow the prompts.

### Prysm

To exit, run `./ethd cmd run --rm validator-exit` and follow the
prompts.

### Lighthouse

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

### Nimbus

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

### Lodestar

To exit a specific validator, run `./ethd cmd run --rm validator-exit --pubkeys <0xPUBKEY>`.  
Multiple validators can be exited by providing a comma-separated list of public keys to `pubkeys`.  
If no `pubkeys` are provided, it will exit all validators that have been imported.
