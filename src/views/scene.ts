import * as blessed from "neo-blessed";
import {version} from "../../package.json"
import {View} from "./view";

export interface ExitEvent {
    readonly reason: string;
    readonly detail: string;
}

export class Scene {
    private autoCloseInterval: NodeJS.Timeout;
    private views: {};
    private onExitFn: (e:ExitEvent) => void;
    private readonly screen: any;
    private quitDialog: any;

    constructor() {
        this.autoCloseInterval = null;
        this.views = {};
        this.onExitFn = () => {};

        this.screen = blessed.screen({
                smartCSR: true,
                title: `BURST Whale Watcher ${version}`,
                cursor: {
                    artificial: true,
                    shape: 'line',
                    blink: false,
                },
            }
        );

        this.screen.enableInput();

        // Quit on Escape, q, or Control-C.
        this.screen.key(['escape', 'q', 'C-c'], () => {
            this.showQuitDialog()
        });

        process.once('unhandledRejection', (e) => {
            this.__handleException(e)
        });

    }

    showQuitDialog() {

        if (!this.quitDialog) {

            this.quitDialog = blessed.box({
                parent: this.screen,
                hidden: false,
                top: 'center',
                left: 'center',
                width: 'shrink',
                height: 5,
                tags: true,
                keys: true,
                mouse: true,
                shadow: true,
                transparent: true,
                label: {text: `Quit?`, side: 'left'},
                border: {
                    type: 'line',
                    fg: 'red'
                },
                style: {
                    fg: 'white',
                    bg: 'red',
                }
            });

            this.quitDialog.key(['escape', 'n', 'enter', 'y', 'q'], ch => {

                switch (ch) {
                    case 'q':
                    case 'y': {
                        this.onExitFn({reason: 'quit', detail: null});
                        break;
                    }
                    default: {
                        this.quitDialog.hide();
                        this.screen.render();
                    }
                }
            });
        }

        this.quitDialog.focus();
        this.quitDialog.setLine(1, " Do you really want to quit? {grey-fg}(press y/n){/} ");
        this.quitDialog.show();
        this.screen.render();
    }

    public addView(name:string, view:View) {
        this.screen.append(view.element);
        this.views[name] = view;
    }

    public view(name): View {
        return this.views[name];
    }

    public render(state:any) {
        try {
            Object.getOwnPropertyNames(this.views).forEach(p => {
                this.views[p].update(state);
            });

            if (this.quitDialog) {
                this.quitDialog.setFront();
            }

            this.screen.render();
        } catch (e) {
            this.__handleException(e);
        }

    }

    public destroy() {
        this.screen.destroy();
        this.views = {};
    }

    public onExit(callback: (exitEvent: ExitEvent) => void) {
        this.onExitFn = callback;
    }

    __handleException(e) {
        this.destroy();
        this.onExitFn({reason: 'error', detail: e});
    }
}
