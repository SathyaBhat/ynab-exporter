### ynab-exporter

A simple Prometheus exporter for [You Need A Budget](https://www.ynab.com)(YNAB) budgeting data.

### How do I get started? 

- Build the Docker image

```bash
    # replace sathyabhat/ynab-exporter with your own tag
    docker build . -t sathyabhat/ynab-exporter 
```

- Export the following environment variables:

  * `YNAB_TOKEN` - API token from [YNAB](https://api.ynab.com/).
  * `BUDGET_ID` - The id corresponding to your YNAB budget. Soon, this exporter will fetch and publish data from all budgets.

- Run the exporter

```bash
docker run --rm -e YNAB_TOKEN -e BUDGET_ID -p -d sathyabhat/ynab-exporter
```

The exporter will start listening on the port that you provide as a `PORT` environment variable, or on 9100 if you don't provide it. 

### Feedback/suggestions

If you have any feedback/suggestions, please [open a Github issue](https://github.com/SathyaBhat/ynab-exporter/issues/new).