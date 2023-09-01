


import {Registry, Gauge, collectDefaultMetrics} from "prom-client";
import express, {Express, Request, Response} from 'express';
import {YNABMetrics} from "./collectors";
import {scheduledAccountBalanceUpdate} from "./jobs/accounts";

import {CronJob} from 'cron';
import {Account} from "ynab";
import {ynabClient} from "./api";



async function main() {
  const ynab = await ynabClient();
  const register = new Registry();
  const port = process.env.PORT;
  const app: Express = express();
  const ynabMetrics = new YNABMetrics();

  new CronJob({
    cronTime: "0 * * * * ",
    onTick: async () => {
      ynabMetrics.accountBalances = (await scheduledAccountBalanceUpdate(ynab)).accounts;
      console.log(`${ynabMetrics.accountBalances.length} accounts refreshed`);
    },
    start: true,
    runOnInit: true
  });


  ynabMetrics.collectAccountBalanceMetrics(register);


  app.get('/metrics', async (req: Request, res: Response) => {
    res.setHeader('Content-Type', register.contentType);
    console.log('getting metrics');
    const results = await register.metrics();
    res.send(results);
  });

  app.listen(port || 9100, () => {
    console.log('⚡ Hello');
  });
}

if (require.main === module) {
  console.log('Starting YNAB Exporter 💰💸');
  main();
}
