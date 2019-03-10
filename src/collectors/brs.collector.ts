import {interval, Subscription} from "rxjs"
import {mergeMap, map, startWith} from "rxjs/operators"
import {Api, Balance, composeApi, TransactionList} from "@burstjs/core";
import {convertNQTStringToNumber} from "@burstjs/util";
import {Collector} from "./collector";
import {Store} from "../../typings/stappo/store";
import {Config} from "../config";
import {BRS_POLLING_SEC} from "../constants";

const fetchBalances = async (api: Api, accounts: Array<string>): Promise<Balance[]> => (
    Promise.all(accounts.map(api.account.getAccountBalance))
);

const mapBalancesToAccounts = (accounts: Array<string>) => (balances: Balance[]) => (
    accounts.reduce((prev, accountId, index) => ({
        ...prev,
        [accountId]: balances[index].balanceNQT
    }), {})
);

const addTotalSum = (accountBalances: any) => {
    const total = Object.keys(accountBalances).reduce((totalBalance, accountId) =>
        totalBalance + convertNQTStringToNumber(accountBalances[accountId])
        , 0);

    return {
        accounts: {...accountBalances},
        total,
    }
};

const fetchTransactions = async (api: Api, accounts: Array<string>): Promise<TransactionList[]> => (
    Promise.all(accounts.map(accountId => api.account.getAccountTransactions(accountId, 0, 25)))
);

const mapTransactionsToAccounts = (accounts: Array<string>) => (transactionLists: TransactionList[]) => (
    accounts.reduce((prev, accountId, index) => ({
        ...prev,
        [accountId]: transactionLists[index].transactions
    }), {})
);

export class BrsCollector extends Collector {
    private balancesSubscription: Subscription;
    private transactionsSubscription: Subscription;
    private api: Api;

    constructor(store: Store, private config: Config) {
        super(store);
        this.api = composeApi({
            nodeHost: config.peer,
            apiRootUrl: '/burst'
        });
    }

    private pollBalances() {
        const {accounts} = this.config;
        this.balancesSubscription = interval(BRS_POLLING_SEC * 1000).pipe(
            startWith(0),
            mergeMap(() => fetchBalances(this.api, accounts)),
            map(mapBalancesToAccounts(accounts)),
            map(addTotalSum)
        ).subscribe((data) => {
            this.update('balances', {
                ...data,
                isLoading: false,
            });
        });
    }

    private pollTransactions() {
        const {accounts} = this.config;
        this.transactionsSubscription = interval(BRS_POLLING_SEC * 1000).pipe(
            startWith(0),
            mergeMap(() => fetchTransactions(this.api, accounts)),
            map(mapTransactionsToAccounts(accounts)),
            // map( addTotalSum )
        ).subscribe((data) => {
            this.update('transactions', {
                accounts: {...data},
                isLoading: false
            });
        });
    }

    protected onStart() {
        this.pollBalances();
        this.pollTransactions();
    }

    protected onStop() {
        if (this.balancesSubscription)
            this.balancesSubscription.unsubscribe();
        if (this.transactionsSubscription)
            this.transactionsSubscription.unsubscribe();
    }

}
