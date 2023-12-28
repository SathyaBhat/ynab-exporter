import {AccountsResponseData, Category} from "ynab";
import {YnabAPI} from "../api";
import log from 'loglevel';

export async function scheduledAccountBalanceUpdate(ynab: YnabAPI): Promise<AccountsResponseData> {
    log.info(`Starting scheduled account balance update at ${new Date().toLocaleString()} ...`);
    const accounts = await ynab.client.accounts.getAccounts(ynab.budgetId);
    log.info(`Fetched balances for ${accounts.data.accounts.length} accounts.`);
    return accounts.data;
}

export async function scheduledCategoryBalanceUpdate(ynab: YnabAPI): Promise<Category[]> {
    log.info(`Starting scheduled category balance update at ${new Date().toLocaleString()} ...`);
    const categories = await ynab.getCategoryBudgets();
    return categories;
}