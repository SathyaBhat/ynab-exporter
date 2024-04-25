import {Gauge, Registry, collectDefaultMetrics} from "prom-client";

const catLabels = ['name', 'category_group_name', 'budgeted_amount', 'activity_amount', 'balance_amount', 'hidden', 'deleted', 'budget_name'];
const accountLabels = ['budget_name', 'account_name', 'type', 'closed'];
export const registry = new Registry();

export const ynab_category_balance_amount = new Gauge({
    name: 'ynab_category_balance_amount',
    help: 'Category Balance amount',
    registers: [registry],
    labelNames: catLabels,
});

export const ynab_category_activity_amount = new Gauge({
    name: 'ynab_category_activity_amount',
    help: 'Category Activity amount',
    registers: [registry],
    labelNames: catLabels,
});

export const ynab_category_budgeted_amount = new Gauge({
    name: 'ynab_category_budgeted_amount',
    help: 'Category Budgeted amount',
    registers: [registry],
    labelNames: catLabels,
});

export const ynab_cleared_account_balance = new Gauge({
    name: 'ynab_cleared_account_balance',
    help: 'Account Cleared Balance amounts',
    registers: [registry],
    labelNames: accountLabels,
});

export const ynab_uncleared_account_balance = new Gauge({
    name: 'ynab_uncleared_account_balance',
    help: 'Account Uncleared Balance amounts',
    registers: [registry],
    labelNames: accountLabels
});