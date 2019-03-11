import chalk from "chalk"
import * as blessed from "neo-blessed"
import {View} from "./view";
import {
    selectExchangeName,
    selectGetBalanceInBtc, selectGetBalanceInUsd,
    selectGetBtcBurst, selectGetBtcBurstChange,
    selectGetTotalBalance, selectGetUsdBtc, selectGetUsdBtcChange,
    selectIsLoadingBalances,
    selectIsLoadingExchange
} from "../state/selectors";
import {LOADING_TEXT} from "../constants";

export class HeaderView implements View {
    private readonly box: any;
    private readonly leftText: any;
    private readonly rightText: any;

    constructor() {

        this.box = blessed.box({
            top: 0,
            left: 'center',
            width: '100%',
            height: 6,
            tags: true,
            label: {text: `{bold}BURST Whale Watch by ohager{/}`, side: 'right'},
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
            width: '40%',
            tags: true,
            style: {
                fg: 'yellow',
                bold: true,
                bg: 'black',
                border: {
                    fg: '#ffffff'
                },
            }
        };

        this.leftText = blessed.text({
            ...textBaseSettings,
            left: 0,
        });

        this.rightText = blessed.text({
            ...textBaseSettings,
            left: '50%+1',
        });

    }

    get element() {
        return this.box;
    }

    public update(state: any) {

        this.updateLeft(state);
        this.updateRight(state);
    }

    private static formatChangeText(changeValue: string){
        let formatted;
        if(changeValue.indexOf('-') > -1){
            formatted = chalk.redBright(changeValue.replace('-', '↓ '))
        }
        else{
            formatted = chalk.greenBright('↑ ' + changeValue)
        }

        return formatted + '%'
    }

    public updateRight(state: any) {
        let target = this.rightText;
        const isLoading = selectIsLoadingExchange(state);
        const exchangeName = selectExchangeName(state);

        if (isLoading) {
            target.setLine(0, `BTC/BURST: ${LOADING_TEXT}`);
            target.setLine(1, `USD/BTC: ${LOADING_TEXT}`);
            return;
        }

        const btcBurst = selectGetBtcBurst(state);
        const btcBurstChange = selectGetBtcBurstChange(state);
        const usdBtc = selectGetUsdBtc(state);
        const usdBtcChange = selectGetUsdBtcChange(state);

        target.setLine(0, `BTC/BURST: ${btcBurst} ${HeaderView.formatChangeText(btcBurstChange)}`);
        target.setLine(1, `USD/BTC: ${usdBtc} ${HeaderView.formatChangeText(usdBtcChange)}`);
        target.setLine(2, chalk.gray(`Source: ${exchangeName}`));
    }

    private updateLeft(state: any) {
        let target = this.leftText;
        const isLoading = selectIsLoadingBalances(state);

        if (isLoading) {
            target.setLine(0, `Total [BURST]: ${LOADING_TEXT}`);
            target.setLine(1, `Total [BTC]: ${LOADING_TEXT}`);
            target.setLine(2, `Total [USD]: ${LOADING_TEXT}`);
            return;
        }

        const totalBalance = selectGetTotalBalance(state);
        const totalBalanceBtc = selectGetBalanceInBtc(state);
        const totalBalanceUsd = selectGetBalanceInUsd(state);
        target.setLine(0, `Total [BURST]: ${totalBalance}`);
        target.setLine(1, `Total [BTC]: ${totalBalanceBtc}`);
        target.setLine(2, `Total [USD]: ${totalBalanceUsd}`);

    }


}
