import yargs = require("yargs");

yargs
    .command(require('./commands/default'))
    .command(require('./commands/add'))
    .command(require('./commands/clear'))
    .argv;
