import {Store} from "../../typings/store";


export abstract class Collector{
    private listenerId: number;

    protected constructor(protected store:Store) {}

    public start(listener:(state:any)=>void){
        this.listenerId = this.store.listen(listener);
        this.onStart();
    }

    protected abstract onStart();
    protected abstract onStop();

    public stop(){
        this.store.unlisten(this.listenerId);
        this.onStop();
    }

    protected update(fieldName:string, data:any){
        this.store.update( () => ({
            [fieldName]: data
        }))
    }
}
