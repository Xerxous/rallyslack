'use strict';

module.exports = (options) => {

    //var listens = options.listens;
    var logger = options.logger;

    return {
        invalid: (bot, message) => {
            logger(message);
            bot.reply(message, 'Type \'help\' for more details!');
        }
    }
}
