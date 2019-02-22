import {interval, Subscription} from "rxjs"
import {mergeMap, map} from "rxjs/operators"
import {Api, Balance, composeApi} from "@burstjs/core";
import {convertNQTStringToNumber} from "@burstjs/util";
import {Collector} from "./collector";
import {Store} from "../../typings/store";
import {Config} from "../config";

const fetchBalances = async (api: Api, accounts: Array<string>): Promise<Balance[]> => (
    Promise.all(accounts.map(api.account.getAccountBalance))
);

const mapBalancesToAccounts = (accounts: Array<string>) => (balances: Array<Balance>) => (
    accounts.reduce( (prev, accountId, index) => ({ [accountId]: balances[index].balanceNQT }) , {})
);

const addTotalSum = (accountBalances:any) => {
    const total = Object.keys(accountBalances).reduce( (totalBalance, accountId) =>
                  totalBalance + convertNQTStringToNumber(accountBalances[accountId])
    , 0);

    return {
        accounts: {
            ...accountBalances,
        },
        total
    }
};

export class BrsCollector extends Collector{
    private intervalSubscription: Subscription;
    private api: Api;

    constructor(store:Store, private config: Config) {
        super(store);
        this.api = composeApi({
            nodeHost: config.peer,
            apiRootUrl: '/burst'
        })
    }

    protected onStart() {

        const {accounts} = this.config;

        this.intervalSubscription = interval(1000).pipe(
            mergeMap(() => fetchBalances(this.api, accounts)),
            map( mapBalancesToAccounts(accounts) ),
            map( addTotalSum )
        ).subscribe((data) => {
            this.update( 'brs', {
                ...data,
                isLoading:false,
            } );
        });
    }

    protected onStop() {
        this.intervalSubscription.unsubscribe();
    }

}
