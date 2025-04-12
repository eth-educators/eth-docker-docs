---
title: "Share RPC, REST and other API ports"
sidebar_position: 5
sidebar_label: Share ports
---

## Sharing RPC and REST ports

These are largely for running RPC nodes, instead of validator nodes. Most users will not require them.

The `SHARE_IP` variable in `.env` can be used to restrict these shares to `127.0.0.1`, for local use or for use
with an SSH tunnel.

- `el-shared.yml` - as an insecure alternative to traefik-\*.yml, makes the RPC and WS ports of the execution client
available from the host. To be used alongside one of the execution client yml files. **Not encrypted**, do not expose
to Internet.
- `cl-shared.yml` - as an insecure alternative to traefik-\*.yml, makes the REST port of the consensus client available
from the host. To be used alongside one of the consensus client yml files. **Not encrypted**, do not expose to Internet.
- `ee-shared.yml` - as an insecure alternative to traefik-\*.yml, makes the engine API port of the execution client
available from the host. To be used alongside one of the execution client yml files. **Not encrypted**, do not expose
to Internet.

- `CLIENT-cl-only.yml` - for running a [distributed consensus client and validator client](../../Usage/ReverseProxy.md)
setup.
- `CLIENT-vc-only.yml` - the other side of the distributed client setup.
