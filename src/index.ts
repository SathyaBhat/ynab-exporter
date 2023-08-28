
import {ynabClient} from "./ynab";
import {Registry} from "prom-client";
import express, {Express, Request, Response} from 'express';
import {collectAccountBalanceValues} from "./accounts";

async function main() {
  const ynab = await ynabClient();
  const registry = new Registry();
  const app: Express = express();
  const port = process.env.PORT;
  app.get('/metrics', (req: Request, res: Response) => {
    res.setHeader('Content-Type', registry.contentType);
    registry.metrics().then(data => res.status(200).send(data));
  });


  // collectDefaultMetrics({register});
  collectAccountBalanceValues(ynab, registry);

  app.listen(port || 9100, () => {
    console.log('⚡ Hello');
  });
}

if (require.main === module) {
  console.log('Starting YNAB Exporter 💰💸');
  main();
}

