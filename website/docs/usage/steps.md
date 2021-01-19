---
id: steps
title:  Steps to bring an eth2 node up.
sidebar_label: steps
---

1. Install prerequisites
2. Choose a client and do initial setup.
3. Build the client
4. Generate deposit files and an eth2 wallet. This can be done within this project, or outside of it
5. Import the validator keystore files generated in the previous step
6. Run the client
7. Finalize the deposit. This is not done within this project
8. A baseline set of Grafana dashboards are included, see step 8.  Feel free to add more, or submit a PR with your favorite dashboards.
9. Configure your system to start the eth2 node on boot (optional)

## Step 1: Install prerequisites

You will need git, docker, and docker-compose. This should work on Linux, possibly MacOS.
