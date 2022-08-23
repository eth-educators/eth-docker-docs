---
id: Moving
title:  Moving a validator.
sidebar_label: Moving
---

When you wish to move a validator, the most important part is that you do not
cause yourself to get slashed. "Slashing" is a large penalty and a forced
exit of the validator.

The first slashings on mainnet occured because someone was running a validator in
two places at once. **Don't be that person.**

Read the [Ethereum PoS primer](https://ethos.dev/beacon-chain/) to understand how
a validator can get slashed. The most common way is to simply run two copies of it
at once.

## When to move

When you absolutely have to. You incur an offline penalty of 3/4 of the reward
you could have made in the same time. This means it is often better to take a day
or several of downtime and work on getting the node back online, than risk
slashing while moving validator keys. 

That said, if you are down during non-finality, or are abandoning a node to start
a new one elsewhere, you may need to know how to move your key(s) safely.

## What you'll need

- [ ] Your signing keys in keystore-m JSON format, and the password for them
>  If you do not have these any more, you can recreate them with the `existing-mnemonic`
>  workflow of deposit-cli, `sudo docker-compose run --rm deposit-cli-existing` in
>  this project, or offline to be very secure.
- [ ] Ideally, an export of the slashing protection DB. If you are using eth-docker, `./ethd keys delete` will export the slashing protection database.
- [ ] A checklist, and diligence

## Checklist

Are you positive you need to move? Can you take a day or a couple of downtime and bring
your old node back up? If so, do that.

Assuming you must move the validator keys to a new client, here are the steps.

### Bring down old client

First, you'll want to bring down the old client and make sure it can't come back up.

In the directory of the old client:

- [ ] `./ethd keys list`
- [ ] `./ethd keys delete 0xPUBKEY` for each one so you get the slashing protection database
- [ ] `./ethd down`
- [ ] `docker volume ls` - find the volume for the validator
- [ ] `docker volume rm VOLUMENAME` - remove the volume for the validator

### Verify

Verify that you removed the right client:

- [ ] `docker-compose run --rm validator` - confirm that it complains it cannot find its keys. If it still
  finds validator keys, do not proceed until you fixed that and it doesn't.
  > For Nimbus and Teku, the command is `docker-compose run --rm consensus` instead
- [ ] Look at https://beaconcha.in/ and verify that the validator(s) you just removed are now
  missing an attestation. Take a note of the epoch the last successful attestion was in.
- [ ] Verify that both machines are synchronized to time and are using NTP.
- [ ] Allow 15 minutes to go by and verify that the last successful attestation's epoch is now
  finalized. Only then take the next step.

### Import keys into new client

- [ ] SCP (or USB sneaker-net) the keys to `.eth/validator_keys` in the project directory
- [ ] Ideally, also copy `slashing_protection*.json` to `.eth/validator_keys`
- [ ] Verify **once more** that all your validator(s) have been down long
  enough to miss an attestion
- [ ] Verify **once more** that trying to start the validator on the old client
  has it complaining it can't find keys, so that there is **no way** it
  could run in two places.
- [ ] If you are absolutely positively sure that the old validator client cannot
  start attesting again and 15 minutes have passed / **all** validators'
  last successful attestation is in a finalized epoch, then and only then:
- [ ] Start the new client with `./ethd start`
- [ ] Run `./ethd keys import` and import the keys


### Variant: DR consensus client

You can keep a client fully synchronized without keys. No keys "ready
to be imported" on the node, and no keys imported. That way, if and
when you do need to move, you do not need to wait for initial sync.
