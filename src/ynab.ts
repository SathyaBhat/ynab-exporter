import * as ynab from "ynab";
import {Account} from "ynab";
import {TransactionsResponse} from "ynab";

export type ynabTransactionResponse = (TransactionsResponse & {rateLimit: string | null;}) | undefined;
export const ynabBudgetId = process.env.BUDGET_ID!;
export async function ynabClient(): Promise<ynab.API> {

  const accessToken = process.env.YNAB_TOKEN!;
  return new ynab.API(accessToken);
}

export async function getAccountBalances(client: ynab.API) {
  const accounts = await client.accounts.getAccounts(ynabBudgetId);
  return accounts.data.accounts;
}

