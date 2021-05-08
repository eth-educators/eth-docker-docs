---
id: BeforeYouStart
title:  Before you start.
sidebar_label: Before you start
---

Warnings about the dangers of running eth2 nodes are in [Recommendations.md](../Support/Recommendations.md).
In particular, you must be sure to secure your seed phrase, the mnemonic. Without it, your
staked funds *cannot* be withdrawn.

You may also want to take a look at a [guide to Linux host security](https://www.coincashew.com/coins/overview-eth/guide-or-security-best-practices-for-a-eth2-validator-beaconchain-node#setup-two-factor-authentication-for-ssh-optional).

## eth2-docker QuickStart Shell

It is recommended to follow the manual steps to fully customize your eth2-docker instance, but to get a quick standard build feel free to use the included `eth2d.sh`.  Simply choose the ETH1 Client, ETH2 Client, if you want to use Grafana, and which network you'll be running on.

## eth2-docker Manual Install

1. Install prerequisites
2. Choose a client and do initial security setup.
3. Generate deposit files and an eth2 wallet. This can be done within this project, or outside of it
4. Import the validator keystore files generated in the previous step
5. Run the client
6. Finalize the deposit. This is not done within this project
7. A baseline set of Grafana dashboards are included.  Feel free to add more, or submit a PR with your favorite dashboards.
8. Configure your system to start the eth2 node on boot (optional)

