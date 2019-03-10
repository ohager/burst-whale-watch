import {Config} from "../../config";
import {ApiSettings, composeApi} from "@burstjs/core";

exports.command = 'add <accounts...>';

exports.describe = 'Add one or more accounts to watcher';

exports.builder = () => {
};

async function validateAccounts(accounts: string[]) {

    const {peer} = await Config.load();
    const api = composeApi({
        nodeHost: peer,
        apiRootUrl: '/burst'
    });

    return accounts.filter(async (account) => {
        try {
            await api.account.getAccount(account);
            return true;
        } catch (e) {
            console.error(`Account ${account} is invalid - ignored`);
            return false;
        }
    });
}

exports.handler = async (argv) => {
    const validAccounts = await validateAccounts(argv.accounts);
    await Config.updateAccounts(validAccounts);

};
