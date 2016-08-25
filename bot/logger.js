'use strict';

var winston = require('winston');

winston.add(
  winston.transports.File, {
      filename: './logs/commands.log',
      timestamp: true,
      maxsize: 5000
  }
);

module.exports = (slackWeb) => {

    return (message) => {
        var userId = message.user,
            msg = message.text;

        slackWeb.userInfo(userId, (error, response, body) => {
            if (error){
                winston.error(error);
            } else {
                try {
                    var user = JSON.parse(body).user;
                    winston.info(user.profile.real_name + '(' + user.name + '): ' + msg);
                } catch (err){
                    winston.error(err);
                }
            }
        });
    }
};
