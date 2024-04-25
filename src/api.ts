import log, {LogLevelDesc} from 'loglevel';
import {API, Category} from "ynab";

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

    public async getCategoryBudgets(): Promise<Category[]> {
        const catGroups = (await this.client.categories.getCategories(this.budgetId)).data.category_groups;
        const categories = (catGroups.map(g => g.categories)).flat(1);
        log.info(`Got ${categories.length} categories`);
        return categories;
    }

    public async getBudgetIds() {
        return (await this.client.budgets.getBudgets().then(b => b.data.budgets)).map(b => this.budgetId);
    }
}
