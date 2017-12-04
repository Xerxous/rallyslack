/*
    Now it's your turn to add functions and behaviors for the bot.
    Make sure you add each function to the listens configuration.
*/
var fs = require('fs');
var jsonfile = require('jsonfile');

module.exports = function(options){

  var slackWebAPI = options.slackWeb; //slackWebAPI to look up message code IDs (username/channel/etc.)
  var logger = options.logger; //logging messages
  var config = jsonfile.readFileSync(options.configPath); //config JSON file into object

  return {
    example: function(bot, message){
      logger(message);
      bot.reply(message, 'Start developing your module!');
    }
  };
};
