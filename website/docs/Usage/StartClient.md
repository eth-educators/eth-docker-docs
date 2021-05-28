---
id: StartClient
title: "Step 5: Start the client"
sidebar_label: Start the Client
---

To start the client:
```
sudo docker-compose up -d eth
```
> **Nimbus and Teku**: Consensus client and validator client run in the same process, there is only one container for both

If, however, you chose not to store the wallet password with the validator client, you will need
to bring the consensus client and, if in use, execution client, up individually instead, then "run"
the validator client so it can prompt you for input:

```
sudo docker-compose up -d execution consensus
sudo docker-compose run validator
```

After providing the wallet password, use the key sequence Ctrl-p Ctrl-q to detach
from the running container.