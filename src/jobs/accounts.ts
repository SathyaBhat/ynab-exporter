import {AccountsResponse, Category} from "ynab";
import {YnabAPI} from "../api";

export async function scheduledAccountBalanceUpdate(ynab: YnabAPI): Promise<AccountsResponse> {
  return ynab.client.accounts.getAccounts(ynab.budgetId);

}
export async function scheduledCategoryBalanceUpdate(ynab: YnabAPI): Promise<Category[]> {
  return ynab.getCategoryBudgets();
}