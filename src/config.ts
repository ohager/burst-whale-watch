import {existsSync} from "fs";
import * as path from "path";
import {ConfigDialog} from "./configDialog";
import {readJsonSync, writeJsonSync, remove} from "fs-extra";
import {uniq, difference} from "lodash";
import {isBurstAddress, convertAddressToNumericId} from "@burstjs/util";

const configPath = path.join(__filename, "../config.json");
const asAccountId = (account: any): string => {
    let accountId = account + '';
    if (isBurstAddress(account)) {
        accountId = convertAddressToNumericId(account)
    }
    return accountId;
};

export class Config {

    public peer: string;
    public accounts: Array<string>;

    public static async load(): Promise<Config> {

        if (!existsSync(configPath)) {
            const configDialog = new ConfigDialog();
            const answers = await configDialog.run();
            writeJsonSync(configPath, answers);
            return answers;
        }
        return readJsonSync(configPath);
    }


    public static async addAccounts(accounts: Array<string>): Promise<Config> {

        const config = await Config.load();

        const updatedConfig = {
            ...config,
            accounts: uniq(config.accounts.concat(accounts.map(asAccountId)))
        };

        writeJsonSync(configPath, updatedConfig);
        return updatedConfig;
    }

    public static async removeAccounts(accounts: Array<string>): Promise<Config> {

        const config = await Config.load();

        const updatedConfig = {
            ...config,
            accounts: difference(config.accounts, accounts)
        };

        writeJsonSync(configPath, updatedConfig);
        return updatedConfig;
    }

    public static async clearAccounts(): Promise<Config> {

        const config = await Config.load();

        config.accounts = [];

        writeJsonSync(configPath, config);
        return config;
    }

    public static async delete(): Promise<void> {
        await remove(configPath);
    }

}
