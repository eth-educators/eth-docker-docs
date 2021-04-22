---
id: Update
title:  Updating the software.

sidebar_label: Client Updates
---

This project does not monitor client versions. It is up to you to decide that you
are going to update a component. When you are ready to do so, the below instructions
show you how to.

You can find the current version of your client by running `sudo docker-compose logs beacon | head -100 | less`,
assuming the node is up and running.


## The eth2-docker tool itself

Inside the project directory, run:<br />
`git pull`

Then `cp .env .env.bak` and `cp default.env .env`, and set variables inside `.env`
the way you need them, with `.env.bak` as a guide.

Updating the tool itself is not always necessary. Please refer to the [Changelog](../About/Changelog.md) to see
whether changes have been made that you may want to use.

## The client "stack"

If you are using binary build files - the default - you can update everything
in the client "stack" with `sudo docker-compose build --pull`. If you
run shared components in a different directory, such as eth1,
you'd `cd` into those directories and run the command there.

And restart the entire stack: `sudo docker-compose down && sudo docker-compose up -d eth2`

Then verify that the components are coming up okay again by looking at logs:
- `sudo docker-compose logs -f beacon` for the beacon
- `sudo docker-compose logs -f validator` for the validator, if using Lighthouse or Prysm
- `sudo docker-compose logs -f eth1` for the eth1 node, if you are running one locally

## Optional: Just Eth1, instead of the entire "stack"

Run:<br />
`sudo docker-compose build --no-cache --pull eth1`

Then stop, remove and start eth1:<br />
`sudo docker-compose stop eth1 && sudo docker-compose rm eth1`<br />
`sudo docker-compose up -d eth1`
