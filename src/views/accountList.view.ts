import * as blessed from "neo-blessed"
import {View} from "./view";
import {AccountData, AccountView} from "./account.view";
import {Config} from "../config";
import {selectCurrentAccountIndex, selectGetAccounts} from "../state/selectors";
import {start} from "repl";

const MAX_VISIBLE_ACCOUNTS = 2;

export class AccountListView implements View {
    private readonly box: any;
    private accountViews: AccountView[] = [];

    constructor(private config: Config) {
        this.box = blessed.box({
            top: 7,
            left: 'center',
            width: '100%',
            height: 20,
            tags: true,
            label: {text: `{bold}Accounts ${MAX_VISIBLE_ACCOUNTS}/${this.config.accounts.length}{/}`, side: 'left'},
            border: {
                type: 'line'
            },
            style: {
                bg: 'black',
                border: {
                    fg: 'white',
                    bold: true,
                },
            }
        });

        this.config.accounts.forEach((accountId, index) => {
            this.accountViews.push(new AccountView(
                this.box,
                index,
                Math.min(this.config.accounts.length, MAX_VISIBLE_ACCOUNTS)
            ));
        })

    }

    get element() {
        return this.box;
    }

    private createAccountViewData(state: any): AccountData[] {
        const currentAccountIndex = selectCurrentAccountIndex(state);
        const accountsMap = selectGetAccounts(state);

        const accountsArray = Object
            .keys(accountsMap)
            .map(accountId => ({
                    accountId,
                    balance: accountsMap[accountId]
                })
            );

        const startIndex = currentAccountIndex;
        const endIndex = Math.max(accountsArray.length - startIndex, startIndex + MAX_VISIBLE_ACCOUNTS);
        const visibleAccounts = accountsArray.slice(startIndex, endIndex);

        console.log('createAccountViewData', startIndex, endIndex);

        return visibleAccounts.map(account => ({
            id: account.accountId,
            balance: account.balance,
            transactions: []
        }));
    }

    public update(state: any) {
        const currentAccountIndex = selectCurrentAccountIndex(state);
        const accountData = this.createAccountViewData(state);

        console.log('update', currentAccountIndex, accountData);

        // this.accountViews.forEach((view, i) => {
        //     const accountIndex = i + currentAccountIndex;
        //     view.updateView(
        //         state,
        //         accountIndex < accountData.length ? accountData[accountIndex] : null
        //     );
        // });
    }

}
