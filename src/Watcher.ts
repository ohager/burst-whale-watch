import {BehaviorSubject, interval, Subscription, PartialObserver} from "rxjs"

export class Watcher {
    private intervalSubscription: Subscription;
    private source: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private subscriptions: Array<Subscription> = [];


    public start(intervalSeconds: number): Watcher {
        const watcher = new Watcher();
        this.intervalSubscription = interval(intervalSeconds * 1000)
             .subscribe(_ => this.source.next(_.toString(10)));

        return watcher;
    }

    public subscribe(observer: (value:string) => void): Subscription {
        const subscription = this.source.subscribe(observer);
        this.subscriptions.push(subscription);
        return subscription;
    }

    public destroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.intervalSubscription.unsubscribe();
    }

}
