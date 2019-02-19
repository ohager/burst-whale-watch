import {Config} from "../../config";

exports.command = 'clear';

exports.describe = 'Clear all accounts';

exports.builder = () => {};

exports.handler = async () => {
    await Config.clearAccounts();
};
