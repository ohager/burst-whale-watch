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
        const fieldState = this.store.get()[fieldName];
        this.store.update( () => ({
            [fieldName]: {
                ...fieldState,
                ...data
            }
        }))
    }
}
