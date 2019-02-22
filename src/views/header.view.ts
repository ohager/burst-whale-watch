import * as blessed from "neo-blessed"
import {View} from "./view";
import {author, version} from "../../package.json";


export class HeaderView implements View {
    private readonly box: any;
    private leftText: any;
    private rightText: any;

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

    get element() { return this.box; }

    update(state:any) {
        let line = 0;
        let target = this.leftText;
        target.setLine(line, `Header: ${state}`);
    }
}
