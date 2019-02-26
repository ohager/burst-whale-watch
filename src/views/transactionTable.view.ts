import * as blessed from "neo-blessed"
import {View} from "./view";
import {
    selectIsLoadingTransactions
} from "../state/selectors";
import {Transaction} from "@burstjs/core";
import {convertNumericIdToAddress, convertNQTStringToNumber} from "@burstjs/util";
import {LOADING_TEXT} from "../constants";

export interface AccountData {
    id: string,
    balance: string,
    transactions: Transaction[]
}

export class TransactionTableView implements View {
    private readonly table: any;
    private loadingText: any;
    private titleText: any;

    constructor(parentView: any) {

        this.loadingText = blessed.text({
            parent: parentView,
            top: 'center',
            left: 'center',
            tags: true,
            style: {
                fg: 'gray',
                bold: true,
                bg: 'black',
                border: {
                    fg: '#ffffff'
                },
            }
        });


        this.titleText = blessed.text({
            parent: parentView,
            top: 3,
            right: 0,
            tags: true,
            style: {
                fg: 'gray',
                bold: true,
                bg: 'black',
                border: {
                    fg: '#ffffff'
                },
            }
        });

        this.table = blessed.table({
            parent: parentView,
            top: 4,
            left: 'center',
            data: null,
            border: 'line',
            align: 'center',
            tags: true,
            width: '100%-2',
            style: {
                border: {
                    fg: 'white'
                },
                header: {
                    fg: 'white',
                    bold: true
                },
                cell: {
                    fg: 'white'
                }
            }
        });

        this.table.hide();
    }

    get element() {
        return this.table;
    }

    public update(state: any, transactions: Transaction[]) {
        const isLoading = selectIsLoadingTransactions(state);

        if(isLoading){
            this.loadingText.setLine(0,LOADING_TEXT);
            this.loadingText.show();
            this.titleText.hide();
            this.table.hide();
            return;
        }
        this.loadingText.hide();

        this.titleText.setLine(0,'Most recent transactions');
        this.titleText.show();

        this.table.show();

        let data = [
            ['Id', 'Date', 'Amount', 'Receiver/Sender'],
            ['Elephant', 'Apple', '1:00am', 'One'],
            ['Bird', 'Orange', '2:15pm', 'Two'],
            ['T-Rex', 'Taco', '8:45am', 'Three'],
            ['Mouse', 'Cheese', '9:05am', 'Four']
        ];

        data[1][0] = '{red-fg}' + data[1][0] + '{/red-fg}';

        this.table.setData(data);
    }

}
