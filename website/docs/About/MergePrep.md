---
id: MergePrep 
title: Ethereum chain merge preparation 
sidebar_label: Merge Preparation
---

Ethereum is moving towards "The Merge", a long-awaited change to Proof-of-Stake (staking) and complete switch-off of Proof-of-Work (mining). This will require some configuration changes. If you got prompted by `./ethd update` to come see this page, that'd be why.

## CL **and** EL both

Both a Consensus Layer and an Execution Layer client are now required.

If you run a Consensus Layer (CL) client such as Lodestar, Nimbus, Teku, Lighthouse, Prysm, then you'll now also need an Execution Layer (EL) client such as Besu, Erigon, Nethermind, Geth.

Conversely, if you run an EL today, you will now also need a CL.

This is because Ethereum will be one chain and the CL is in complete control of the EL, telling it which fork / chain is real: The "Consensus" in "Consensus Layer". While the EL produces blocks and handles transactions, as it has all along. This happens over something called the Engine API, which we'll get to next.

For this reason, Infura projects won't be able to be used as an EL any longer, or for failover. Their "ETH2" project can still be used for checkpoint sync of the CL.

Please get ready for this. eth-docker will prompt you if it thinks your setup is not ready. Once merge has been announced on mainnet, eth-docker will change to hard require this setup and many of its use cases will not run without.

Check the [Overview](/) for hardware requirements of an Ethereum full node. You may need more disk space.

## Fee recipient

With merge, validators receive priority fees and, optionally, MEV. Please see [Rewards](../About/Rewards.md) for details.

## Optional: MEV

MEV will be unlocked via mev-boost. This may not be fully ready in time for merge on all clients. eth-docker will support it, and it can be tested on the merged testnets.

## Engine API connection

Pre-merge, the CL connects to the EL on its RPC or WebSockets query port (8545/8546 by default), optionally with a failover. Once merge has been announced, it uses an authenticated RPC or WebSockets engine port (8551 by default), and failover won't be supported. eth-docker will do its best
to adjust `EL_NODE` in `.env`, but if it's a custom value or only points to Infura, then it won't be able to do that and you'll need to take action. This change is only necessary after merge has been announced on any given chain: In technical terms, when a TTD has been announced.

## TTD override

In the case that a chain requires a TTD override pre-merge, this can be set in `.env`. This would be communicated widely by the Ethereum Foundation. The TTD, Total Terminal Difficulty, tells the CL and EL clients *when* they should switch over to PoS. It is vital that your client do this at the same time as the larger chain, or it'll stop following the canonical chain.
