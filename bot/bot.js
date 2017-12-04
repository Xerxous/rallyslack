'use strict';

var botkit = require('botkit');

module.exports = (slackkey, mods, listens) => {

  var controller = botkit.slackbot({debug: false}),
    bot = controller.spawn({token: slackkey, retry: Infinity}),
    scope = ['direct_message', 'direct_mention'];

  try {
    for (let i = 0; i < listens.length; i++){
      controller.hears(listens[i][2], scope, (bot, message) => {
        try {
          mods[listens[i][0]][listens[i][1]](bot, message);
        } catch (err){
          console.log(err);
          switch (err.name){
          case 'invalidAliasError': {
            bot.reply(message, err.message);
            break;
          }
          case 'regexError': {
            bot.reply(message, err.message);
            break;
          }
          default: {
            bot.reply(message, 'unexpected error');
            break;
          }
          }
        }
      });
    }
  } catch (err){
    console.trace(err);
    process.exit();
  }

  return bot;
};
