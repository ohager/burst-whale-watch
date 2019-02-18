import * as path from "path";
import {readJsonSync, writeJsonSync} from "fs-extra";
import {existsSync} from "fs";
import {union} from "lodash"

const configFile = path.join(__filename, '../../../', 'config.json');

function addAccounts(accounts: Array<String>) {
    if (!existsSync(configFile)) {
        writeJsonSync(configFile, {accounts: accounts || []});
        return;
    }

    const savedConfig = readJsonSync(configFile);
    const updatedConfig = {
        ...savedConfig,
        accounts: union(savedConfig.accounts, accounts)
    };
    writeJsonSync(configFile, updatedConfig)
}


exports.command = 'add <accounts...>';

exports.describe = 'Add one or more accounts to watcher';

exports.builder = () => {};

exports.handler = (argv) => {
    addAccounts(argv.accounts);
};
