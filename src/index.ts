
import {ynabClient, getAccountBalances} from "./ynab";
import {Gauge, Registry, collectDefaultMetrics} from "prom-client";
import express, {Express, Request, Response} from 'express';


async function main() {
  const app: Express = express();
  const port = process.env.PORT;
  app.get('/metrics', (req: Request, res: Response) => {
    res.setHeader('Content-Type', register.contentType);
    register.metrics().then(data => res.status(200).send(data));
  });
  const ynab = await ynabClient();
  const register = new Registry();

  collectDefaultMetrics({register});
  const accountBalanceGauge = new Gauge({
    name: "ynab_account_balance",
    help: "Account Balance amounts",
    labelNames: ["accountName"],
    async collect() {

      const accountBalances = await getAccountBalances(ynab);
      accountBalances.forEach(a => {
        accountBalanceGauge.labels({accountName: a.name}).set(a.cleared_balance);
      });
    }

  });
  register.registerMetric(accountBalanceGauge);

  app.listen(9100, () => {
    console.log('⚡ Hello');
  });
}

if (require.main === module) {
  console.log('Starting YNAB Exporter 💰💸');
  main();
}

