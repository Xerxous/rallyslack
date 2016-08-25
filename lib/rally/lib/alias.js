'use strict';

var jsonfile = require('jsonfile');

exports.parseAlias = (text, alias) => {
    return text.concat(JSON.stringify(alias, null, 2).replace(/[{|}|\"|,]/g, ''))
}

exports.writeAlias = (bot, message, options, alias) => {
    jsonfile.writeFile(options.aliasPath, alias, (err) => {
        bot.reply(message, this.parseAlias('Alias configured. \n', alias));
    });
}

exports.removeAlias = (bot, message, options, alias, aliasToRemove) => {
    for (let name in alias){
        if (name === aliasToRemove){
            delete alias[name];
            jsonfile.writeFile(options.aliasPath, alias, (err) => {
                bot.reply(message, this.parseAlias('Alias removed. \n', alias));
            });
            return 0;
        }
    }
}

exports.uniqueAliasValidation = (alias, proposedAlias, reply) => {
    for (let name in alias){
        if (name === proposedAlias){
            throw {
                name: 'invalidAliasError',
                message: reply.invalidAlias
            };
        }
    }
}
