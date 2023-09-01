import {API} from "ynab";

export async function ynabClient(): Promise<API> {
    const accessToken = process.env.YNAB_TOKEN!;
    return new API(accessToken);
}