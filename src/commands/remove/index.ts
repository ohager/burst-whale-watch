import {Config} from "../../config";
import {RemoveDialog} from "./removeDialog";

exports.command = 'remove';

exports.describe = 'Remove one or more accounts';

exports.builder = () => {};

exports.handler = async () => {
    const {accounts} = await Config.load();
    const dialog = new RemoveDialog();
    const accountsToBeRemoved = await dialog.run(accounts);
    await Config.removeAccounts(accountsToBeRemoved);
};
