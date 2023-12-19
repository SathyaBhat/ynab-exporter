


import {CronJob} from 'cron';
import express, {Express, Request, Response} from 'express';
import {Registry} from "prom-client";
import 'source-map-support/register';
import {YnabAPI} from "./api";
import {YNABCollector} from "./collectors";
import {scheduledAccountBalanceUpdate} from "./jobs/accounts";
import log, {LogLevelDesc} from 'loglevel';

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
      log.info(`${ynabCollector.accountBalances.length} accounts refreshed`);
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
    log.debug('getting metrics');
    const results = await register.metrics();
    res.send(results);
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
