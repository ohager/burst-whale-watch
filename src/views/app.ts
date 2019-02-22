import {Scene} from "./scene";
import {Header} from "./header.view";
import {Watcher} from "../watcher";
import {Config} from "../config";

export class App {
    private scene: Scene = new Scene();
    private watcher: Watcher;

    constructor(private config:Config){
        this.watcher = new Watcher(config);
    }

    public start(onExit) {

        this.scene.addView("header", new Header());

        this.scene.onExit(({reason, detail}) => {
            this.stop();
            onExit(reason, detail);
        });

        //this.watcher.subscribe(this.scene.render.bind(this.scene));
        this.watcher.start(1);
    }

    public stop(){
        this.watcher.destroy();
        this.scene.destroy();
    }

}
