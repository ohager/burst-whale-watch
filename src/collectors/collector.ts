import {Store} from "../../typings/stappo/store";


export abstract class Collector{

    protected constructor(protected store:Store) {}

    public start(){
        this.onStart();
    }

    protected abstract onStart();
    protected abstract onStop();

    public stop(){
        this.onStop();
    }

    protected update(fieldName:string, data:any){
        this.store.update( () => ({
            [fieldName]: data
        }))
    }
}
