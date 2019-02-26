// app
export const selectCurrentAccountIndex = (state:any): number => state.app.currentAccountIndex;

// brs
export const selectGetAccounts = (state: any): any => state.brs.accounts;
export const selectGetTotalBalance = (state: any): string => state.brs.total.toFixed(3);
export const selectIsLoadingBRS = (state: any): boolean => state.brs.isLoading;

//exchange
export const selectGetUsdBtc = (state: any): string =>
    Number.parseFloat(state.exchange.USDT_BTC.last).toFixed(3);
export const selectGetBtcBurst = (state: any): string => state.exchange.BTC_BURST.last;
export const selectGetBtcBurstChange = (state: any): string =>
    Number.parseFloat(state.exchange.BTC_BURST.percentChange).toFixed(4);
export const selectGetUsdBtcChange = (state: any): string =>
    Number.parseFloat(state.exchange.USDT_BTC.percentChange).toFixed(4);


export const selectIsLoadingExchange = (state: any): boolean => state.exchange.isLoading;
export const selectExchangeName = (state: any): string => state.exchange.name;

export const selectGetBalanceInBtc = (state: any): string => {

    if (selectIsLoadingExchange(state)
        || selectIsLoadingBRS(state)
    ) {
        return null;
    }

    const totalBurstString = selectGetTotalBalance(state);
    const totalBurst = Number.parseFloat(totalBurstString);
    const btcBurst = Number.parseFloat(selectGetBtcBurst(state));
    return (totalBurst * btcBurst).toFixed(4);
};


export const selectGetBalanceInUsd = (state: any): string => {

    if (selectIsLoadingExchange(state)
        || selectIsLoadingBRS(state)
    ) {
        return null;
    }

    const balanceInBtc = Number.parseFloat(selectGetBalanceInBtc(state));
    const usdInBtc = Number.parseFloat(selectGetUsdBtc(state));

    return (balanceInBtc * usdInBtc).toFixed(4);
};
