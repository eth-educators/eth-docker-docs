---
id: Dashboards
title:  Dashboards
sidebar_label: Dashboards
---

A baseline set of dashboards has been included.  
- [Metanull's Prysm Dashboard JSON](https://raw.githubusercontent.com/metanull-operator/eth2-grafana/master/eth2-grafana-dashboard-single-source-beacon_node.json)
- [Prysm Dashboard JSON](https://raw.githubusercontent.com/GuillaumeMiralles/prysm-grafana-dashboard/master/less_10_validators.json)
- [Prysm Dashboard JSON for more than 10 validators](https://raw.githubusercontent.com/GuillaumeMiralles/prysm-grafana-dashboard/master/more_10_validators.json)
- [Lighthouse Beacon Dashboard JSON](https://raw.githubusercontent.com/sigp/lighthouse-metrics/master/dashboards/Summary.json)
- [Lighthouse Validator Client Dashboard JSON](https://raw.githubusercontent.com/sigp/lighthouse-metrics/master/dashboards/ValidatorClient.json)
- [Nimbus Dashboard JSON](https://raw.githubusercontent.com/status-im/nimbus-eth2/master/grafana/beacon_nodes_Grafana_dashboard.json)
- [Teku Dashboard](https://grafana.com/api/dashboards/12199/revisions/1/download)

Connect to http://YOURSERVERIP:3000/, log in as admin/admin, and set a new password.
> Grafana runs over http without encryption, which is not secure. Do not expose the Grafana port to the Internet. You can
> use [SSH tunneling](https://www.howtogeek.com/168145/how-to-use-ssh-tunneling/) to reach Grafana securely over the Internet.

In order to load other Dashboards, follow these instructions.

- Click on the + icon on the left, choose "Import".
- Copy/paste JSON code from the Raw github page of the Dashboard you chose - click anywhere inside the page, use Ctrl-A to select all and Ctrl-C to copy
- Click "Load"
- If prompted for a data source choose the "prometheus" data source
- Click "Import".