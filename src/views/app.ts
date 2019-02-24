import * as Stappo from "stappo";
import {Scene} from "./scene";
import {HeaderView} from "./header.view";
import {BrsCollector} from "../collectors/brs.collector";
import {Config} from "../config";
import {Store} from "../../typings/stappo/store";
import {PoloniexCollector} from "../collectors/poloniex.collector";

const getInitialState = () => ({
    brs: {
        isLoading: true,
        total: null,
        accounts: null,
    },
    exchange: {
        isLoading: true,
        BTC_BURST: null,
        USD_BTC: null,
    }
});


export class App {
    private scene: Scene = new Scene();
    private brsCollector: BrsCollector;
    private poloniexCollector: PoloniexCollector;
    private storeListenerId: number;
    private store: Store;

    constructor(private config: Config) {
    }

    private initialize() {
        this.store = new Stappo();
        this.store.update(getInitialState);
        this.storeListenerId = this.store.listen(this.scene.render.bind(this.scene));

        this.brsCollector = new BrsCollector(this.store, this.config);
        this.poloniexCollector = new PoloniexCollector(this.store);

        this.scene.addView("header", new HeaderView());
    }

    public start(onExit) {
        this.initialize();

        this.scene.onExit(({reason, detail}) => {
            this.stop();
            onExit(reason, detail);
        });

        this.scene.render(getInitialState()); // initial

        this.brsCollector.start();
        this.poloniexCollector.start();
    }

    public stop() {
        this.store.unlisten(this.storeListenerId);
        this.brsCollector.stop();
        this.poloniexCollector.stop();
        this.scene.destroy();
    }

}
