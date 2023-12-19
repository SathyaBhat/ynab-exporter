import {AccountsResponseData, TransactionsResponse} from "ynab";
import {YnabAPI} from "../api";
import log from "loglevel";

export type ynabTransactionResponse = (TransactionsResponse & {rateLimit: string | null;}) | undefined;

export async function scheduledAccountBalanceUpdate(ynab: YnabAPI): Promise<AccountsResponseData> {
    log.info(`Starting scheduled account balance update at ${new Date().toLocaleString()} ...`);
    const accounts = await ynab.client.accounts.getAccounts(ynab.budgetId);
    log.info(`Fetched balances for ${accounts.data.accounts.length} accounts.`);
    log.info(`Rate limit: ${accounts.rateLimit}`);
    return accounts.data;
}