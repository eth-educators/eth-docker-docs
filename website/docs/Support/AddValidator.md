---
id: AddValidator
title:  Add or recover validators
sidebar_label: Add Validators
---

# Add or recover validators

You can use eth2.0-deposit-cli to either recover validator signing keys or add
additional ones, if you wish to deposit more validators against the same mnemonic.

> The same cautions apply as when creating keys in the first place. You
> may wish to take these steps on a machine that is disconnected from Internet
> and will be wiped immediately after creating the keys.

In order to recover all your validator signing keys, run `sudo docker-compose run --rm deposit-cli-add-recover`
and provide your mnemonic, then set index to "0" and the number of validators to the number you had created previously
and are now recreating.

In order to add additional validator signing keys, likewise run `sudo docker-compose run --rm deposit-cli-add-recover`
and provide your mnemonic, but this time set the index to the number of validator keys you had created previously,
for example, `4`. New validators will be created after this point. You will receive new `keystore-m` signing keys
and a new `deposit_data` JSON.

> Please triple-check your work here. You want to be sure the new validator keys are created after
> the existing ones. Launchpad will likely safeguard you against depositing twice, but don't rely
> on it. Verify that the public keys in `deposit_data` are new and you did not deposit for them
> previously.