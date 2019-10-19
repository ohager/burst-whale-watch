import * as inquirer from 'inquirer'
import {ApiSettings, composeApi} from "@burstjs/core";
import {HttpError} from "@burstjs/http";

export class ConfigDialog {

    private static __getErrorMessage(e: any) {
        if (e instanceof HttpError) {
            return e.message;
        }
        return typeof e === 'string' ? e : JSON.stringify(e);
    }

    private static async validatePeer(peer: string) {
        const api = composeApi(new ApiSettings(peer, '/burst'));

        try {
            const bottomBar = new inquirer.ui.BottomBar();
            bottomBar.updateBottomBar('Contacting peer...');
            await api.network.getBlockchainStatus();
            bottomBar.updateBottomBar('ok');
            return true;
        } catch (e) {
            return ConfigDialog.__getErrorMessage(e);
        }

    }

    private askPeer = async (): Promise<string> => {

        const {peer} = await inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'peer',
                    message: 'Which peer do you wanna use?',
                    default: 'https://wallet1.burst-team.us:2083',
                    validate: ConfigDialog.validatePeer
                }]
            );
        return peer;
    };

    private static async validateAccount(peer, accountId: string): Promise<boolean | string> {
        const api = composeApi(new ApiSettings(peer, '/burst'));
        try {
            const bottomBar = new inquirer.ui.BottomBar();
            bottomBar.updateBottomBar('Validating Account Id');
            await api.account.getAccount(accountId);
            bottomBar.updateBottomBar('Ok');
            return true
        } catch (e) {
            return ConfigDialog.__getErrorMessage(e);
        }
    }

    private askAccount = async (peer: string, accounts: Array<string> = []): Promise<Array<string>> => {

        const {account, askAgain} = await inquirer
            .prompt([

                {
                    type: 'input',
                    name: 'account',
                    message: "Enter an Account to watch (numeric id)?",
                    validate: ConfigDialog.validateAccount.bind(null, peer)
                },
                {
                    type: 'confirm',
                    name: 'askAgain',
                    message: 'Want to enter another Account (just hit enter for YES)?',
                    default: true
                }
            ]);

        accounts.push(account);
        if (askAgain) await this.askAccount(peer, accounts);

        return accounts;
    };

    public async run() {
        const peer = await this.askPeer();
        const accounts = await this.askAccount(peer);

        return {
            peer,
            accounts
        }
    }
}
