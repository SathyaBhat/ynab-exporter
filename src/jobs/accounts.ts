import {API, AccountsResponseData, TransactionsResponse} from "ynab";

export type ynabTransactionResponse = (TransactionsResponse & {rateLimit: string | null;}) | undefined;
export const ynabBudgetId = process.env.BUDGET_ID!;

export async function scheduledAccountBalanceUpdate(ynab: API): Promise<AccountsResponseData> {
    console.log(`Starting scheduled account balance update at ${new Date().toLocaleString()} ...`);
    const accounts = await ynab.accounts.getAccounts(ynabBudgetId);
    console.log(`Fetched balances for ${accounts.data.accounts.length} accounts.`);
    console.log(`Rate limit: ${accounts.rateLimit}`);
    return accounts.data;
}