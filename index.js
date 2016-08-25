'use strict';

var table = require('text-table'),
    jsonfile = require('jsonfile'),
    manager = require('./bot/manager/manager'),
    logger = require('./bot/logger'),
    slackWeb = require('./bot/web').slackWeb;

try {
    var config = jsonfile.readFileSync('./config.json'),
        modules = config.config.modules;

    if (process.argv.length > 2){
        manager(process.argv, modules);
        process.exit();
    }

    slackWeb = slackWeb(config.slackbot.slackWebKey);
    var mods = {},
        listens = [],
        listensFiles = config.config.listens;



    for (let listen in listensFiles){
        listens = listens.concat(require(listensFiles[listen]))
    }


    for (let mod in modules){
        if (!modules[mod].options){
            modules[mod].options = {};
        }
        modules[mod].options.slackWeb = slackWeb;
        modules[mod].options.logger = logger(slackWeb);
        mods[mod] = require(modules[mod].path)(modules[mod].options);
        console.log('Installed modules: ' + mod);
    }
    console.log('Aggregation of \'listens\' configuration files:')
    console.log(table(listens))

    modules.capture.options.listens = listens;
    var slackbot = require(config.slackbot.bot)(config.slackbot.slackBotKey, mods, listens);

} catch (err){
    console.trace(err)
    process.exit();
}

slackbot.startRTM((err, bot, payload) => {
    if (err) {
        console.log('No connection to Slack.\nMay occur due to connection issues or invalid API key.');
    }
});

module.exports = slackbot;
