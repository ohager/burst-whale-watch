import * as blessed from "neo-blessed"
import {View} from "./view";
import {
    selectIsLoadingExchange
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
    private readonly box: any;
    private readonly text: any;

    constructor(parentView: any, index:number, total:number) {

        const width = 100/total;
        const left = `${index*width}%+1`;

        this.box = blessed.box({
            parent:parentView,
            top: 0,
            left,
            width: `${width}%-4`,
            height: 10,
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

    }

    get element() {
        return this.box;
    }

    public updateView(state:any, accountData:AccountData){

        const isLoading = selectIsLoadingExchange(state);

        if (isLoading || !accountData) {
            return;
        }

        const address = convertNumericIdToAddress(accountData.id);
        const balanceBurst = convertNQTStringToNumber(accountData.balance).toFixed(3);

        let startLine = 1;
        this.box.setLabel({text: `{bold}${address}{/}`, side: 'left'});
        this.text.setLine(startLine, ` Account Id: ${accountData.id}`);
        this.text.setLine(++startLine, ` Total [BURST]: ${balanceBurst}`);
    }

    public update(state: any) {}

}
