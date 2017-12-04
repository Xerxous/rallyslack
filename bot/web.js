'use strict';

var request = require('request');

exports.slackWeb = (slackKey) => {

  var key = slackKey;

  return {
    userInfo: (userId, callback) => {
      request({
        url: 'https://slack.com/api/users.info',
        method: 'POST',
        qs: { token: key, user: userId }
      }, callback);
    }
  };
};
