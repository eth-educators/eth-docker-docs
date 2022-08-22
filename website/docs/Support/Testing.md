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
  `docker-compose build`
- There likely is a cached version of the client, let's make sure it's the latest.
  `docker-compose build --no-cache consensus`
- Coffee, tea, hall sword fights :)
- `rm .eth/validator_keys/*`, wipe keys from last pass
- `docker-compose run deposit-cli`, create keys
- `./ethd keyimport`, import keys
- `docker-compose up -d`, observe that they come up in order: execution->consensus->validator
- Check running and logs and see that everything is chill, watch especially for missed connections:
  - `docker ps`
  - `docker-compose logs execution`
  - `docker-compose logs consensus`
  - `docker-compose logs validator`
- `docker-compose down`

Specific to systemd:
- Start the service manually
- Check everything is up and happy
- Stop the service manually
- Check everything is down
- Enable the service
- Reboot
- Check that everything came back up as expected
