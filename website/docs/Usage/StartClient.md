---
id: StartClient
title: "Step 5: Start the client"
sidebar_label: Start the Client
---

To start the client:
```
sudo ./ethd start
```
or:
```
sudo docker-compose up -d eth
```

> **Nimbus and Teku**: Consensus client and validator client run in the same process, there is only one container for both

If, however, you chose not to store the wallet password with the validator client, you will need
to bring the consensus client and, if in use, execution client, up individually instead, then "run"
the validator client so it can prompt you for input:

```
sudo docker-compose up -d execution consensus
sudo docker-compose run --name eth-docker_validator_1 validator
```

Where the `--name` parameter should match the name the container would receive when using `up`, so that it is likely to inadvertently start a second copy.
 
After providing the wallet password, use the key sequence Ctrl-p Ctrl-q to detach
from the running container.

> **Caution**: This gives you a running container for the validator client that is not recognized
> by docker-compose as the `validator` service. An `./ethd up` could then start a second validator client,
> unless the container name keeps it from doing so. The second client would also prompt for a password in
> the background, but without any way of receiving one that I could find.
