import {composeApi} from "@burstjs/core";
import {convertNumericIdToAddress} from "@burstjs/util";
import {Config} from "../../config";
import {App} from "../../views/app";
import {} from "rx"

exports.command = '$0';

exports.describe = 'Gets Account Stats';

exports.builder = () => {
};

exports.handler = async () => {

    const {peer, accounts} = await Config.load();

    const api = composeApi({
        nodeHost: peer,
        apiRootUrl: 'burst'
    });

    const app = new App();
    app.start(() => {
        console.log('Exit');
    })

};
