#!/usr/bin/env node
import {command} from "yargs";

command(require('./commands/default'))
    .command(require('./commands/add'))
    .command(require('./commands/remove'))
    .command(require('./commands/reset'))
    .command(require('./commands/clear'))
    .argv;
