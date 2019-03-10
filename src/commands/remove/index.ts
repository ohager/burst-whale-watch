import {Config} from "../../config";
import {RemoveDialog} from "./removeDialog";
import {convertNumericIdToAddress} from "@burstjs/util";

exports.command = 'remove';

exports.describe = 'Remove one or more accounts';

exports.builder = () => {};

exports.handler = async () => {
    const {accounts} = await Config.load();
    const dialog = new RemoveDialog();
    const accountsToBeRemoved = await dialog.run(accounts);
    const updatedConfig = await Config.removeAccounts(accountsToBeRemoved);

    console.log(`Account(s) removed successfully
These are your registered accounts:

${updatedConfig.accounts.map((id, i) => `\n${i + 1}. ${id} (${convertNumericIdToAddress(id)})`)}
    
    `);

};
