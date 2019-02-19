import {composeApi} from "@burstjs/core";
import {convertNumericIdToAddress} from "@burstjs/util";
import {Config} from "../../config";

exports.command = '$0';

exports.describe = 'Gets Account Stats';

exports.builder = () => {
};

exports.handler = async () => {

    const {peer, accounts} = await Config.load();

    const api = composeApi({
        nodeHost: peer,
        apiRootUrl: 'burst'
    });

    const results = await Promise.all(accounts.map(api.account.getAccountBalance));

    // TODO: pass to state, which will update an UI
    console.log(results.map(({balanceNQT}, i) => (
            {
                account: accounts[i],
                accountAddress: convertNumericIdToAddress(accounts[i]),
                balanceNQT
            })
        )
    );
};
