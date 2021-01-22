---
id: BuildClient
title:  Build Client
sidebar_label: Build Client
---

> **Important** Before you build, verify once more that `LOCAL_UID` in `.env`
> is the UID of your user (check with `echo $UID`), and that the file `.env`
> (dot env) is called exactly that, and contains the parameters you expect.
> You will get errors about missing permissions, during Step 4, if the UID is wrong.

Build all required images. If building from source, this may take 20-30 minutes. Assuming
you cloned the project into `eth2-docker`:
```
cd ~/eth2-docker && sudo docker-compose build
```
