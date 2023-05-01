---
id: SecurityAudit
title: Security Audit
sidebar_label: Security Audit
---

# Findings

Sigma Prime conducted a security audit of eth-docker 2.2.8.4 during March and April 2023, with findings presented on April 30th 2023.

A huge thank-you to both Sigma Prime and Ethereum foundation, who funded the work.

[Findings as PDF](../../static/pdf/Sigma_Prime_Security_Audit_Findings_2023-05-01.pdf)

There are one high severity and four informational findings. The high-severity finding is about the entropy used for JWT secret,
API manager token in Nimbus and Lodestar, Prysm wallet password, and Teku cert password: Entropy comes from `$RANDOM` and is therefore only 16 bits.

# Response

eth-docker v2.3 addresses these findings. It now uses 64 bits of entropy and SHA-256 hash.

Users that expose the Engine API with `ee-shared.yml` or `ee-traefik.yml` need to make sure that it is firewalled to trusted IPs.

Users that did so before eth-docker v2.3 may want to, in addition, update with `./ethd update`, stop the stack with `./ethd stop`,
delete the `jwtsecret` docker volume with `docker volume ls` and `docker volume rm`, and start the stack with `./ethd up`. 

My own likelihood assessment for exploitation is "Low", not "Medium". This is because
- The Engine API by default is not exposed. Only users who expose the Engine API with `ee-shared.yml` or `ee-traefik.yml` **and** allow access by untrusted addresses are at risk.
- The Prysm wallet and Teku cert file are not accessible remotely.
- The keymanager API is not accessible remotely: At most locally if using `*-keyapi-localport.yml`.

ED-05 recommends: "Use of clipboard for sensitive strings. Consider giving the user the option of using the clipboard for sensitive
strings instead of storing the data in a file."

This was not addressed. JWT secret and API token need to be present in files for the clients to function. Prysm wallet password is stored
in a file so the Prysm client can open it. Keymanager API token and Prysm wallet password are printed to stdout if the user requests them.
