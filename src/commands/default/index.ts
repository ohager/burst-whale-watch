import {Config} from "../../config";
import {App} from "../../views/app";

exports.command = '$0';

exports.describe = 'Gets Account Stats';

exports.builder = () => {
};

exports.handler = async () => {

    const config = await Config.load();
    const app = new App(config);
    app.start(() => {
        console.log('Exit');
    })

};
