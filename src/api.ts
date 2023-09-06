import {API} from "ynab";

export class YnabAPI {
    private accessToken = process.env.YNAB_TOKEN!;
    public client: API;
    public budgetId: string = process.env.BUDGET_ID!;

    constructor() {
        this.client = new API(this.accessToken);
    }

    public async getAccountName(): Promise<string> {
        return (await this.client.budgets.getBudgetById(this.budgetId)).data.budget.name;
    }
}
