import * as Stappo from "stappo";
import {Scene} from "./scene";
import {HeaderView} from "./header.view";
import {BrsCollector} from "../collectors/brs.collector";
import {Config} from "../config";
import {Store} from "../../typings/stappo/store";

const getInitialState = () =>({
    brs: {
        isLoading: true,
        total: null,
        accounts: null,
    },
    exchange: {
      burst_btc: null,
      btc_usd: null,
      btc_eur: null
    }
});


export class App {
    private scene: Scene = new Scene();
    private brsCollector: BrsCollector;
    private storeListenerId: number;
    private store: Store;

    constructor(private config:Config){}

    private initCollectors(){
        this.store = new Stappo();
        this.store.update(getInitialState);
        this.storeListenerId = this.store.listen(this.scene.render.bind(this.scene));
        this.brsCollector = new BrsCollector(this.store, this.config);
    }

    private initViews(){
        this.scene.addView("header", new HeaderView());
    }

    public start(onExit) {
        this.initCollectors();
        this.initViews();

        this.scene.onExit(({reason, detail}) => {
            this.stop();
            onExit(reason, detail);
        });

        this.scene.render(getInitialState()); // initial

        this.brsCollector.start();
    }

    public stop(){
        this.brsCollector.stop();
        this.scene.destroy();
        this.store.unlisten(this.storeListenerId)
    }

}
