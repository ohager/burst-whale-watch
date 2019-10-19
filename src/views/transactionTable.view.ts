import * as blessed from "neo-blessed"
import {View} from "./view";
import {
    selectIsLoadingTransactions
} from "../state/selectors";
import {Transaction} from "@burstjs/core";
import {convertBurstTimeToDate, convertNQTStringToNumber, } from "@burstjs/util";
import {LOADING_TEXT} from "../constants";
import chalk from "chalk";

export interface AccountData {
    id: string,
    balance: string,
    transactions: Transaction[]
}

export class TransactionTableView implements View {
    private readonly table: any;
    private loadingText: any;
    private titleText: any;

    constructor(private parentView: any) {

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
            height: 'shrink',
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


    public update(state: any, accountId: string, transactions: Transaction[],) {
        const isLoading = selectIsLoadingTransactions(state);

        if (isLoading) {
            this.loadingText.setLine(0, LOADING_TEXT);
            this.loadingText.show();
            this.titleText.hide();
            this.table.hide();
            return;
        }
        this.loadingText.hide();

        this.titleText.setLine(0, 'Most recent transactions');
        this.titleText.show();

        this.table.show();

        let data = [
            ['Id', 'Date', 'Amount', 'Receiver/Sender'],
        ].concat(this.getPrintableTransactions(accountId, transactions));

        this.table.setData(data);
    }

    private getRecipientSenderId(accountId: string, t: Transaction): string {

        const accountAddress = t.sender === accountId ? t.recipientRS : t.senderRS;
        if(!accountAddress) return '-';
        return accountAddress.replace('BURST-', '');
    }

    private getAmount(accountId: string, transaction: Transaction): string {
        return transaction.sender === accountId
            ? chalk.red(`-${convertNQTStringToNumber(transaction.amountNQT).toFixed(3)}`)
            : chalk.green(`${convertNQTStringToNumber(transaction.amountNQT).toFixed(3)}`)
    }

    private getPrintableTransactions(accountId: string, transactions: Transaction[]): any[] {
        const visibleTransactions = transactions.slice(0, Math.floor(this.parentView.height / 3));
        return visibleTransactions.map(t => ([
                t.transaction,
                convertBurstTimeToDate(t.timestamp).toLocaleDateString(),
                this.getAmount(accountId, t),
                this.getRecipientSenderId(accountId, t)
            ])
        )
    }
}
