export const selectGetTotalBalance = (state:any) : string => state.brs.total.toFixed(3)
export const selectIsLoading = (state:any) : boolean => state.brs.isLoading
