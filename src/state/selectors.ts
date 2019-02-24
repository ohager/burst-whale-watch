// brs
export const selectGetTotalBalance = (state:any) : string => state.brs.total.toFixed(3);
export const selectIsLoadingBRS = (state:any) : boolean => state.brs.isLoading;

//exchange
export const selectGetUsdBtc = (state:any) : string => state.exchange.USDT_BTC.last;
export const selectGetBtcBurst = (state:any) : string => state.exchange.BTC_BURST.last;
export const selectIsLoadingExchange = (state:any) : boolean => state.exchange.isLoading;
