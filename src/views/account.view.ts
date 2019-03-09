import * as blessed from "neo-blessed"
import {View} from "./view";
import {
    selectGetAccountTransactions,
    selectIsLoadingExchange, selectIsLoadingTransactions
} from "../state/selectors";
import {Transaction} from "@burstjs/core";
import {convertNumericIdToAddress, convertNQTStringToNumber} from "@burstjs/util";
import {LOADING_TEXT} from "../constants";
import {TransactionTableView} from "./transactionTable.view";

export interface AccountData {
    index: number,
    id: string,
    balance: string,
    transactions: Transaction[]
}

export class AccountView implements View {
    private readonly box: any;
    private readonly text: any;
    private transactionTable: TransactionTableView;

    constructor(parentView: any, index:number, total:number) {

        const width = 100/total;
        const left = `${index*width}%+1`;

        this.box = blessed.box({
            parent:parentView,
            top: 2,
            left,
            width: `${width}%-4`,
            height: '80%',
            tags: true,
            label: {text: `{bold}${LOADING_TEXT}{/}`, side: 'left'},
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

        const textBaseSettings = {
            parent: this.box,
            top: 0,
            width: '100%-2',
            tags: true,
            style: {
                fg: 'white',
                bold: true,
                bg: 'black',
                border: {
                    fg: '#ffffff'
                },
            }
        };

        this.text = blessed.text({
            ...textBaseSettings,
            left: 0,
        });

        this.transactionTable = new TransactionTableView(this.box)
    }

    get element() {
        return this.box;
    }

    public update(state:any, accountData:AccountData){

        const isLoading = selectIsLoadingTransactions(state);

        if (isLoading || !accountData) {
            return;
        }

        const accountId = accountData.id;
        const address = convertNumericIdToAddress(accountId);
        const balanceBurst = convertNQTStringToNumber(accountData.balance).toFixed(3);

        let startLine = 1;
        this.box.setLabel({text: `(${accountData.index}) {bold}${address}{/}`, side: 'left'});
        this.text.setLine(startLine, ` Account: ${accountId}`);
        this.text.setLine(++startLine, ` Total [BURST]: ${balanceBurst}`);

        const accountTransactions = selectGetAccountTransactions(state);

        this.transactionTable.update(state, accountId, accountTransactions[accountId]);

    }

}
