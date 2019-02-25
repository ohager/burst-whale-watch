import * as blessed from "neo-blessed"
import {View} from "./view";
import {AccountData, AccountView} from "./account.view";
import {Config} from "../config";
import {selectGetAccounts} from "../state/selectors";

const MAX_VISIBLE_ACCOUNTS = 3;

interface AccountListViewState {
    firstVisibleAccountIndex: number
}

export class AccountListView implements View {
    private readonly box: any;
    private accountViews: AccountView[] = [];
    private state: AccountListViewState;

    constructor(private config:Config) {

        this.state = {
            firstVisibleAccountIndex: 0
        };

        this.box = blessed.box({
            top: 7,
            left: 'center',
            width: '100%',
            height: 20,
            tags: true,
            label: {text: `{bold}Accounts{/}`, side: 'left'},
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

        this.config.accounts.forEach((accountId,index) => {
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

    private createAccountViewData(state:any): AccountData[]{
        const accountsMap = selectGetAccounts(state);

        const accountsArray = Object.keys(accountsMap).map(accountId => ({
            accountId,
            balance: accountsMap[accountId]
        }));

        const startIndex = this.state.firstVisibleAccountIndex;
        const endIndex = Math.min(accountsArray.length - startIndex, startIndex + MAX_VISIBLE_ACCOUNTS);
        const visibleAccounts = accountsArray.slice(startIndex, endIndex);

        return visibleAccounts.map(account => ({
            id: account.accountId,
            balance: account.balance,
            transactions: []
        }));
    }

    public update(state: any) {

        const accountData = this.createAccountViewData(state);

        this.accountViews.forEach( (view,i) => {
            const accountIndex = i + this.state.firstVisibleAccountIndex;
            view.updateView(
                state,
                accountIndex < accountData.length? accountData[accountIndex] : null
            );
            view.update(state)
        } );
    }

}
