import {Account, Category} from "ynab";
import * as metrics from './metrics';

export class YNABCollector {
  categoryBalance: Category[] = [];

  public collectAccountBalanceMetrics(budgetName: string, accountBalances: Account[]) {
    accountBalances.forEach(a => {
      metrics.ynab_cleared_account_balance.labels({account_name: a.name, budget_name: budgetName, type: a.type, closed: String(a.closed)}).set(a.cleared_balance / 1000);
      metrics.ynab_uncleared_account_balance.labels({account_name: a.name, budget_name: budgetName, type: a.type, closed: String(a.closed)}).set(a.uncleared_balance / 1000);
    });
  }

  public convertMilliUnitsToUnits(amount: number): number {
    return (amount / 1000);
  }

  public async collectCategoryBalanceMetrics(budgetName: string, categoryBalance: Category[]) {
    for (const cat of categoryBalance) {
      metrics.ynab_category_balance_amount.labels({
        name: cat.name,
        category_group_name: cat.category_group_name,
        hidden: String(cat.hidden),
        deleted: String(cat.deleted),
        budget_name: budgetName,
      }).set(
        this.convertMilliUnitsToUnits(cat.balance)
      );
      metrics.ynab_category_budgeted_amount.labels({
        name: cat.name,
        category_group_name: cat.category_group_name,
        hidden: String(cat.hidden),
        deleted: String(cat.deleted),
        budget_name: budgetName,
      }).set(
        this.convertMilliUnitsToUnits(cat.budgeted)
      );
      metrics.ynab_category_activity_amount.labels({
        name: cat.name,
        category_group_name: cat.category_group_name,
        hidden: String(cat.hidden),
        deleted: String(cat.deleted),
        budget_name: budgetName,
      }).set(
        this.convertMilliUnitsToUnits(cat.activity)
      );
    }
  }
}
