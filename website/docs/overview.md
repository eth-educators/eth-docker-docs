---
id: overview
title:  High Level Overview
sidebar_label: overview
---

An Ethereum 2.0 node has many moving parts. Here's a high level, conceptual overview.

![Ethereum 2.0 Node](../static/img/Ethereum-2.0.png)

When setting up an Ethereum 2.0 node, you'll:

- Configure and run an Ethereum 1 node and sync it with the Görli testnet or main net
- Alternatively, choose an external provider of Ethereum 1 chain data
- Configure and run an Ethereum 2.0 beacon node and sync it with an Ethereum 2.0 testnet or main net
- Generate validator keys, one per 32 Eth you wish to stake. This can and often is done outside of the
  machine used to run the node, for security reasons.
- Import validator keys into the validator client, each validator key activates one validator
- Once the Ethereum 1 and Ethereum 2.0 nodes are fully synced with the chain, deposit Ethereum
  at the launchpad, 32 eth per validator key. That Ethereum is now locked up until the "merge" 
  of Ethereum 2.0 with Ethereum 1.

Here's what then happens:

- The chain processes the deposit and activates the validators: Your validators start earning rewards
  and penalties.
- The beacon node is where it all happens: Block generation, attestations, slashings, with the help
  of the validator(s) inside the validator client, for signing.
- A validator earns a reward for every epoch (6.4 minutes) it is online, and a penalty of 3/4 that
  amount for every epoch it is offline. "Online" means that it sent its scheduled attestation / block
  proposal. This means you want to be online almost 24/7, but do not have to be afraid of a few hours
  of downtime, with the exception of periods of non-finality.
- Greater 2/3 of validators need to be online for the chain to "finalize". If the chain stops finalizing,
  far harsher penalties for offline validators kick in. Stay online during non-finality. The initial
  penalties on main net for this "inactivity" during non-finality have been reduced to 1/4th of their eventual
  values.
- "Slashing" is a harsh penalty and forced exit for malicious validators; regular penalties could be
  described as "Leaking" instead. The most likely mistake that gets you slashed is to run a validator key
  in two separate validator clients simultaneously. The initial slashing penalty on main net has been reduced
  to 1/4th of its eventual value.
- If all of the above was so much Gobbledegook, you need to read the [Ethereum 2.0 primer](https://ethos.dev/beacon-chain/) and come
  back to it every time you have questions. 