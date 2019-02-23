export interface Store {
    update(reducer: (state:any)=>void): void
    listen(callback: (state:any)=>void): number
    unlisten(listenerId:number): void
    get() : any
}
