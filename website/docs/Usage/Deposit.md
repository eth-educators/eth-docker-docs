---
id: Deposit
title:  Deposit to Launchpad
sidebar_label: Deposit to Launchpad
---

# Step 6: Finalize your deposit

**Caution**: You may wish to wait until the beacon node is fully synchronized before you deposit. Check
its logs with `sudo docker-compose logs -f beacon`. This safe-guards against the validator being
marked offline if your validator is activated before the beacon syncs.

Once you are ready, you can send eth to the deposit contract by using
the `.eth2/validator_keys/deposit_data-TIMESTAMP.json` file at the [Prater launchpad](https://prater.launchpad.ethereum.org/)
or [Mainnet launchpad](https://launchpad.ethereum.org). This file was created in Step 3.

> You can transfer files from your node to a machine with a browser using scp. A graphical
> tool such as WinSCP will work, or you can use [command line scp](https://linuxize.com/post/how-to-use-scp-command-to-securely-transfer-files/).