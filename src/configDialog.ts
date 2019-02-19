import * as inquirer from 'inquirer'

export class ConfigDialog {

    private askPeer = async (): Promise<string> =>{

        const {peer} = await inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'peer',
                    message: 'Which peer do you wanna use?',
                    default: 'https://wallet1.burst-team.us:2083'
                }]
            );

        return peer;
    };

    private askAccount = async (accounts: Array<string> = []): Promise<Array<string>> => {

        const {account, askAgain} = await inquirer
            .prompt([

                {
                    type: 'input',
                    name: 'account',
                    message: "Enter an Account to watch (id or BURST address)?"
                },
                {
                    type: 'confirm',
                    name: 'askAgain',
                    message: 'Want to enter another Account (just hit enter for YES)?',
                    default: true
                }
            ]);

        accounts.push(account);
        if(askAgain) await this.askAccount(accounts);

        return accounts;
    };

    public async run() {
        const peer = await this.askPeer();
        const accounts = await this.askAccount();

        return {
            peer,
            accounts
        }
    }
}
