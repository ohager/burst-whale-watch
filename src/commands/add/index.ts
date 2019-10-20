import {Config} from "../../config";
import {ApiSettings, composeApi} from "@burstjs/core";
import {convertNumericIdToAddress, convertAddressToNumericId, isBurstAddress} from "@burstjs/util";

exports.command = 'add <accounts...>';

exports.describe = 'Add one or more accounts to watcher';

exports.builder = () => {
};

async function validateAccounts(accounts: string[]) {

    const {peer} = await Config.load();
    const api = composeApi(new ApiSettings(peer, '/burst'));

    return accounts.filter(async (account) => {
        try {
            let accountId = account;
            if(isBurstAddress(account)){
                accountId = convertAddressToNumericId(account)
            }
            await api.account.getAccount(accountId);
            return true;
        } catch (e) {
            console.error(`Account ${account} is invalid - ignored`);
            return false;
        }
    });
}

exports.handler = async (argv) => {
    const validAccounts = await validateAccounts(argv.accounts);
    const updatedConfig = await Config.addAccounts(validAccounts);

    console.log(`Account(s) added successfully
These are your registered accounts:

${updatedConfig.accounts.map((id, i) => `\n${i + 1}. ${id} (${convertNumericIdToAddress(id)})`)}
    
    `);

};
