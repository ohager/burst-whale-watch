import {Config} from "../../config";

exports.command = 'add <accounts...>';

exports.describe = 'Add one or more accounts to watcher';

exports.builder = () => {};

exports.handler = async (argv) => {
    await Config.updateAccounts(argv.accounts);
};
