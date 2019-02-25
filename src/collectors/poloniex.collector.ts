import {Collector} from './collector';
import {Store} from '../../typings/stappo/store';
import {interval, Subscription} from 'rxjs';
import {map, mergeMap, startWith} from 'rxjs/operators';
import {HttpImpl, Http, HttpResponse} from '@burstjs/http'

const fetchTicker = async (httpClient: Http): Promise<HttpResponse> =>
    await httpClient.get('/public?command=returnTicker');


const relevantCurrencyPairs = (data: HttpResponse): object => {
    const {BTC_BURST, USDT_BTC} = data.response;
    return {
        BTC_BURST,
        USDT_BTC
    }
};


export class PoloniexCollector extends Collector {
    private http = new HttpImpl('https://poloniex.com');
    private subscription: Subscription;

    constructor(store: Store) {
        super(store);
    }

    private subscribeTicker() {
        this.subscription = interval(5 * 1000)
            .pipe(
                startWith(0),
                mergeMap(() => fetchTicker(this.http)),
                map(relevantCurrencyPairs)
            ).subscribe((data) => {
                this.update('exchange', {
                    ...data,
                    isLoading: false,
                });
            });
    }

    private unsubscribeTicker() {
        this.subscription.unsubscribe();
    }

    protected onStart() {
        this.subscribeTicker();
    }

    protected onStop() {
        this.unsubscribeTicker()
    }

}
