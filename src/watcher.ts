import {BehaviorSubject, interval, Subscription} from "rxjs"
import {mergeMap, map} from "rxjs/operators"
import {Config} from "./config";
import {Api, Balance, composeApi} from "@burstjs/core";

const getBalances = async (api: Api, accounts: Array<string>): Promise<Balance[]> => (
    Promise.all(accounts.map(api.account.getAccountBalance))
);

const mapBalancesToAccounts = (accounts: Array<string>) => (balances: Array<Balance>) => (
    accounts.reduce( (prev, accountId, index) => ({ [accountId]: balances[index] }) , {})
);

export class Watcher {
    private intervalSubscription: Subscription;
    private source: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private subscriptions: Array<Subscription> = [];
    private api: Api;

    constructor(private config: Config) {
        this.api = composeApi({
            nodeHost: config.peer,
            apiRootUrl: '/burst'
        })
    }


    public start(intervalSeconds: number): Watcher {

        const {accounts} = this.config;

        this.intervalSubscription = interval(intervalSeconds * 1000).pipe(
            mergeMap(() => getBalances(this.api, accounts)),
            map( mapBalancesToAccounts((accounts)) )
        ).subscribe(console.log);
        //).subscribe(_ => this.source.next(_));
        return this;
    }

    public subscribe(observer: (value: string) => void): Subscription {
        const subscription = this.source.subscribe(observer);
        this.subscriptions.push(subscription);
        return subscription;
    }

    public destroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.intervalSubscription.unsubscribe();
    }

}
