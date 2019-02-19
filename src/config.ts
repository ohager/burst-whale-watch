import {existsSync} from "fs";
import * as path from "path";
import {ConfigDialog} from "./configDialog";
import {readJsonSync, writeJsonSync} from "fs-extra";
import {uniq} from "lodash";

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


    public static async updateAccounts(accounts:Array<string>): Promise<Config> {

        const config = await Config.load();

        const updatedConfig = {
            ...config,
            accounts: uniq(config.accounts.concat(accounts.map(asString)))
        };

        console.log('accounts',updatedConfig);

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
