


import {CronJob} from 'cron';
import dotenv from "dotenv";
import express, {Express, Request, Response} from 'express';
import log, {LogLevelDesc} from 'loglevel';
import 'source-map-support/register';
import {YnabAPI} from "./api";
import {YNABCollector} from "./collectors";
import {scheduledAccountBalanceUpdate, scheduledCategoryBalanceUpdate} from "./jobs/accounts";
import {registry} from './metrics';

async function main() {
  dotenv.config();
  const ynab = new YnabAPI();

  const port = process.env.PORT || 9100;
  const app: Express = express();
  const ynabCollector = new YNABCollector();
  const budgetName = await ynab.getAccountName();

  new CronJob({
    cronTime: "*/15 * * * *",
    onTick: async () => {
      log.info(`Refreshing YNAB data at ${new Date().toLocaleString()}...`);
      const accountBalance = await scheduledAccountBalanceUpdate(ynab);
      const catBalance = await scheduledCategoryBalanceUpdate(ynab);
      ynabCollector.collectAccountBalanceMetrics(budgetName, accountBalance.data.accounts);
      ynabCollector.collectCategoryBalanceMetrics(budgetName, catBalance);
    },
    start: true,
    runOnInit: true
  });


  app.get('/metrics', async (req: Request, res: Response) => {
    res.setHeader('Content-Type', registry.contentType);
    res.send(await registry.metrics());
  });

  app.listen(port, () => {
    log.info(`🔊 Publishing metrics on port ${port}`);
  });
}

if (require.main === module) {
  const logLevel = (process.env.LOG_LEVEL) as LogLevelDesc || 'info';
  log.setLevel(logLevel);
  log.info('Starting YNAB Exporter 💰💸');
  main();
}
