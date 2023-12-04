---
id: Changelog
title:  Changelog
sidebar_label: Changelog
---

## Updating the project

To update the components of Eth Docker, run from within its directory (`cd ~/eth-docker` by default):

* `./ethd update`. This fetches new client version(s), a new Eth Docker, and updates `.env`, keeping your
modifications. If you want to reset the source or binary build targets in `.env`, run `./ethd update --refresh-targets`
instead.
* `./ethd up` - use the new client version(s)

> On 1/27/2022, Eth Docker's repository name changed. Everything should work as it did.
> If you do wish to manually update your local reference, run `git remote set-url origin https://github.com/eth-educators/eth-docker.git`

## v2.3.12.0 2023-12-04

*This is an optional release with new features and bug fixes*

- Fix Nimbus Web3signer wait loop
- Add `./ethd space`
- Add Eden relays to Holesky during `./ethd config`
- `mev-boost` can be source-built
- `./ethd update` can be `--non-interactive`
- Support `DEBIAN_FRONTEND=noninteractive` as an alternative to `--non-interactive`

## v2.3.11.0 2023-12-01

*This is an optional release with new features and bug fixes*

- New Nimbus and Teku deployments use a dedicated validator client service. Legacy deployments use the
`nimbus-legacy.yml` and `teku-legacy.yml` files
- Introduced a wait loop to Nimbus when using Web3signer, to work around a bug in Nimbus
- Better handling of legacy `master` branch of Eth Docker

## v2.3.10.0 2023-11-25

*This is an optional release with new features and bug fixes*

- Prometheus metrics collection improved. Scrape targets in `./prometheus/conf.d`, uses `yq` to merge
`custom-prom.yml`. Default scrape interval 15s instead of 1m now possible because of this, which solves a whole bevvy
of "No Data" in preloaded dashboards. Thanks to @aliask!
- Preserve empty `RAPID_SYNC_URL` in `.env`
- Extraneous web3signer messages during keyimport, when web3signer was not in use, resolved
- `./ethd up <service-name>` supported
- Version numbering will be semver-ish from here: World-shaking changes (think Ethereum merge) first digit, breaking
changes second digit, enhancements third digit, bug fixes fourth digit.

## v2.3.9 2023-11-15

*This is an optional release with new features and bug fixes*

- Eth Docker's version can be pinned in `.env`
- Use new Teku v23.11.0 syntax. *Breaking* for any prior version.
- Fix the `./ethd prune-geth` command
- Additional IPv6 support for Lodestar, Geth and Erigon
- Use .NET 8 for Nethermind source build
- `default.env` defaults to Holesky testnet

## v2.3.8 2023-11-08

*This is an optional release with new features and bug fixes*

- Fixed a **breaking** bug in `cl-traefik.yml` that impacted 2.3.7
- Fix `./ethd keys delete all` when using Web3signer
- `./ethd config` can now configure SSV for Holesky
- Switched Prometheus to scrape by Docker labels
- Added Web3signer dashboard
- Fixed Nimbus dashboard provisioning
- Running multiple RPC nodes connected to one central traefik is now easier. If that is your use case, set
`EL_NODE=http://${NETWORK}-execution:8551` in `.env`. See the `ELCLIENT.yml` files for the alias this references.

## v2.3.7 2023-11-02

*This is an optional release with security relevant changes for traefik users*

- **BREAKING** change for users who use traefik to access the execution client RPC API, consensus client REST
API or execution client engine RPC API: The `el-traefik.yml`, `cl-traefik.yml` and `el-traefik.yml` files are
now required for this. This was done to avoid host header attacks against users who just want to expose Grafana
and may not have firewall rules in place to trusted source IPs.

## v2.3.6 2023-11-02

*This is an optional release with new features and bug fixes*

- `./ethd keys send-exit` works with RocketPool reverse hybrid
- Raise Loki ingestion limit. Thanks invis!
- Prysm uses prysmctl for legacy exit method
- Erigon source build uses Go 1.21
- `./ethd config` offers Reth alpha
- Send anonymized traefik usage
- Fixes to `prysm-vc-only.yml`. Thanks @nflaig!
- Scraping metrics centrally is now supported
- RocketPool integration no longer adds `mev-boost.yml`
- Error handler that restores `.env` if `./ethd update` fails. Thanks invis!
- `./ethd config` is a little more visually consistent
- On Ubuntu, use the `docker-compose-v2` package for Docker Compose upgrades
- Lighthouse Siren fixed. Thanks @davidkassa!
- Changed default checkpoint URL for Gnosis Chain
- Added traefik labels to all `CL-CLIENT.yml` files

## v2.3.5 2023-10-11

*This is an optional release with new features and bug fixes*

- Support for encrypted node key with an SSV node
- Remove hard coded ancient barriers for Nethermind, use Nethermind defaults
- Add tab completion for Linux systems. Thanks @jshufro!
- Add support for Lighthouse Siren
- Change Prometheus retention to 40d
- Configurable Lodestar heap
- Changed Teku and web3signer integration
- Add QUIC port to Lighthouse
- Support Nethermind v1.21

## v2.3.4 2023-09-11

*This is an optional release with new features and bug fixes*

- `./ethd config` offers Holesky testnet
- Geth fresh sync now uses PBSS
- SSV supports MEV
- SSV migrates to new jato-v2 testnet
- Reth supports full node pruning
- The `auto-prune.sh` script has been deprecated and will be removed with Dencun
- New `./ethd keys sign-exit` command for use with clients' keymanager API
- `./ethd config` prompts for MEV when using a RocketPool reverse hybrid setup. Thanks @haurog!
- `./ethd keys import` knows about eth2-val-tools style `keys` and `secrets` folders. Thanks to Patches for prodding me!
- Geth uses its down defaults for HTTP and WS API for easier override via `EL_EXTRAS`. Thanks @jiangbo0216!
- Nimbus registers web3signer keys on startup
- All-new support for custom testnets. Set `NETWORK` to a github repo containing the network repo such as `https://github.com/ethpandaops/dencun-testnet/tree/master/network-configs/devnet-8`. Thanks to Barnabas and client teams for the feature request!
- Binary and source repos can now be specified in `.env`, to allow use of custom client repos for custom testnets.
- Upgrading compose V1 to compose V2 no longer marks docker.io for deletion
- New Nethermind executable name on source build. Thanks @rubo!

## v2.3.3 2023-08-15

*This is an optional release with new features and bug fixes*

- Fixed an `./ethd terminate` edge case that would attempt to delete volumes in other stacks / directories
- Improved web3signer support; work around a Teku bug
- Support signing exit messages with keymanager API
- Teku default heap reduced to 4g
- Lodestar source build with node 20
- Lodestar doppelganger flag adjusted. Thanks @nflaig!
- cadvisor works on ARM64
- Default to jato-v2 for new SSV setups
- Geth source build with Go 1.21

## v2.3.2 2023-08-03

*This is an optional release with new features and bug fixes*

- Update SSV and Nethermind dashboards
- Update Prysm dashboards
- Fix Teku VC connecting to Lighthouse CL
- Fix Nimbus VC using MEV Boost
- Remove dasel dependency from Nethermind
- `./ethd config` on Gnosis Chain now offers Lodestar
- Teku default heap changed to `-Xmx6g`
- Fix a docker presence check on macOS
- promtail can write to a remote Loki
- Loki uses TSDB
- Fix `./ethd install` failing when docker is not yet installed
- Improvements to Geth and Lighthouse archive node options
- Reth binary images supported
- compose V1 EOS message
- Lodestar forces validator files open in case of lingering lock files
- `./ethd` can stop and restart individual services
- Configurable traefik and ddns tags
- Lighthouse source build uses maxperf. Thanks @jimmygchen!
- Default NM source build target does not build rc targets. Thanks @nu404040!
- ethdo script fixed when user used a 25th word. Thanks @valefar-on-discord!
- Source builds updated to use Debian bookworm
 
## v2.3.1 2023-05-17

*This is an optional release with bug fixes*

- Add web3signer support
- Update SSV and Nethermind dashboards
- IPv6 behind an `.env` var
- Add logs dashboard. Thanks @gorillamania!
- Nethermind works on ARM64. Thanks @natpicone!
- New `prometheus-shared.yml`. Thanks @allen-pattern!
- Fix `./ethd keys` when using RocketPool (reverse) hybrid

## v2.3.0.1 2023-05-05

*This is an optional release with bug fixes*

- Support Nethermind 1.18 prune parameters; switch back to Hybrid prune
- Graffiti string with `&` character survives `./ethd update`.
- `./ethd update` checks for source-built clients and starts a fresh build
- Use `--nat` for Lodestar and Reth
- `deposit-cli.yml` no longer causes error messages during `./ethd update`.
- Nethermind dasel dependency to `2.2.0`
- Fix Lodestar and Nimbus entrypoint script on fresh sync

## v2.3 2023-05-01

*This is a recommended release*

- Address findings from Sigma Prime security audit. Users of `ee-shared.yml` or `ee-traefik.yml` should pay particular attention.
- Nethermind prune reduced to 2 threads, to have more headroom during sync committees.

## v2.2.10.1 2023-04-29

*This is an optional release*

- validator exit for Lighthouse and Nimbus works if there are subdirectories in `.eth/validator_keys`. Thanks @gorillamania!
- Add dashboard for Reth.
- traefik revamped, new v6-aware DDNS provider for `traefik-cf.yml`.
- Lighthouse enables v6 by default.

## v2.2.10 2023-04-23

*This is a mandatory release for users of Erigon, and optional for all others*

- Support Erigon v2.43.0.
- Initial work on IPv6 support.
- Fix infinite loop in `create-withdrawal-change.sh`.
- `traefik-cf.yml` can use more granular token permissions.
 
## v2.2.9.5 2023-04-16

*This is an optional release*

- Use `docker compose` if it and `docker-compose` are installed.
- Nethermind memory hint higher for 64 GiB RAM.
- `create-withdrawal-change.sh` handles 12-word mnemonics.
- Nimbus validator exit changed to fit new Nimbus behavior.
- New command `./ethd keys sign-exit from-keystore [--offline]` to create pre-signed exit messages.

## v2.2.9.4 2023-04-13

*This is an optional release with bug fixes*

- `./ethd resync-consensus` fixed for Prysm and Lodestar. Thanks @FloatingUpstream!
- `./ethd resync-consensus` can now wipe Teku and Nimbus DB safely, without touching keys.
- Prysm uses the gcr.io docker image registry. Thanks @FloatingUpstream!

## v2.2.9.3 2023-04-12

*This is an optional release*

- Nethermind uses Full pruning mode instead of Hybrid.
- Nethermind uses a lower memory hint to resolve OOM during prune.
- Nethermind archive mode fixed.
- Support for stake fish, staked.us and allnodes withdrawal change. Thanks @valefar!

## v2.2.9.2 2023-04-09

*This is an optional release with bug fixes*

- Teku CL uses liveness tracking so doppelganger detection actually works.
- ethdo now works with reverse hybrid setups, and similar setups where the CL is remote.
- Undo a too-aggressive shell lint change, so saying "no" to Grafana works again.
- Adjust Nethermind prune threshold to account for it using MB not MiB.
- Adjust Nethermind memory hint in the hopes it won't OOM during prune.
- Withdrawal credential change readme clarification around the mnemonic that is needed.

## v2.2.9.1 2023-04-03

*This is an optional release with bug fixes*

- Support Teku doppelganger detection.
- `./ethd keys send-address-change` counts unique addresses. Thanks to @valefar for fixing the logic!
- Shell lint pass, which fixes a bug in `./ethd prune-nethermind` and `./ethd install`.

## v2.2.9 2023-04-01

*This is an optional release*

- Add automatic pruning to Nethermind, controlled by `AUTOPRUNE_NM` in `.env`.

## v2.2.8.7 2023-03-31

*This is an optional release*

- Remove soft max heap from Teku and Besu default JVM heap settings.
- Resolve failure when upgrading from eth-docker 2.2.8.3 or earlier.
- Dasel dependency upgraded to 2.1.2.
- `reth.yml` sets the P2P port.
- Remove check for apparmor.
- `./ethd install` now requires Ubuntu 20.04 or later or Debian 10 or later.
- `./ethd` warns the user if they are using Compose V1.

## v2.2.8.6 2023-03-26

*This is a bugfix release*

- Fix a bug introduced in 2.2.8.5 that would break Graffiti with spaces. Thanks @nflaig!
- New command `./ethd keys delete all`

## v2.2.8.5 2023-03-25

*This is an optional release*

- Support client default graffiti - use this for Lodestar incentive
- Add Lodestar beaconcha.in monitoring. Thanks @nflaig!
- Keymanager works on ARM64
- Rely on default ethdo timeout
- Require 250 GiB free for Nethermind prune
- Only overwrite `.env.bak` when there are changes
- Warn user if `git pull` fails during `./ethd update`

## v2.2.8.4 2023-03-21

*This is a bugfix release*

- Fix a bug during disk space check in `./ethd` introduced by 2.2.8.3

## v2.2.8.3 2023-03-20

*This is an optional release*

- `./ethd resync-execution` and `./ethd resync-consensus` commands added
- origins for Geth ws set to `*` - thanks @0xDualCube
- Query for mnemonic passphrase when generating change message
- Link to beaconcha.in broadcast tool

## v2.2.8.2 2023-03-18

*This is an optional release*

- `./ethd` will check for free disk space and warn the user if it's running low
- Fix and pin ethereum-metrics-exporter
- Default Graffiti uses 🦉
- Erigon supports larger return values for RocketPool >= 1.9
- Erigon and Prysm source builds use Go 1.20
- Lighthouse source build uses jemalloc and defaults to `stable` target
- Prysm supports larger messages so credential change messages can be sent
- Initial web3signer addition - not integrated with any clients
- Don't query for mev-boost on Gnosis Chain
- Add auth port for Reth

## v2.2.8.1 2023-02-19

*This is an optional release*

- Online/offline withdrawal change workflow now actually works 😅
- Geth will use PebbleDB on a fresh sync
- Zhejiang testnet supported with Lodestar and Nethermind
- Change default docker tag for Besu to `latest`
- Remove legacy keyimport in preparation for security audit

## v2.2.8 2023-02-08

*This is an optional release*

- Fixed `ethereum-metrics-exporter`. Thanks to @nflaig!
- Added the ability to use client-default graffiti. Thanks to @nflaig!
- `./ethd install` places the user into the `docker` group on Debian
- Support online/offline withdrawal address change with ethdo. See `./ethd keys`

## v2.2.7.1 2023-02-05

*This is an optional release*

- Nimbus engine connection defaults to `http://` instead of `ws://` on a fresh install
- Teku uses the `MINIMAL` mode when running pruned
- Nethermind workaround for Prysm, `--JsonRpc.MaxBatchSize 10000`
- New command `./ethd cmd run deposit-cli-change` to prep for withdrawal credential changes, if deposit-cli.yml is included *and* deposit-cli supports this
- Flashbots URL change
- Check for apparmor on Ubuntu and Debian because of an issue with docker-ce 23.0.0
- Pre-provision homestaking dashboard id 17846. Thanks to @gwenvador!

## v2.2.7 2023-01-20

*This is an optional release*

- New advanced option `ARCHIVE_NODE` in `./env`. Caution that this can use upwards of 12TB of disk space.
- Nethermind source build uses .NET 7.0
- Lodestar prometheus scrape fixed. Thanks @nflaig!
- Nethermind pruning requires 200 GiB free, down from 250 GiB
- Extremely experimental support for Reth - it does not yet sync
- `./ethd config` offers Erigon when running on Gnosis Chain
- Update Nethermind's dasel dependency to v2.1.0
- All source builds can now build from a tag, a branch, or a PR
- `./ethd update` will also run `docker system prune --force` to remove dangling images and build caches

## v2.2.6.3 2023-01-06

*This is an optional release*

- Update Ethereum metrics exporter dashboard to latest version
- Add ultrasound relays to default list - thanks @JustinDrake! 🦇🔊
- A few fixes for `./ethd` on macOS
- `./ethd config` builds only once 😅
- `./ethd update` now defaults to keeping changed build targets, and can reset them to defaults with `--refresh-targets`
- New `./ethd keys create-prysm-wallet` for better UX when using Prysm
- Remove return code workaround for Lodestar from key management script

## v2.2.6.2 2022-12-31

*This is an optional release*

- Increase stop timeout for all EL to 5 minutes "just in case"
- Explicit permissions for all scripts in Dockerfile - thanks to @mLewisLogic for finding a corner case!
- Run Grafana as a non-root user
- Explicit NAT method added to Besu - thanks to @dabauxi!
- Update Nethermind's dasel dependency to v2.0.2

## v2.2.6.1 2022-12-23

*This is an optional release*

- Add `--rpc-max-logs-range=65536` to `besu.yml` to support SSV and RocketPool out of the box
- Fix handling of non-standard Docker data-root. Thanks to @mLewisLogic!
- Added `grafana-rootless.yml` for use with rootless docker.

## v2.2.6 2022-12-22

*This is a required release for users of Nimbus, and optional for all others*

- Support Nimbus v22.12.0. This is a breaking change, no prior releases of Nimbus are supported.
- `./auto-prune.sh` now supports Nethermind. There is a risk that this breaks if Nethermind takes >24 hours to prune and the crontab is run every 24 hours. Feedback welcome.
- `./auto-prune.sh` now supports `--threshold` and `--help`
- Pruning logic now recognizes a non-standard docker `data-root` directory
- Host map additional P2P ports for Erigon: It uses a separate port for each eth/xx P2P protocol.
- Remove Nethermind metrics push timeout, as it no longer has a default pushgateway
- Fix an issue that had `./ethd update` build everything twice

## v2.2.5.1 2022-12-15

*This is a required release for users of Teku, and optional for all others*

- Fix Teku keymanager API cert. Thanks to @alepacheco for raising the issue!

## v2.2.5 2022-12-08

*This is a required release for users of Erigon and Nethermind, and optional for all others*

- Experimental support for Nimbus EL client, `nimbus-el.yml`
- Remove `--metrics.expensive` from Erigon for 2.31.0 support
- Be more deliberate about versions of dasel, alpine and traefik

## v2.2.4.2 2022-12-02

*This is an optional release containing new features and bug fixes*

- Nethermind source build fixed. Thanks @nu404040!
- Reverted use of Bonsai snapshots. Note this can cause initial snap sync to fail, but should resolve failure after initial sync. Thanks @realsnick!
- Replace `which` with `command -v` in `ethd` to get ready for Debian Bookworm
- Add Nimbus as an option for Gnosis Chain during `./ethd config`
- Image pull during `./ethd update` is more consistent

## v2.2.4.1 2022-11-25

*This is a required release for users of Nethermind on Gnosis, and optional for all others*

- Let Nethermind determine sync mode based on chain
- Better Nethermind prune. Thanks to Joe at RocketPool for the suggestion!
- Some more cleanup around the removed Prometheus alert manager
- Remove Akula 😭
- Fix an error introduced by shell linting that caused `./ethd terminate` to fail - thanks to @RomanS-re!

## v2.2.4 2022-11-22

*This is a required release for users of Nethermind, and optional for all others*

- Support Nethermind's new engine port parameters
- `./ethd attach-geth` command, thanks to @ldub!
- Removed Prometheus alert manager - it had been broken since before merge, may as well remove it 😅. Use Grafana's built-in alert manager instead, please
- Sample config file for Grafana Cloud in `prometheus/custom-prom.yml.sample`
- Require 250GiB free disk space before starting Nethermind prune

## v2.2.3.1 2022-11-16

*This is a required release for users of Akula, and optional for all others*

- Fixed Akula source build
- Lint pass on all shell scripts
- Added deprecation warning to `./ethd keyimport`
- Prometheus now uses default scrape time, so that `custom-prom.yml` will work with `grafana-cloud.yml`

## v2.2.3 2022-11-13

*This is an optional release containing new features*

- Work around Lodestar's non-standard return codes on recipient/gas keymanager API
- Keymanager API key import now waits up to 60s for slashing protection DB to be imported
- Support Nethermind health checks
- Use beaconcha.in's stat collector for Prysm and Nimbus

## v2.2.2 2022-11-11

*This is a required release for users of Erigon, and optional for all others*

- Support Erigon 2.30.0's new `--externalcl` parameter. This is a breaking change, no prior versions of Erigon are supported.
- Fix test for `custom-prom.yml` used in `grafana-cloud.yml`
- Support MEV boost `-minbid`
- Check for 125 GiB free disk space before Nethermind prune
- Dynamic wait time when re-starting Nethermind for prune

## v2.2.1 2022-11-05

*This is a required release for users of Erigon, and optional for all others*

- Support Erigon 2.29.0's new log level parameter
- More debug info for sporadically failing Nethermind prune

## v2.2.0 2022-11-02

*This is a recommended release with new features and bug fixes*

- Nethermind background pruning via `./ethd prune-nethermind`
- Bonsai snapshots supported with Besu
- New `grafana-cloud.yml` that uses `prometheus/custom-prom.yml`. Undocumented for now
- Do not default to `--subscribe-all-subnets` for `cl-only.yml` files. Please add this via `CL_EXTRAS` if you need it
- Geth always runs an `apk update` first when building the local image
- Fix provisioning of the prysm_less_10 dashboard. Thanks @FloatingUpstream!
- Support Teku's validator exit command for API managed keys
- Better UX for initial Blox SSV setup
- Add 30d retention period to Loki
- Moved `CL_EXTRAS`, `EL_EXTRAS` and `VC-EXTRAS` into entrypoint script
- `slasher.yml` files removed. If you used these, please use `CL_EXTRAS` instead
- Enable pprof on Erigon and optimize for ZFS storage
- cadvisor does housekeeping every 30s
- Manifold removed from default relay list
- Nimbus VC offered during `./ethd config`

## v2.1.3 2022-10-06

*This is an optional release with new features*

- Erigon uses `stable` docker tag
- Erigon uses `--batchSize 64m` in an attempt to squeeze it into 16 GiB 🐭
- Besu defaults to `latest-openjdk-latest` and uses soft heap 3g
- Add Nimbus vc-only yml
- Erigon and Nimbus source builds default to latest release
- Remove all `OVERRIDE_TTD` mentions

## v2.1.2 2022-10-04

*This is an optional release with bug fixes*

- Prometheus now survives restarts 😅
- Quiet Nethermind push failures
- Fix `ext-network.yml` version

## v2.1.1 2022-10-02

*This is an optional release with new features and bug fixes*

- Added `BESU_HEAP` and `TEKU_HEAP` variables to override the default Java heap settings for each
- Fixed a bug in the new Prometheus yml handling for Nimbus and Teku
- Default Besu to 5g heap, up from 4g
- Source builds use Go 1.19
- Add new dependency for Lighthouse source build

## v2.1.0 2022-09-29

*This is an optional release with new features*

- `./ethd install` now installs docker-ce
- `./ethd config` offers existing values
- EL clients no longer start as root - chown no longer needed post-merge
- `./ethd update` warns the user if there are uncommitted local changes

## v2.0.4 2022-09-28

*This is an optional release with new features*

- Added a default dashboard for Nethermind
- Reworked yml processing for Prometheus targets
- Added cadvisor for Prometheus, and a dashboard for it
- Added ethereum-metrics-exporter for Prometheus, and a dashboard for it
- Added the ability to specify optional parameters for CL/EL/VC in `.env`

## v2.0.3 2022-09-25

*This is an optional release with new features*

- Added Lodestar metrics, and a dashboard for it
- Added `./ethd version` command. Thanks to @PabloCastellano!
- Teku rapid sync works with checkpointz
- Renamed all `client-base.yml` files to `client.yml` 
- Lodestar supports validator exit again

## v2.0.2 2022-09-16

*This is a recommended release for post-merge changes*

- Use current mev flag naming for Lighthouse VC
- Improved key import
- Fix Teku beacon stats API
- Teku can recover from unclean shutdown
- Add relay check to mev boost
- Lodestar mev boost and rapid sync fixed
- More resilient checkpoint sync for Nimbus and Lodestar
- Use sudo automatically as and if needed
- traefik metrics - thanks to @casualjim
- Teku counts deposits more slowly to interop better with Besu
- Teku -Xmx5g instead of -Xmx4g, to follow the team's recommendations
- Teku voluntary exit works with API-imported keys
- validator-backup command for Prysm
- Erigon metrics fixed, thanks @casualjim
- `MEV_NODE` and `MEV_DOCKER_TAG` survive updates
- Config wizard no longer asks for override TTD

## v2.0.1 2022-08-24

*This is a recommended release for the Ethereum Merge*

- Support Lodestar v1.0.0
- Besu defaults to snap sync, after some issues with checkpoint sync
- Use new engine API syntax for Prsym
- Use fee recipient with Teku CL only
- Use current SSV v2 repo
- Fix Grafana for SSV v2
- Fix default dashboard for Nimbus


## v2.0.0 2022-08-22

*This is a mandatory release for the Ethereum Merge*

- **Breaking Change** docker-compose v1.28.0 or later is required. `./ethd update` will prompt for it
- **Breaking Change** Erigon needs to be resynced from scratch and will run on its `alpha` branch. `./ethd update` will prompt for it
- **Breaking Change** Infura "web3" fallback for the Execution Layer connection is no longer supported
- Many changes to `.env`. `./ethd update` will make these automatically
- merge-ready config with Engine API and JWT secret between Consensus Layer and Execution Layer
- Doppelganger Protection supported
- mev-boost supported
- New `./ethd install` command that attempts to install prerequisites on Ubuntu
- Support Sepolia and Ropsten testnets, in addition to Goerli
- Ability to import slashing protection DB
- Better checks for prerequisites existing in `./ethd`. Thanks to joeytwiddle
- Automatic `sudo` in `./ethd` if required. Thanks to joeytwiddle
- Keymanager support for Lodestar
- Besu defaults to checkpoint sync
- Teku VC supports failover CLs

## v1.8.8 2022-07-13

*This is an optional release, that contains new features and bug fixes*

- `./ethd` now works with docker-ce and compose plugin, including on Debian 11
- Support spaces in Graffiti
- Fix a regression in `./ethd prune-geth`

## v1.8.7 2022-06-25

*This is an optional release, that contains new features and bug fixes*

- `./ethd update` now always runs the latest version of itself
- `./ethd update` aborts when a user chooses "Cancel" on the fee recipient screen
- `FEE_RECIPIENT` variable in `.env` instead of `REWARDS_TO`
- Improve Lighthouse memory allocation defaults
- Gracefully handle `sudo ./ethd update`
- Automatic switch to the `rpc-nodes` branch is clearer
- Keep Teku key management API TLS cert from being deleted all the time

## v1.8.6 2022-06-14

*This is an optional release, that contains new features and bug fixes*

- `./ethd prune-geth` now correctly asks for confirmation
- `./ethd update` will nag users about running both a CL and EL. Nag screen can be overridden via `.env` setting

## v1.8.5 2022-06-11

*This is an optional release, that contains new features and bug fixes*

- Keep Lodestar build targets
- Suppress Nethermind JSON RPC logs
- Fix genesis download for Prysm on Prater
- Change SSV node default ports
- Hardcode `./.eth` as the directory for key files
- Fix help URL displayed during `./ethd config`
- Fix Lighthouse validator startup
- Rename Prater to Görli
- Stop tracking changes to `ext-network.yml`
- Improve peer count adjustment, a MIN can now be set
- Change default Teku peers to 100
- Verify rewards address for correctness on `./ethd update`
- Better UX / question flow during `./ethd config`
- Clearer warning not to `./ethd restart` without a rewards address
- Besu now defaults to snap sync
- `CL_NODE` will now inherit the `CC_NODE` setting on `./ethd update`

## v1.8.4 2022-05-24

*This is an optional release, that contains new features and bug fixes*

- **Breaking change**: OpenEthereum `oe.yml` has been removed, now that OpenEthereum is officially end of support and its repo has been archived
- Fixed ethd to once more work on macOS
- Besu is now offered as a choice on ARM64
- All clients that support it now use `--suggested-fee-recipient`
- Changed language of message box that prompts for fee recipient, to be clearer
- Added `validator-list` command

## v1.8.3 2022-05-19

*This is an optional release, that contains new features and bug fixes*

- Highly, highly experimental support for Akula. Do not use in production
- A few fixes around CL/EL NewSpeak
- Lodestar can import multiple keystores non-interactively
- staking-deposit-cli moved to Python 3.10
- `./ethd update` prompts for an Ethereum rewards address for priority fees and MEV, to be used post-merge. Currently only and exclusively actually being used by `lh-validator.yml`

## v1.8.2 2022-05-07

*This is an optional update, that contains new features*

- Experimental support for Prysm rapid sync
- Use JDK 17 to build Besu from source
- Remove consensus-only files and keep them in `rpc-nodes` branch only. Ditto remove old grafana yml files. This is meant to make the main branch more approachable.

## v1.8.1 2022-04-26

*This is an optional update, that contains new features*

- Remove advanced yml files from `main` branch. Please use the `rpc-nodes` branch if you are running a distributed
environment.
- `./ethd update` removes and renames yml files in `COMPOSE_FILE` and will automatically switch the branch for users
of advanced yml files.

## v1.8 2022-04-21

*This is an optional update, that contains new features*

- Close Promtail/Loki ports
- Support Gnosis Beacon Chain with `./ethd config`

## v1.7.8 2022-04-16

*This is an optional update, that contains new features*

- Prometheus metrics for all execution clients
- Remove node dashboard because it had Grafana alerts
- Update RocketPool integration for RocketPool 1.3.0
- `*-consensus.yml` now subscribe to all subnets, which is helpful for staking at scale
- Add `prometheus-traefik.yml` for use with federation or just to make it available via https://
- Support Blox SSV 0.1.11 and later

## v1.7.7.2 2022-03-28


- Switch to Go 1.18 for source builds
- Fix Nimbus Gnosis source build

## v1.7.7.1 2022-03-22


- Lighthouse default peers 80 to fit new guidance
- Bonsai tries for Besu with GA flag - thanks to @JustNotHelpful
- Nimbus switched back to use ws:// for web3 connections
- Prysm source build no longer attempts to build standalone slasher

## v1.7.7 2022-03-14

*This is an optional update, that contains new features*

* Breaking change: prysm-consensus-rest.yml removed, and prysm-consensus.yml changed to only support REST. Remote RPC is no longer available.
* Remove deprecated Nimbus RPC and use REST
* Improve Nimbus source build; support building Nimbus for Gnosis Chain

## v1.7.6.1 2022-03-05

*This is an optional update, that contains new features*

- New `teku-stats.yml` to support beaconcha.in stats with Teku
- Better `tzdata` installation on Debian images
- Logs available in Grafana via Loki

## v1.7.6 2022-02-16

*This is an optional update, that contains new features and bugfixes*

- `./ethd update` no longer overwrites an empty `GRAFFITI`
- Support for Nimbus rapid sync
- Support for Nimbus CORS on keymanager (experimental)
- Switched default Nimbus web3 URL from ws:// to http://

## v1.7.5.1 2022-02-09

*This is an optional update, that contains new features*

- `./ethd prune-geth` will now restart Geth after prune. Thanks to Joe @ RocketPool for the idea!
- The `auto-prune.sh` script no longer asks for user input

## v1.7.4.4 2022-02-08

*This is an optional update, that contains new features and bug fixes*

- `prysm-consensus.yml` now only exposes REST, no longer gRPC. This is a breaking change if you are using a remote Prysm validator with it!
- Fixed Lodestar rapid sync to use the new format
- Fixed Lodestar execution client connection to use the new format
- Nethermind log level fixed
- `./ethd update` no longer shows an error when coming from an older version of eth-docker

## v1.7.4.3 2022-02-05

*This is an optional update, that contains new features*

- Support staking-deposit-cli v2.0.0

## v1.7.4.2 2022-02-04

*This is an optional update, that contains new features*

- Experimental support for the standardized key management API, exposed on localhost port `7500` with `consensus-keyapi-localport.yml` or `validator-keyapi-localport.yml`, depending on whether the specific client has a separate validator container.
- Warn when Ubuntu "snap" docker is found
- Default to Lighthouse `latest-modern` image
- Nethermind no longer uses an ancient barrier. This means other clients can sync from it.

## v1.7.4.1 2022-02-01

*This is a bugfix update*

- Grafana dashboards retain their variables across restart
- `./ethd config` and `./ethd update` now warn when a snap install of Docker is found

## v1.7.4 2022-01-30

*This is an optional update, that contains new features*

- Fixed Lodestar
- Initial support for integration with Wagyu installer
- `./ethd keyimport` command
- Experimental support for Key Manager API on Nimbus, on `127.0.0.1:5053`

## v1.7.3 2022-01-29

*This is an optional update, that contains new features*

- MacOS support. Thanks to suburbandad!
- Nethermind no longer uses ancient barriers, so other clients can sync from it
- CORS origin * throughout so Metamask works
- geth-prune now wants 40GB free instead of 50GB
- Improved Besu source build

## v1.7.2.5 2022-01-21

*This is a bugfix update, and also contains new features*

* Fix Lodestar validator startup path - yep that means no-one was running it :)
* Remove /etc/timezone throughout - the `-notz.yml` files should no longer be used on Amazon Linux 2
* Added Nethermind as an option on arm64 

## v1.7.2.4 2022-01-14

*This is an optional update, that contains new features*

* Support Nimbus validator monitor
* Improved `./ethd config` for RocketPool

## v1.7.2.1 2022-01-14

*This is an optional update, that contains new features*

* Revamped `./ethd config` for easier integration with RocketPool and Blox

## v1.7.1 2022-01-12

*This is an optional update, that contains new features*

* Added a Grafana dashboard for Besu.

## v1.7.0 2022-01-11

*This is an optional update, that contains new features*

* Overhauled the Grafana dashboards. Please report issues.

## v1.6.9 2022-01-10

*This is an optional update, that contains new features*

* Support running blox-ssv node via eth-docker

## v1.6.8 2022-01-07

*This is an optional update, that contains new features and bug fixes*

* Traefik web proxy no longer uses wild card certs
* Nimbus no longer uses `--subscribe-all-subnets` when run as a consensus client only
* Fixed a permissions issue with `./ethd prune-geth`

## v1.6.7 2022-01-02

*This is an optional update, that contains new features and bug fixes*

* Doppelganger protection turned off by default
* Lighthouse Rapid Sync now works with Grafana enabled

## v1.6.5 2021-12-22

*This is an optional update, that contains new features*

* `./ethd config` now supports Lodestar
* Source builds for Geth and Erigon switched to Go 1.17 from Go 1.16

## v1.6.4 2021-12-17

*This is an optional update, that contains new features*

* Prep for Nimbus rapid sync
* `./ethd config` now queries for rapid sync on Lighthouse
* Erigon supports `eth_sendRawTransaction`

## v1.6.3 2021-12-06

*This is an optional update, that contains new features and bug fixes*

* Fixed a bug in `lh-validator.yml` that would prevent the image building
* Move LodeStar source build to node.js 16
* Support for LodeStar consensus client only and LodeStar validator client only
* Lodestar REST API also on port 5052

## v1.6.2 2021-12-06

*This is an optional update, that contains new features and bug fixes*

* Fixed a permissions bug with `prysm-web.yml` introduced in 1.6
* Consensus REST API consistently on port 5052 for compatibility with RocketPool

## v1.6.1 2021-11-27

*This is an optional update, that contains new features*

* Added `nimbus-consensus.yml` to run Nimbus as a remote consensus client
* Changed `prysm-consensus.yml` to expose the standard REST API via https://
* Changed Nethermind source compile to use .NET 6.0
* Restricted Besu Java heap to 4 GiB

## v1.6 2021-11-20

*This is an optional update, that contains new features and bug fixes*

* Support the latest Besu release
* All intermediary scripts that migrate from pre-v1.x setups have been removed. This is a breaking change
  if you are coming from a v0.x release.
* `-shared.yml` files for consensus clients, just for 0neInfra :)

## v1.5.10 2021-11-10

*This is an optional update, that contains new features and bug fixes*

* Besu defaults to Bonsai tries. This will require a complete resync.
* Teku validator client uses `--network=auto` flag
* Besu allows Metamask connection
* Added `./ethd rocketeer` to change RocketPool config when running hybrid mode
* Auto-prune permissions issue resolved
* `./ethd update` keeps `LS_RAPID_SYNC`

## v1.5.9 2021-10-11

*This is an optional update, that contains new features*

* New docker logging configuration - now when you run out of space, it'll be Geth, not Traefik debug logs
* Support for Lodestar's checkpoint sync via `LS_RAPID_SYNC`
* Fixed Lodestar's binary and source builds: The location of the binary changed

## v1.5.8 2021-10-09

*This is a bugfix update*

* beacon-chain stats work with the split consensus/validator Lighthouse. Thanks to Faisal Moledina.

## v1.5.7 2021-10-09

*This is a bugfix update*

* `./ethd prune-geth` no longer tries to allocate a TTY, which could cause it to fail.

## v1.5.6 2021-10-08

*This is a bugfix update*

* `lh-stats.yml` is now compatible with `LH_RAPID_SYNC`.

## v1.5.5 2021-10-06

*This is a bugfix update*

* Removed doppelganger protection from `lh-validator.yml`, because it does not play well with Teku/Infura

## v1.5.4 2021-10-06

*This is an optional update, that contains new features*

* Support for Prym's new slasher and Lighthouse's slasher
* Optional `notz` files for Lighthouse and Teku, for use with Amazon Linux 2 or similar

## v1.5.3 2021-10-01

*This is an optional update, that contains new features*

* Support for Lighthouse's new checkpoint sync. Requires LH v2.0.0
* Support for RocketPool and eth-docker side-by-side, using the consensus client and execution client in eth-docker for both 

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

* Added "validator-voluntary-exit" to Prysm
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
