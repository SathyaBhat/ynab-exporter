import {Gauge, Registry} from "prom-client";
import {Account} from "ynab";

export class YNABCollector {
    accountBalances: Account[] = [];

    public async collectAccountBalanceMetrics(register: Registry) {
        console.log('Collecting account balance metrics..');

        const accountLabels = ['account_name', 'type', 'closed'];
        const accountClearedBalanceGauge = new Gauge({
            name: "ynab_cleared_account_balance",
            registers: [register],
            help: "Account Cleared Balance amounts",
            labelNames: accountLabels,
            collect: async () => {
                console.debug(`Collecting Cleared Balance for ${this.accountBalances.length} accounts`);
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
                console.debug(`Collecting Uncleared Balance for ${this.accountBalances.length} accounts`);
                this.accountBalances.forEach(a => {
                    accountUnClearedBalanceGauge.labels({account_name: a.name, type: a.type, closed: String(a.closed)}).set(a.uncleared_balance / 1000);
                });
            }

        });

    }

}
