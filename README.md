### ynab-exporter

A Prometheus exporter for [You Need A Budget](https://www.ynab.com)(YNAB) budgeting data. This exporter fetches data from YNAB API and publishes the following metrics

```
# HELP ynab_category_balance_amount Category Balance amount
# TYPE ynab_category_balance_amount gauge

# HELP ynab_category_activity_amount Category Activity amount
# TYPE ynab_category_activity_amount gauge

# HELP ynab_category_budgeted_amount Category Budgeted amount
# TYPE ynab_category_budgeted_amount gauge

# HELP ynab_cleared_account_balance Account Cleared Balance amounts
# TYPE ynab_cleared_account_balance gauge

# HELP ynab_uncleared_account_balance Account Uncleared Balance amounts
# TYPE ynab_uncleared_account_balance gauge
```

### How do I get started? 

- Build the Docker image

```bash
    # replace sathyabhat/ynab-exporter with your own tag
    docker build . -t sathyabhat/ynab-exporter 
```

- Set the following environment variables:

  * `YNAB_TOKEN` - API token from [YNAB](https://api.ynab.com/).
  * `BUDGET_ID` - The id corresponding to your YNAB budget. Soon, this exporter will fetch and publish data from all budgets.
  
  Optionally, to enable OTEL logging via [Honeycomb](https://www.honeycomb.io/)
  * `HONEYCOMB_API_KEY` - Honeycomb API key
  * `OTEL_SERVICE_NAME` - A custom name for your service.

  A sample `.env` file is provided in [.env.example](./.env.sample).

- Run the exporter

```bash
docker run --rm -e YNAB_TOKEN -e BUDGET_ID -p -d sathyabhat/ynab-exporter
```

The exporter will start listening on the port that you provide as a `PORT` environment variable, or on 9100 if you don't provide it. 

### Feedback/suggestions

If you have any feedback/suggestions, please [open a GitHub issue](https://github.com/SathyaBhat/ynab-exporter/issues/new).