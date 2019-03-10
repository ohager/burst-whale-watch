import {isEmpty} from "lodash";
import {Config} from "../../config";
import {App} from "../../views/app";
import {HttpError} from "@burstjs/http";

const handle = {
    error: (details:any) => {

        let message;
        if(details instanceof HttpError){
            message = details.message;
        }
        else if(typeof(details) === 'string'){
            message = details;
        }
        else if(typeof(details) === 'object'){
            message = JSON.stringify(details);
        }

        console.error(isEmpty(message) ? "Unknown error" : message);
    },
    quit: () => {
        console.log("Bye bye");
    }
};

exports.command = '$0';

exports.describe = 'Gets Account Stats';

exports.builder = () => {
};

exports.handler = async () => {

    const config = await Config.load();
    const app = new App(config);
    app.start((reason, detail) => {
        handle[reason](detail);
    })

};
