import * as inquirer from 'inquirer'
import {convertNumericIdToAddress} from "@burstjs/util"

export class RemoveDialog {

    private askAccount = async (accounts: Array<string>): Promise<Array<string>> => {

        const {accountsToBeRemoved} = await inquirer
            .prompt([{
                    type: 'checkbox',
                    message: 'Select the accounts to be removed',
                    name: 'accountsToBeRemoved',
                    choices: accounts.map(id => `${id} (${convertNumericIdToAddress(id)})`)
                }]);

        return accountsToBeRemoved.map( accountStr => accountStr.split(' ')[0].trim() );
    };

    public async run(allAccounts) {
        return await this.askAccount(allAccounts);
    }
}
