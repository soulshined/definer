const version = require("./cmds/version");
const help = require("./cmds/help");
const define = require("./cmds/define");
const minimist = require('minimist');
const setup = require("./cmds/setup");
const Logger = require("js-logger");

Logger.useDefaults();
Logger.setLevel(Logger.INFO);

function cli() {

    const args = minimist(process.argv.slice(2), {
        boolean: ['help', 'version', 'setup']
    });

    args.word = args._.join(" ");

    let cmd = 'help';
    if (args.word.trim().length > 0) cmd = 'word';
    if (args.setup) cmd = 'setup';
    if (args.version) cmd = 'version';
    if (args.help) cmd = 'help';

    Logger.debug(args);
    switch (cmd) {
        case 'version':
            version();
            break;
        case 'help':
            help(args);
            break;
        case 'word':
            define(args);
            break;
        case 'setup':
            setup();
            break;
        default:
            console.log('Unknown command');
            process.exit(1);
    }
}

module.exports.cli = cli();