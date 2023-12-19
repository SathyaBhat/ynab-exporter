


import {CronJob} from 'cron';
import express, {Express, Request, Response} from 'express';
import {Registry} from "prom-client";
import 'source-map-support/register';
import {YnabAPI} from "./api";
import {YNABCollector} from "./collectors";
import {scheduledAccountBalanceUpdate} from "./jobs/accounts";;


async function main() {
  const ynab = new YnabAPI();
  const register = new Registry();

  const port = process.env.PORT || 9100;
  const app: Express = express();
  const ynabCollector = new YNABCollector();

  new CronJob({
    cronTime: "*/15 * * * *",
    onTick: async () => {
      ynabCollector.accountBalances = (await scheduledAccountBalanceUpdate(ynab)).accounts;
      console.log(`${ynabCollector.accountBalances.length} accounts refreshed`);
    },
    start: true,
    runOnInit: true
  });

  register.setDefaultLabels({
    budget_name: await ynab.getAccountName()
  });
  ynabCollector.collectAccountBalanceMetrics(register);

  app.get('/metrics', async (req: Request, res: Response) => {
    res.setHeader('Content-Type', register.contentType);
    console.debug('getting metrics');
    const results = await register.metrics();
    res.send(results);
  });

  app.listen(port, () => {
    console.log(`🔊 Publishing metrics on port ${port}`);
  });
}

if (require.main === module) {
  console.log('Starting YNAB Exporter 💰💸');
  main();
}
