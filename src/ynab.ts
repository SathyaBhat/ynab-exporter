import * as ynab from "ynab";
import { Account } from "ynab";
export class YNAB {
  private privateAccessToken = process.env.YNAB_TOKEN!;
  private ausBudgetId = process.env.BUDGET_ID!;
  private amexAccountId = process.env.ACCOUNT_ID!;
  private i: number = 0;
  public ynabAPI = new ynab.API(this.privateAccessToken);

  private getPayeeName(payeeId: string) {
    return "";
  }
  public async getYnabTransactions() {
    try {
      const transactions = await this.ynabAPI.transactions.getTransactionsByAccount(
        this.ausBudgetId,
        this.amexAccountId,
        "2022-11-12"
      );
      return transactions;
    } catch (error) {
      console.log(error);
    }
  }

  public async getYnabAccounts() {
    try {
      const accounts = await this.ynabAPI.accounts.getAccounts(this.ausBudgetId);
      return accounts.data.accounts;
    } catch (error) {
      console.error(`Couldn't fetch accounts due to ${error}`);
    }
  }
}
