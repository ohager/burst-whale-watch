import * as inquirer from 'inquirer'

export class ResetDialog {

    private askForReset = async (): Promise<boolean> => {

        const {confirmed} = await inquirer
            .prompt([{
                    type: 'confirm',
                    message: 'You are about to reset all current settings. Do you really want to do this?',
                    name: 'confirmed',
                }]);

        return confirmed;
    };

    public async run() : Promise<boolean> {
        return await this.askForReset();
    }
}
