---
id: StartClient
title: "Step 5: Start the client"
sidebar_label: Start the Client
---

To start the client:
```
./ethd start
```
or:
```
docker-compose up -d eth
```

> **Nimbus and Teku**: Consensus client and validator client run in the same process, there is only one container for both

If, however, you chose not to store the wallet password with the validator client, you will need
to bring the consensus client and, if in use, execution client, up individually instead, then "run"
the validator client so it can prompt you for input:

```
docker-compose up -d execution consensus
docker-compose run --name eth-docker_validator_1 validator
```

Where the `--name` parameter should match the name the container would receive when using `up`, so that it is unlikely to inadvertently start a second copy.
 
After providing the wallet password, use the key sequence Ctrl-p Ctrl-q to detach
from the running container.

> **Caution**: This gives you a running container for the validator client that is not recognized
> by docker-compose as the `validator` service. An `./ethd up` could then start a second validator client,
> unless the container name keeps it from doing so. The second client would also prompt for a password in
> the background, but without any way of receiving one that I could find.

Take a look at [Troubleshooting](../Support/Troubleshooting.md) next for some handy commands to see logs and the status of your clients.

## Additional resources

[Youtube Channel](https://www.youtube.com/c/YorickDowne)
[Security Best Practices](https://www.coincashew.com/coins/overview-eth/guide-or-security-best-practices-for-a-eth2-validator-beaconchain-node)
