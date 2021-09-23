---
id: Changelog
title:  Changelog
sidebar_label: Changelog
---

## Updating the project

> `sudo` for ethd and docker-compose commands is only necessary if your user
> is *not* part of the `docker` group

To update the components of the project, run from within the project
directory (`cd ~/eth-docker` by default):

* If updating from a version prior to 1.2.5 (2021-June-05): `git pull`
* `sudo ./ethd update`. This fetches new client version(s), a new eth-docker, and updates `.env`, keeping your modifications. If you
  made changes to the source or binary build targets, run `sudo ./ethd update --keep-targets` instead.
* **Only** if you are using source builds: `sudo docker-compose build --pull --no-cache`
* `sudo ./ethd restart` - use the new client version(s)

## Updating the project branch

If updating eth-docker from a version prior to 1.2.1 (2021-May-31), please run these commands
to rename your local `master` branch to `main`:

```
git pull origin main
sudo ./ethd update
```

## Upgrading from releases prior to 1.0.0 (2021-May-06)

* All v1.x releases change the docker images used to run your node. Please be sure to `./ethd update`
  before (re)starting your node software.
* PLEASE UPDATE BEFORE November 2021.
  The script that adjusts permissions for existing setups will be removed again at that point, and
  any setups that haven't updated by then would have permissions issues when they do update.

## v1.5.2 2021-09-23

*This is an optional update, that contains new features*

* Erigon now uses `prune.r.before` for a PoS-friendly pruned DB. **This is a breaking change for existing Erigon DBs, you'd need to resync**
* `./ethd config` sets Geth and Erigon Grafana
* Erigon available as a choice in `./ethd config`
* New `--dry-run` flag for `auto-prune.sh`
* New `--keep-targets` flag for `./ethd update`

## v1.5.1 2021-08-23

*This is an optional update, that contains new features*

* Enabled Lighthouse doppelganger protection by default

## v1.5.0 2021-08-19

*This is an optional update, that contains new features*

- **Breaking change** The old `ETH1_*` and `BN_*` variables have been removed. Please make sure your `.env` no longer uses them. `./ethd update` will convert `.env` for you.
- Teku validator-only setup now works better with load-balanced consensus clients such as Infura
- Erigon now fully prunes, please see Client Setup documentation as to what that means for consensus client initial sync
- Initial support for ARM64 setups such as Mac M1, Raspberry Pi4, AWS t4g. This has not been extensively tested, feedback very welcome.
- `./auto-prune.sh` script that can be run in crontab and will prune Geth when disk space is below 100 GiB free or below 10% free. Requires the `bc` package.

## v1.4.2.4 2021-07-29

*This is a bugfix update*

* Work around a bug in Prysm that kept key import from working
* Added shared traefik as an advanced option

## v1.4.2.3 2021-07-22

*This is an optional update, that changes behavior*

* `./ethd update` now migrates `.env` first, then builds new client images. This means that people who change build targets
will need to build again after running an update.

## v1.4.2.2 2021-07-22

*This is a bugfix update*

* Fix `CC_HOST` not persisting on `./ethd update`

## v1.4.2.1 2021-07-22

*This is an optional update, that adds new features*

* Support for the new Erigon `--prune` flag
* Support for Erigon binary builds
* **NB** A future release of eth-docker will change the pruning defaults of the Erigon DB, which will require a resync
from scratch of the DB.

## v1.4.2 2021-07-21

*This is an optional update, that adds new features*

* Support the changed beaconcha.in stats API URL

## v1.4.1.2 2021-07-21

*This is a bugfix update*

* Fixed Teku rapid sync when using grafana
* Teku now doesn't show initial error messages when using an Infura execution client
* Created "no timezone" options for teku files, for use with Amazon AMI

## v1.4.1.1 2021-07-21

*This is a bugfix update*

* Fixed Teku validator-only on lowmem machines

## v1.4.1 2021-07-20

*This is an optional update, that contains new features*

* Prysm doppelganger protection enabled by default

## v1.4.0.1 2021-07-13

*This is a bugfix update*

* Fixed fallback execution client for Nimbus

## v1.4.0 2021-07-13

*This is an optional upgrade, that contains new features*

* Added support for Lodestar consensus client
 
## v1.3.3.2 2021-06-16

*This is a bugfix update*

* Fixed ec-traefik.yml
* Fixed Grafana to use the new consensus name, thanks crymo99!
* Teku can now run on machines with 8 GiB of RAM, with max heap 4G and soft max heap 2G.

## v1.3.2 2021-06-10

*This is an optional upgrade, that contains new features*

* Added Grafana metrics for Erigon
* Grafana metrics for standalone Erigon/Geth via `blank-grafana.yml`

## v1.3.0 2021-06-09

*This is an optional upgrade, that contains new features*

* `sudo ./ethd prune-geth` simplifies pruning Geth
* Separating consensus client and validator client is now supported for Teku, Lighthouse and Prysm. Please see the [Secure Web Proxy](../Usage/ReverseProxy.md) instructions.
## v1.2.5.2 2021-06-07

*This is a bugfix upgrade*

* `./ethd config` can correctly configure Teku Rapid Sync again

## v1.2.5.1 2021-06-06

*This is a bugfix upgrade*

* `./ethd` help screen works again
* `sudo ./ethd terminate` command introduced

## v1.2.5 2021-06-05

*This is an optional upgrade, that contains new features*

* Erigon (still in alpha) now syncs a pruned DB
* `./ethd config` now queries the user for desired Graffiti
* `sudo ./ethd update` now does a root-safe `git pull` to update eth-docker itself, and uses a different mechanism to redirect error messages for `docker-compose pull`, so it can update components like `node-exporter` with good UX.

## v1.2.4 2021-06-05

*This is a bugfix upgrade*

* `./ethd update` no longer attempts to `docker-compose pull` or `git pull`. In some instances the expected error messages from `docker-compose pull` were not redirected to `/dev/null`, and updating ancillary components while throwing a bevy of error messages is terrible UX.

## v1.2.3 2021-06-04

*This is an optional upgrade, that contains new features*

* `./ethd update` now migrates `.env` variables

## v1.2.2 2021-06-03

*This is an optional upgrade, that contains new features*

* Initial support for erigon via `erigon.yml`. Source build only.
* Support for sending stats to https://beaconcha.in from Prysm >= 1.3.10 via `prysm-stats.yml`. Source build only.
* Support for sending stats to https://beaconcha.in from Lighthouse >= 1.4.0 via `lh-stats.yml`. Binary and source builds.

## v1.2.1 2021-05-31

*This is an optional upgrade, that contains new features*

* `./ethd config` now supports setting a fallback execution client
* Fixed an issue with `--folder` option when using deposit-cli

## v1.2.0 2021-05-28

*This is an optional upgrade, that contains new features*

* This release contains breaking changes to `.env`. Please recreate it from `default.env`, see above.
* All v1.x releases change the docker images used to run your node. Please be sure to `docker-compose build --pull`
  before (re)starting your node software.

* Renamed all eth1/beacon references to execution/consensus, to fit with the new naming conventions
put forth by the Ethereum developers
* Note this change will cause warning messages, as both `ETH1_` and `EC_` variable names are supported. This
backwards compatibility will be removed after "Altair", expected August 2021

* Removed OpenEthereum from `./ethd config` as a choice. OpenEthereum will remain a supported execution
client until Shanghai, to give users time to migrate.

## v1.1.0 2021-05-12

*This is an optional upgrade, that contains new features*

* This release contains breaking changes to `.env`. Please recreate it from `default.env`, see above.

* Validator-only option for Teku and Lighthouse!
* Teku as the default choice in `default.env`, now that its out-of-the-box RAM use is < 5 GiB

* If you are using any version prior to v1.0.0 released 2021-05-06: PLEASE UPDATE BEFORE October 2021.
  The script that adjusts permissions for existing setups will be removed again at that point, and
  any setups that haven't updated by then would have permissions issues when they do update.

## v1.0.0 2021-05-06

*This is an optional upgrade, that contains bugfixes and new features*

With funding from the Ethereum Foundation, we are at v1.0.0! This update makes significant changes to
the way permissions are handled. While this should improve your experience, please be aware that your `.env` file
should likely be re-created with a fresh copy of `default.env`, and your specific changes copied in. See above for
instructions.

* `LOCAL_UID` is no longer being used in `.env`
* Beacon and Ethereum node containers now run with a "high" user ID, not the user ID of the logged-in user. In
  order to make this seamless, they use a docker-entrypoint script that changes permissions of existing setups
  on the fly
* PLEASE UPDATE BEFORE October 2021. The entrypoint script will be removed again at that point, and
  any setups that haven't updated by then would have permissions issues when they do update.
* Prysm now runs on the Prater testnet without the need to manually pass in the genesis state
* Source builds for Nimbus, Prysm have been fixed; all source builds tested
* `docker-compose build --pull` is now much faster
* deposit-cli has been removed from the `CLIENT-base.yml` files. If you do wish to use it, rather than
  generating keys offline, please add `deposit-cli.yml` to `COMPOSE_FILE`
* deposit-cli services have been renamed to `deposit-cli-new` and `deposit-cli-existing`
* The `validator-voluntary-exit` service has been renamed to just `validator-exit`
* Support for voluntary validator exit when using Teku
* Preliminary beta configuration script, run `./eth2d.sh` for a quick setup

## v0.3.1 2021-04-22

*This is an optional upgrade, that adds new features*

* Added support for new Teku 21.4.1 features: eth1 failover endpoints, and rapid weak subjectivity sync from infura eth2 project

## v0.3.0 2021-04-21

*This is an optional upgrade, that adds new features*

* Added Traefik reverse proxy for secure access to Grafana and Prysm Web, even eth1 clients. Note this is
  a breaking change for existing Grafana, Prysm Web and shared/standalone eth1 clients. You will need to
  add `grafana-insecure.yml`, `prysm-web-insecure.yml`, `eth1-insecure.yml`, depending on service you use,
  to your `COMPOSE_FILE` inside `.env`. Alternatively and recommended, add `traefik-cf.yml` or `traefik-aws.yml`
  and start using secure https:// ! Please see [reverse proxy instructions](../Usage/ReverseProxy.md).
* Added wizard.sh shell script for quick initial setup
* Added node reporter Grafana dashboard to alert on low CPU, Memory or Disk Space

## v0.2.7 2021-03-10

* Supports Prysm 1.3.3
* Changed default for Prysm peers to 45
* `default.env` no longer needs `GETH1_NETWORK` thanks to Geth 1.10.x
 
## v0.2.6.1 2021-02-08

* Nethermind pruning on by default
* Nimbus ENR IP auto-update on by default

## v0.2.6 2021-01-26

* Added alert manager code. Thanks to @DarrenMa!

## v0.2.5.4 2021-01-21

* Support for new Lighthouse Validator Monitor Grafana Dashboard
* Better Grafana port handling for use on cloud VPS with ufw
* OpenEthereum defaults to release tracking with the release of 3.1.1

## v0.2.5.3 2021-01-18

* Changed Nimbus source build to use post-1.0.6 make target and binary names
* Support for simplified Web UI in Prysm 1.1.0. **NB: prysm-web.yml no longer includes prysm-grafana.yml**

## v0.2.5.2 2021-01-14

* Added support for Nimbus voluntary exit
* Updated Teku source build to JDK15
* Changed Teku binary docker to new consensys/teku repository
* Changed default Nimbus source build target to `stable`

## v0.2.5.1 2021-01-09

* Changed sample-systemd to start services after containerd restart, which helps them survive Ubuntu auto-update

## v0.2.5 2021-01-07

* Support for Nethermind 1.10.x-beta source builds

## v0.2.4.2 2020-12-24

* Support for Lighthouse v1.0.5

## v0.2.4.1 2020-12-16

* Support for Pyrsm fallback eth1 nodes

## v0.2.4 2020-12-07

* Support for new metanull dashboard
* Initial support for ynager dashboard, eth price not working yet

## v0.2.3.3 2020-12-06

* More time for OpenEthereum to shut down
* Added documentation on how to restrict access to Grafana when using a VPS

## v0.2.3.2 2020-12-01

* Added max peer values to `default.env`. Make sure to transfer this from `default.env` to your `.env`

## v0.2.3.1 2020-11-30

* Changed Geth shutdown to SIGINT with 2 min timeout so that Geth does not need to resync after
  `sudo docker-compose down`. In testing Geth took ~50s to shut down on my entry level server.

## v0.2.3 2020-11-29

* First attempt at Geth Grafana metrics. Does not work for eth1-standalone currently
* Removed Nethermind manual barrier, as it is now part of Nethermind's default mainnet config

## v0.2.2 2020-11-27

* Lighthouse v1.0.1 validator metrics supported

## v0.2.1 2020-11-24

* Support for Besu eth1 client
* Fixed an issue with Nimbus log file
* Removed CORS settings for eth1, for now
* Tightened hosts values for Geth and Besu

## v0.2.0 2020-11-24

* Support for Lighthouse v1.0.0
* Change default tags for Lighthouse and Prysm to track v1.0.0 release

## v0.1.8.8 2020-11-20

* Initial attempt at Besu integration. While Besu builds, Lighthouse doesn't communicate with it.
  Strictly for testing.

## v0.1.8.7 2020-11-19

* Integrated community dashboard for lighthouse, teku, and nimbus.

## v0.1.8.6 2020-11-16

* Nethermind added as eth1 option, thanks to adrienlac. Not stable in testing.
* First attempt at binary option for all but eth2.0-deposit-cli

## v0.1.8.5 2020-11-11

* Added option to run eth1 node exposed to the host on RPC port

## v0.1.8.4 2020-11-08

* Updated grafana image to change all occurrences of `job="beacon"` to `job=beacon_node` in the metanull dashboard.
* Updated grafana image to rename prysm dashboard titles.

## v0.1.8.3 2020-11-07

* Auto configure Grafana with prometheus datasource.
* Auto Add `Metanull's Prysm Dashboard JSON` to Grafana
* Auto Add `Prysm Dashboard JSON` to Grafana
* Auto Add `Prysm Dashboard JSON for more than 10 validators` to Grafana

## v0.1.8.2 2020-11-06

* Add OpenEthereum eth1 client option

## v0.1.8.1 2020-11-05

* Experimental Prysm slasher - thank you @danb!
* Fixed Prysm Grafana which got broken when pulling out Prysm Web

## v0.1.8 2020-11-04

* eth2.0-deposit-cli 1.0.0 for Ethereum 2.0 main net
* First stab at Lighthouse voluntary exit
* More conservative build targets for Lighthouse, Prysm, Teku, and Geth: Latest release tag instead of `master`

## v0.1.7.5 2020-10-29

* validator-import for Teku now understands Prysm export

## v0.1.7.4 2020-10-29

* Support experimental Prysm Web UI

## v0.1.7.3 2020-10-27

* Prysm change to remove creation of new protection DB, Prysm no longer has this flag

## v0.1.7.2 2020-10-23

* Prysm changes to allow creation of new protection DB and remove experimental web support while it is in flux

## v0.1.7.1 2020-10-16

* Prysm renamed `accounts-v2` to `accounts`, keeping pace with it

## v0.1.7 2020-10-15

* Added "validator-voluntary-exit" to Prysm, see [Addendums](../Support/Addendums.md#addendum-voluntary-client-exit)
* Default restart policy is now "unless-stopped" and can be changed via `.env`
* Preliminary work to support Prysm Web UI, not yet functional
* Changed testnet parameter for Prysm to conform with alpha.29
* Use `--blst` with Prysm by default for faster sync speed
* Handles Terms Of Service for Prysm, user is prompted during validator-import, and choice is remembered
* If you are upgrading this project and you are using Prysm, please run `sudo docker-compose run validator`
  and accept the terms of use. You can then Ctrl-C that process and start up normally again. This step
  is not necessary if you are starting from scratch.

## v0.1.6 2020-10-09

* Support for Lighthouse v0.3.0, drop support for v0.2.x
  * Please note that Lighthouse v0.3.x makes a breaking change to the beacon
    db. You will need to sync again from scratch, after building the new v0.3.0
    beacon image. You can force this with 
    `sudo docker-compose down`, `sudo docker volume rm eth2-docker_lhbeacon-data`
    (adjust to your directory path if you are not in `eth2-docker`, see
    `sudo docker volume ls` for a list).
  * Likewise, the location of the validator keystore has changed. The fastest way
    to resolve this involves importing the keystore from scratch:
    `sudo docker volume rm eth2-docker_lhvalidator-data` (as before, adjust for
    your directory), and then import the keystore(s) again with
    `sudo docker-compose run validator-import`. Your keystore(s) need to be in
    `.eth2/validator_keys` inside the project directory for that.
  * When you have completed the above steps, bring up Lighthouse with
    `sudo docker-compose up -d eth2` and verify that the beacon started syncing
    and the validator found its public key(s) by observing logs:<br />
    `sudo docker-compose logs -f beacon` and `sudo docker-compose logs validator | head -30`,
    and if you wish to see ongoing validator logs, `sudo docker-compose logs -f validator`.
  * The beacon will sync from scratch, which will take about half a day. Your
    validator will be marked offline for that duration.
