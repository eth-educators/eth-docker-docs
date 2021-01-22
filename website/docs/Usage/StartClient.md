---
id: StartClient
title:  Start the Client
sidebar_label: Start the Client
---

To start the client:
```
sudo docker-compose up -d eth2
```
> **Nimbus and Teku**: Beacon and validator client run in the same process, there is only one container for both

If, however, you chose not to store the wallet password with the validator client, you will need
to bring the beacon and, if in use, eth1, up individually instead, then "run"
the validator client so it can prompt you for input:

```
sudo docker-compose up -d eth1 beacon
sudo docker-compose run validator
```

After providing the wallet password, use the key sequence Ctrl-p Ctrl-q to detach
from the running container.