'use strict';

exports.filter = (keyword, us, def) => {
  var list = [].concat(us.Results, def.Results);
  var match = [];
  for (let i = 0; i < list.length; i++) {
    if (list[i].Name.toLowerCase().indexOf(keyword) >= 0) {
      match.push(list[i]);
    }
  }
  return match;
};

exports.unmask = (alias, lib) => {
  if (lib[alias]) {
    return lib[alias];
  }
  return alias;
};

exports.notes = (el, user, context) => {
  var notes = el.Notes,
    name = user.profile.real_name,
    usr = user.name,
    notesArray = notes.split('*** Rallybot ***');
  return notesArray[0] + '*** Rallybot ***<br />Latest update at ' + new Date() + ' by ' + name + '(' + usr + ')';
};

exports.checkResults = (commands, context, message, reply) => {
  var results = commands[context].exec(message.text);
  if (!results){
    throw {
      name: 'regexError',
      message: reply.unknown
    };
  }
  return results;
};

exports.errorHandler = (bot, message, reply, err) => {
  if (err === 'empty'){
    return bot.reply(message, reply.empty);
  }
  bot.reply(message, reply.error);
};

exports.commands = {
  list: /^(?:list)(?: ([^\?]+))(?: \? (.*))?$/,
  createAlias: /^(?:create alias)(?: ([A-Za-z0-9]{1,20}))(?: (.*))$/,
  removeAlias: /^(?:remove alias)(?: ([A-Za-z0-9]{1,20}))$/,
  start: /^(?:start)(?: (TA[0-9]+))$/,
  acceptUs: /^(?:accept)(?: (US[0-9]+))$/,
  acceptDe: /^(?:accept)(?: (DE[0-9]+))$/,
  complete: /^(?:complete)(?: (TA[0-9]+))$/,
  search: /^(?:search)(?: ([^\?]+))(?: \? (.*))$/,
  tasksUs: /^(?:tasks)(?: (US[0-9]+))$/,
  tasksDe: /^(?:tasks)(?: (DE[0-9]+))$/,
  createUs: /^(?:create task)(?: (US[0-9]+))(?: ([^-\s]+))$/,
  createDe: /^(?:create task)(?: (DE[0-9]+))(?: ([^-\s]+))$/
};

exports.fields = {
  us: (filter, _ref, mod) => {
    return {
      type: 'hierarchicalrequirement',
      ref: _ref,
      fetch: ['FormattedID', 'ObjectID', 'Name', 'ScheduleState', 'Iteration', 'Project', 'PlanEstimate', 'Notes'],
      query: filter,
      data: mod
    };
  },

  def: (filter, _ref, mod) => {
    return {
      type: 'defects',
      ref: _ref,
      fetch: ['FormattedID', 'ObjectID', 'Name', 'ScheduleState', 'Iteration', 'Project', 'PlanEstimate', 'Notes'],
      query: filter,
      data: mod
    };
  },

  proj: (filter) => {
    return {
      type: 'project',
      query: filter
    };
  },

  task: (filter, _ref, mod) => {
    return {
      type: 'tasks',
      ref: _ref,
      fetch: ['FormattedID', 'ObjectID', 'Name', 'State', 'WorkProduct', 'Project', 'Description', 'Owner', 'Notes'],
      query: filter,
      data: mod
    };
  }

};
