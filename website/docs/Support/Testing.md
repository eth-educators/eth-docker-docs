---
id: Testing
title:  Testing.
sidebar_label: Testing
---

In the absence of a proper test script, a few quick notes on a test sequence that
should show functionality.

Prep that's not client specific:
- `cp default.env .env`, adjust ports as needed
- `docker volume rm $(docker volume ls -q | grep eth-docker)`, wipe volumes from last pass,
   assuming that `eth-docker` is the directory we are testing in.


For each client:
- Start with the most "complete" stack to test full build
- Set `COMPOSE_FILE` in `.env` to full client stack
- `docker ps`, make sure nothing is left running
- Build the client stack:<br />
  `./ethd cmd build --pull`
- `./ethd up`, observe that they come up in order: execution->consensus->validator
- `rm .eth/validator_keys/*`, wipe keys from last pass
- `./ethd cmd run --rm deposit-cli`, create keys
- `./ethd keys import`, import keys
- Check running and logs and see that everything is chill, watch especially for missed connections:
  - `docker ps`
  - `./ethd logs execution`
  - `./ethd logs consensus`
  - `./ethd logs validator`
- `./ethd down`

