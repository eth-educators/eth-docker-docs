---
id: Update
title:  Updating the software.

sidebar_label: Client Updates
---

This project does not monitor client versions. It is up to you to decide that you
are going to update a component. When you are ready to do so, the below instructions
show you how to.

You can find the current version of your client by running `sudo docker-compose logs consensus | head -100 | less`,
assuming the node is up and running.

## Automated update

### If updating from a version prior to 1.2.5 (2021-June-05)

Inside the project directory, run:<br />
`git pull origin main`

and then continue below

### For all versions

Inside the project directory, run:<br />
`sudo ./ethd update`

This will update eth-docker, all Ethereum clients, and migrate your `.env` settings over to a fresh copy
from `default.env`.

Restart the "stack" with `sudo ./ethd restart`

## Optional: Manually update eth-docker

Inside the project directory, run:<br />
`git pull`

Then `cp .env .env.bak` and `cp default.env .env`, and set variables inside `.env`
the way you need them, with `.env.bak` as a guide.

Updating the tool itself is not always necessary. Please refer to the [Changelog](../About/Changelog.md) to see
whether changes have been made that you may want to use.

## Optional: Manually update the client "stack"

If you are using binary build files - the default - you can update everything
in the client "stack" with `sudo docker-compose build --pull`. If you
run shared components in a different directory, such as the execution client,
you'd `cd` into those directories and run the command there.

And restart the entire stack: `sudo docker-compose down && sudo docker-compose up -d eth`

Then verify that the components are coming up okay again by looking at logs:
- `sudo docker-compose logs -f consensus` for the consensus client
- `sudo docker-compose logs -f validator` for the validator, if using Lighthouse or Prysm
- `sudo docker-compose logs -f execution` for the execution client, if you are running one locally

## Optional: Update just the execution client, instead of the entire "stack"

Run:<br />
`sudo docker-compose build --pull execution`

Then stop, remove and start the execution client:<br />
`sudo docker-compose stop execution && sudo docker-compose rm execution`<br />
`sudo docker-compose up -d execution`
