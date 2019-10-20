// app
export const selectCurrentAccountIndex = (state:any): number => state.app.currentAccountIndex;

// balances
export const selectGetAccountBalances = (state: any): any => state.balances.accounts;
export const selectGetTotalBalance = (state: any): string => state.balances.total.toFixed(3);
export const selectIsLoadingBalances = (state: any): boolean => state.balances.isLoading;

// transactions
export const selectGetAccountTransactions = (state: any): any => state.transactions.accounts;
export const selectIsLoadingTransactions = (state: any): boolean => state.transactions.isLoading;

//market
export const selectGetUsdBurst = (state: any): string =>
    Number.parseFloat(state.market.price_usd).toFixed(3);
export const selectGetBtcBurst = (state: any): string => state.market.price_btc;
export const selectGetBtcBurstChange = (state: any): string =>
    Number.parseFloat(state.market.percent_change_24h).toFixed(4);
export const selectIsLoadingMarketInfo = (state: any): boolean => state.market.isLoading;
export const selectInfoSourceName = (state: any): string => state.market.name;

export const selectGetBalanceInBtc = (state: any): string => {

    if (selectIsLoadingMarketInfo(state)
        || selectIsLoadingBalances(state)
    ) {
        return null;
    }

    const totalBurstString = selectGetTotalBalance(state);
    const totalBurst = Number.parseFloat(totalBurstString);
    const btcBurst = Number.parseFloat(selectGetBtcBurst(state));

    return (totalBurst * btcBurst).toFixed(4);
};

export const selectGetBalanceInUsd = (state: any): string => {

    if (selectIsLoadingMarketInfo(state)
        || selectIsLoadingBalances(state)
    ) {
        return null;
    }

    const totalBurstString = selectGetTotalBalance(state);
    const totalBurst = Number.parseFloat(totalBurstString);
    const usdBurst = Number.parseFloat(selectGetUsdBurst(state));
    return (totalBurst * usdBurst).toFixed(4);
};
