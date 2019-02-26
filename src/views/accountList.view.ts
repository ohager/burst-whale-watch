import * as blessed from "neo-blessed"
import {View} from "./view";
import {AccountData, AccountView} from "./account.view";
import {Config} from "../config";
import {selectCurrentAccountIndex, selectGetAccounts} from "../state/selectors";
import {MAX_VISIBLE_ACCOUNTS} from "../constants";

export class AccountListView implements View {
    private readonly box: any;
    private accountViews: AccountView[] = [];
    private numberOfAccounts: number;

    constructor(private config: Config) {
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

        this.numberOfAccounts = this.config.accounts.length;

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
        const endIndex = startIndex + MAX_VISIBLE_ACCOUNTS;
        const visibleAccounts = accountsArray.slice(startIndex, endIndex);

        return visibleAccounts.map((account, i) => ({
            index: startIndex + i + 1,
            id: account.accountId,
            balance: account.balance,
            transactions: []
        }));
    }

    private renderNavArrows(state: any) {
        const currentAccountIndex = selectCurrentAccountIndex(state);
        let line;
        if(currentAccountIndex === 0 && MAX_VISIBLE_ACCOUNTS < this.numberOfAccounts){
            line = ' '.repeat(this.box.width - 5) + '->'
        }

        if(currentAccountIndex !== 0){
            line = ' <-' + ' '.repeat(this.box.width - 4)
        }
        this.box.setLine(0, line);
    }

    public update(state: any) {
        const accountData = this.createAccountViewData(state);
        this.renderNavArrows(state);

        this.accountViews.forEach((view, i) => {
            view.updateView(state, accountData[i]);
        });

    }

}
