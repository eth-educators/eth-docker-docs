---
id: Autostart
title:  Autostart the client on boot.
sidebar_label: Autostart
---

If you are using the "unless-stopped" restart policy, docker will start the 
client for you. That said, you may wish to make sure this happens on
startup even if the client was stopped. In that case, create a service
to start the client on boot.

For Linux systems that use systemd, e.g. Ubuntu, you'd create a systemd
service. 

- Copy the file: `sudo cp sample-systemd /etc/systemd/system/eth2.service`
- Edit the file: `sudo nano /etc/systemd/system/eth2.service`
- Adjust the `WorkingDirectory` to the directory you stored the project in.
- Adjust the path to `docker-compose` to be right for your system, see `which docker-compose`
- Test the service: From within the project directory, `sudo docker-compose down` to shut
  it down, then `sudo systemctl daemon-reload`, `sudo systemctl start eth2` to bring it back up,
  and check `sudo docker ps` to see all expected containers are up.
- Enable the service: `sudo systemctl enable eth2`