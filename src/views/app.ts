import * as Stappo from "stappo";
import {Scene} from "./scene";
import {HeaderView} from "./header.view";
import {BrsCollector} from "../collectors/brs.collector";
import {Config} from "../config";
import {Store} from "../../typings/stappo/store";
import {PoloniexCollector} from "../collectors/poloniex.collector";
import {AccountListView} from "./accountList.view";


export class ExchangeData{
    public last: "";
    public lowestAsk: "";
    public highestBid: "";
    public percentChange: "";
    public baseVolume: "";
    public quoteVolume: "";
    public isFrozen: "";
    public high24hr: "";
    public low24hr: ""
}


const getInitialState = () => ({
    app:{
        currentAccountIndex: 0
    },
    brs: {
        isLoading: true,
        total: "",
        accounts:{},
    },
    exchange: {
        isLoading: true,
        BTC_BURST: new ExchangeData(),
        USD_BTC: new ExchangeData(),
    }
});


export class App {
    private scene: Scene;
    private brsCollector: BrsCollector;
    private poloniexCollector: PoloniexCollector;
    private storeListenerId: number;
    private store: Store;

    constructor(private config: Config) {
    }

    private initialize() {
        this.store = new Stappo();
        this.scene = new Scene(this.store, this.config);

        this.store.update(getInitialState);
        this.storeListenerId = this.store.listen(this.scene.render.bind(this.scene));

        this.brsCollector = new BrsCollector(this.store, this.config);
        this.poloniexCollector = new PoloniexCollector(this.store);

        this.scene.addView("header", new HeaderView());
        this.scene.addView("accountList", new AccountListView(this.config));
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
