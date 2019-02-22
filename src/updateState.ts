import {Balance} from '@burstjs/core'
import {convertNQTStringToNumber} from '@burstjs/util'


const sum = (previousValue: number, balance: Balance) => previousValue + convertNQTStringToNumber(balance.balanceNQT);

export class UpdateState {

    constructor(private balances: Array<Balance>) {

    }

    getBalanceSum(): number {
        return this.balances.reduce(sum, 0)
    }

}
