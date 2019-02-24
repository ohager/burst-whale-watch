import * as blessed from "neo-blessed"
import {View} from "./view";
import {author, version} from "../../package.json";
import {
    selectGetBtcBurst,
    selectGetTotalBalance, selectGetUsdBtc,
    selectIsLoadingBRS,
    selectIsLoadingExchange
} from "../state/selectors";

const LOADING_TEXT = '(loading...)';

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
            label: {text: `{bold}BURST Whale Watch ${version} by ${author}{/}`, side: 'right'},
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

    public updateRight(state: any) {
        let target = this.rightText;
        const isLoading = selectIsLoadingExchange(state);

        if (isLoading) {
            target.setLine(0, `BTC/BURST: ${LOADING_TEXT}`);
            target.setLine(1, `USD/BTC: ${LOADING_TEXT}`);
            return;
        }

        const btcBurst = selectGetBtcBurst(state);
        const usdBtc = selectGetUsdBtc(state);

        target.setLine(0, `BTC/BURST: ${btcBurst}`);
        target.setLine(1, `USD/BTC: ${usdBtc}`);
    }

    private updateLeft(state: any) {
        let target = this.leftText;
        const isLoading = selectIsLoadingBRS(state);

        if (isLoading) {
            target.setLine(0, `Total: ${LOADING_TEXT}`);
            return;
        }

        const totalBalance = selectGetTotalBalance(state);
        target.setLine(0, `Total: ${totalBalance} BURST`);

    }


}
