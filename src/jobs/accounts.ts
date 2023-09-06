import {AccountsResponseData, TransactionsResponse} from "ynab";
import {YnabAPI} from "../api";

export type ynabTransactionResponse = (TransactionsResponse & {rateLimit: string | null;}) | undefined;

export async function scheduledAccountBalanceUpdate(ynab: YnabAPI): Promise<AccountsResponseData> {
    console.log(`Starting scheduled account balance update at ${new Date().toLocaleString()} ...`);
    const accounts = await ynab.client.accounts.getAccounts(ynab.budgetId);
    console.log(`Fetched balances for ${accounts.data.accounts.length} accounts.`);
    console.log(`Rate limit: ${accounts.rateLimit}`);
    return accounts.data;
}