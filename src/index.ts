import { Command } from "commander";
import { parseAmexStatement } from "./parse";
import { YNAB } from "./ynab";
import { DB } from "./db";

async function main() {
  const program = new Command();
  program
    .description("Validates transactions from statements are in YNAB")
    .option("-l, --last-date <value> Last date to go back to and fetch")
    .option("-s, --statement-date <value> Last date to go back to in the statement")
    .parse(process.argv);

  const options = program.opts();
  const ynab = new YNAB();
  const db = new DB();

  const ynabAccounts = await ynab.getYnabAccounts();
  console.log("Found following accounts:");
  for (const account of ynabAccounts!) {
    console.log(`\t ${account.name}`);
  }
  const ynabTransactions = await ynab.getYnabTransactions();
  for (const transaction of ynabTransactions!.data!.transactions) {
    // console.log(` ${transaction.id} ${transaction.amount} for ${transaction.payee_name} (${transaction.memo})`);
    db.saveTransaction(transaction);
  }
}

main();
