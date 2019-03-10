import {Config} from "../../config";
import {ResetDialog} from "./resetDialog";

exports.command = 'reset';

exports.describe = 'Resets the configuration';

exports.builder = () => {};

exports.handler = async () => {

    const resetDialog = new ResetDialog();
    const confirmed = await resetDialog.run();

    if(!confirmed){
        console.log('Reset aborted');
        return;
    }

    await Config.delete();

    console.log('Configuration was reset. On next run you\'ll be asked for configuration')
};
