'use strict';

module.exports = (options) => {

  var slackUser = options.slackWeb.userInfo, //slackWebAPI to look up message code IDs (username/channel/etc.)
    logger = options.logger; //logging messages

  return {
    greet: (bot, message) => {
      logger(message);
      slackUser(message.user, (error, response, body) => {
        if (error){
          bot.reply(message, 'Something went wrong!');
          return error;
        }
        bot.reply(message, 'Hi ' + JSON.parse(body).user.profile.real_name);
      });
    }
  };
};
