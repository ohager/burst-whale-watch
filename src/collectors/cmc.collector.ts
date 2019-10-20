import {Collector} from './collector';
import {Store} from '../../typings/stappo/store';
import {interval, Subscription} from 'rxjs';
import {map, mergeMap, startWith} from 'rxjs/operators';
import {HttpImpl, Http, HttpResponse} from '@burstjs/http'
import {CMC_POLLING_SEC} from "../constants";

const fetchTicker = async (httpClient: Http): Promise<HttpResponse> =>
    await httpClient.get('v1/ticker/burst');


const relevantTickerInfo = (data: HttpResponse) : object => {
    const {price_usd, price_btc, percent_change_24h} = data.response[0];
    return {
        price_usd,
        price_btc,
        percent_change_24h
    }
};

export class CmcCollector extends Collector {
    private http = new HttpImpl('https://api.coinmarketcap.com');
    private subscription: Subscription;

    constructor(store: Store) {
        super(store);
    }

    private subscribeTicker() {
        this.subscription = interval(CMC_POLLING_SEC * 1000)
            .pipe(
                startWith(0),
                mergeMap(() => fetchTicker(this.http)),
                map(relevantTickerInfo)
            ).subscribe((data) => {
                this.update('market', {
                    ...data,
                    isLoading: false,
                });
            });
    }

    private unsubscribeTicker() {
        if(this.subscription)
            this.subscription.unsubscribe();
    }

    protected onStart() {
        this.subscribeTicker();
    }

    protected onStop() {
        this.unsubscribeTicker()
    }

}
