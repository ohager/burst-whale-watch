import * as Stappo from "stappo";
import {Scene} from "./scene";
import {HeaderView} from "./header.view";
import {BrsCollector} from "../collectors/brs.collector";
import {Config} from "../config";
import {Store} from "../../typings/stappo/store";
import {AccountListView} from "./accountList.view";
import {CmcCollector} from '../collectors/cmc.collector';

const getInitialState = () => ({
    app:{
        currentAccountIndex: 0,
    },
    balances:{
        total: "",
        isLoading: true,
        accounts: {}
    },
    transactions:{
        isLoading: true,
        accounts: {}
    },
    market: {
        name: 'coinmarketcap.com',
        isLoading: true,
        price_usd: '...',
        price_btc: '...',
        percent_change_24h: '...',
    }
});


export class App {
    private scene: Scene;
    private brsCollector: BrsCollector;
    private cmcCollector: CmcCollector;
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
        this.cmcCollector = new CmcCollector(this.store);

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
        this.cmcCollector.start();
    }

    public stop() {
        this.store.unlisten(this.storeListenerId);
        this.brsCollector.stop();
        this.cmcCollector.stop();
        this.scene.destroy();
    }

}
