import log from 'loglevel';
import {Gauge, Registry} from "prom-client";
import {Account, Category} from "ynab";

export class YNABCollector {
    accountBalances: Account[] = [];
    categoryBalance: Category[] = [];


    public async collectAccountBalanceMetrics(register: Registry) {
        log.debug('Collecting account balance metrics..');

        const accountLabels = ['account_name', 'type', 'closed'];
        const accountClearedBalanceGauge = new Gauge({
            name: "ynab_cleared_account_balance",
            registers: [register],
            help: "Account Cleared Balance amounts",
            labelNames: accountLabels,
            collect: async () => {
                log.debug(`Collecting Cleared Balance for ${this.accountBalances.length} accounts`);
                this.accountBalances.forEach(a => {
                    accountClearedBalanceGauge.labels({account_name: a.name, type: a.type, closed: String(a.closed)}).set(a.cleared_balance / 1000);
                });
            }

        });
        const accountUnClearedBalanceGauge = new Gauge({
            name: "ynab_uncleared_account_balance",
            help: "Account Uncleared Balance amounts",
            registers: [register],
            labelNames: accountLabels,
            collect: async () => {
                log.debug(`Collecting Uncleared Balance for ${this.accountBalances.length} accounts`);
                this.accountBalances.forEach(a => {
                    accountUnClearedBalanceGauge.labels({account_name: a.name, type: a.type, closed: String(a.closed)}).set(a.uncleared_balance / 1000);
                });
            }
        });
    }

    public convertMilliUnitsToUnits(amount: number): number {
        return (amount / 1000);
    }

    public async collectCategoryBalanceMetrics(register: Registry) {
        log.debug('Collecting category balance metrics..');
        const self = this; // Store a reference to 'this', else typescript thinks this refers to the Gauge class, not the Collector class

        const catLabels = ['name', 'category_group_name', 'budgeted_amount', 'activity_amount', 'balance_amount', 'hidden', 'deleted'];

        // Define properties that differ between gauges
        const gaugeProperties = [
            {name: 'budgeted', help: 'Category Budgeted amount', suffix: 'budgeted_amount'},
            {name: 'activity', help: 'Category Activity amount', suffix: 'activity_amount'},
            {name: 'balance', help: 'Category Balance amount', suffix: 'balance_amount'},
            {name: 'hidden', help: 'Category Balance amount', suffix: 'hidden'},
            {name: 'deleted', help: 'Category Balance amount', suffix: 'deleted'},
        ];

        for (const prop of gaugeProperties) {
            new Gauge({
                name: `ynab_category_${prop.suffix}`,
                registers: [register],
                help: prop.help,
                labelNames: catLabels,
                async collect() {
                    for (const cat of self.categoryBalance) {
                        this.labels({
                            name: cat.name,
                            category_group_name: cat.category_group_name,
                            hidden: String(cat.hidden),
                            deleted: String(cat.deleted)
                        }).set(self.convertMilliUnitsToUnits(Number(cat[prop.name as keyof Category]) || 0));

                    }
                }
            });
        }
    }
}
