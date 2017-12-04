'use strict';

import _ from 'lodash';
import winston from 'winston';

winston.add(
  winston.transports.File, {
      filename: './logs/commands.log',
      timestamp: true,
      maxsize: 5000
  }
);

module.exports = (slackWeb) => {
    return (message) => {
        const userId = _.get(message, 'user');
        const msg = _.get(message, 'text');

        slackWeb.userInfo(userId, (error, response, body) => {
            if (error){
                winston.error(error);
            } else {
                try {
                    console.log(body);
                    const user = _.get(JSON.parse(body), 'user', 'user');
                    winston.info(_.get(user, 'profile.real_name') + '(' + _.get(user, 'name') + '): ' + msg);
                } catch (err){
                    winston.error(err);
                }
            }
        });
    }
};
