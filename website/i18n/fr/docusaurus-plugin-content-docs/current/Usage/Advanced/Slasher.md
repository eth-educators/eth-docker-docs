---
title: "Running a slasher"
sidebar_position: 7
sidebar_label: Slasher 
---

## Prysm or Lighthouse Slasher

Running [slasher](https://docs.prylabs.network/docs/prysm-usage/slasher/) is an optional setting in `.env`, and helps
secure the chain. There are [no additional earnings](https://github.com/ethereum/consensus-specs/issues/1631) from
running a slasher: Whistleblower rewards are not implemented, and may not ever be implemented.

> Slasher can be a huge resource hog during times of no chain finality, which can manifest as massive RAM usage. Please
make sure you understand the risks of this, especially if you want high uptime for your Ethereum staking full node.
Slasher places significant stress on the consensus client when the chain has no finality, and might be the reason why
your validators are underperforming if your consensus client is under this much stress.

To run a slasher, add the relevant command(s) to `CL_EXTRAS` in your `.env` file.
