import {Collector} from "./collector";
import {Store} from "../../typings/stappo/store";

export class PoloniexCollector extends Collector{
    constructor(store:Store){
        super(store)
    }

    protected onStart() {
    }

    protected onStop() {
    }

}
