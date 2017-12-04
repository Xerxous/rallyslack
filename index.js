'use strict';

import _ from 'lodash';
import table from 'text-table';
import jsonfile from 'jsonfile';
import manager from './bot/manager/manager';
import logger from './bot/logger';
import { slackWeb } from './bot/web';

const config = jsonfile.readFileSync('./config.json');
const modules = _.get(config, 'config.modules');

if (process.argv.length > 2){
    manager(process.argv, modules);
    process.exit();
}

const slackWebMod = slackWeb(_.get(config, `slackbot.slackWebKey`));
let mods = {};
let listens = [];
let listensFiles = config.config.listens;

for (let listen in listensFiles){
    listens = listens.concat(require(listensFiles[listen]))
}

for (let mod in modules){
    if (!modules[mod].options){
        modules[mod].options = {};
    }
    modules[mod].options.slackWeb = slackWebMod;
    modules[mod].options.logger = logger(slackWebMod);
    mods[mod] = require(modules[mod].path)(modules[mod].options);
    console.log('Installed modules: ' + mod);
}
console.log('Aggregation of \'listens\' configuration files:')
console.log(table(listens))

modules.capture.options.listens = listens;
var slackbot = require(config.slackbot.bot)(config.slackbot.slackBotKey, mods, listens);


slackbot.startRTM((err, bot, payload) => {
    if (err) {
        console.log('No connection to Slack.\nMay occur due to connection issues or invalid API key.');
    }
});

module.exports = slackbot;
