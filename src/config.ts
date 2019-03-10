import {existsSync} from "fs";
import * as path from "path";
import {ConfigDialog} from "./configDialog";
import {readJsonSync, writeJsonSync} from "fs-extra";
import {uniq, difference} from "lodash";

const configPath = path.join(__filename, "../config.json");
const asString = (n:any): string => n + '';

export class Config {

    public peer: string;
    public accounts: Array<string>;

    public static async load(): Promise<Config>{

        if(!existsSync(configPath)){
            const configDialog = new ConfigDialog();
            const answers = await configDialog.run();
            writeJsonSync(configPath, answers);
            return answers;
        }
        return <Config>readJsonSync(configPath);
    }


    public static async addAccounts(accounts:Array<string>): Promise<Config> {

        const config = await Config.load();

        const updatedConfig = {
            ...config,
            accounts: uniq(config.accounts.concat(accounts.map(asString)))
        };

        writeJsonSync(configPath, updatedConfig);
        return config;
    }

    public static async removeAccounts(accounts:Array<string>): Promise<Config> {

        const config = await Config.load();

        const updatedConfig = {
            ...config,
            accounts: difference(config.accounts, accounts)
        };

        writeJsonSync(configPath, updatedConfig);
        return config;
    }

    public static async clearAccounts(): Promise<Config> {

        const config = await Config.load();

        config.accounts = [];

        writeJsonSync(configPath, config);
        return config;
    }

}
