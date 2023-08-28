
import {ynabClient, getAccountBalances} from "./ynab";
import {API} from "ynab";
import {Gauge, Registry, collectDefaultMetrics} from "prom-client";

export async function collectAccountBalanceValues(ynab: API, registry: Registry) {
    const accountBalances = await getAccountBalances(ynab);
    const accountLabels = ['account_name', 'type'];
    const accountClearedBalanceGauge = new Gauge({
        name: "ynab_cleared_account_balance",
        registers: [registry],
        help: "Account Cleared Balance amounts",
        labelNames: accountLabels,
        async collect() {
            accountBalances.forEach(a => {
                accountClearedBalanceGauge.labels({account_name: a.name, type: a.type}).set(a.cleared_balance);
            });
        }

    });
    const accountUnClearedBalanceGauge = new Gauge({
        name: "ynab_uncleared_account_balance",
        help: "Account Uncleared Balance amounts",
        registers: [registry],
        labelNames: accountLabels,
        async collect() {
            accountBalances.forEach(a => {
                accountUnClearedBalanceGauge.labels({account_name: a.name, type: a.type}).set(a.uncleared_balance);
            });
        }

    });
}