---
id: MergePrep 
title: Ethereum chain after the merge 
sidebar_label: Merged Chain
---

Ethereum has been merged, which changes the way an Ethereum full node is being run

## CL **and** EL both

Both a Consensus Layer and an Execution Layer client are now required.

If you run a Consensus Layer (CL) client such as Lodestar, Nimbus, Teku, Lighthouse, Prysm, then you'll now also need an Execution Layer (EL) client such as Besu, Erigon, Nethermind, Geth.

Conversely, if you run an EL today, you now also need a CL.

This is because Ethereum is using PoS, Proof-of-Stake, consensus and the CL is in complete control of the EL, telling it which fork / chain is real: The "Consensus" in "Consensus Layer". While the EL produces blocks and handles transactions, as it has all along. This happens over something called the Engine API, which we'll get to next.

Check the [Overview](/) for hardware requirements of an Ethereum full node.

## Fee recipient

Since merge, validators receive priority fees and, optionally, MEV. Please see [Rewards](../About/Rewards.md) for details.

## Optional: MEV

MEV is unlocked via mev-boost.

## Engine API connection

The CL connects to the EL on an authenticated RPC or WebSockets engine port (8551 by default), and failover is not supported.
