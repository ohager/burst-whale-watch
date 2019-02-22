import * as Stappo from "stappo";
import {Scene} from "./scene";
import {HeaderView} from "./header.view";
import {BrsCollector} from "../collectors/brs.collector";
import {Config} from "../config";

export class App {
    private scene: Scene = new Scene();
    private brsCollector: BrsCollector;

    constructor(private config:Config){}

    private initCollectors(){
        const store = new Stappo();
        this.brsCollector = new BrsCollector(store, this.config);
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

        this.scene.render(null); // initial

        const renderer = this.scene.render.bind(this.scene);
        this.brsCollector.start(renderer);
    }

    public stop(){
        this.brsCollector.stop();
        this.scene.destroy();
    }

}
