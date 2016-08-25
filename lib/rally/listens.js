'use strict';

module.exports = [
  ['rally', 'help', '(help)'],
  ['rally', 'list', '(list)( ([^\?]+))( \? (.*))?'],
  ['rally', 'search', '(search)( ([^\?]+))( \? (.*))'],
  ['rally', 'tasksStory', '(tasks)( (US[0-9]+))'],
  ['rally', 'tasksDefect', '(tasks)( (DE[0-9]+))'],
  ['rally', 'acceptStory', '(accept)( (US[0-9]+))'],
  ['rally', 'acceptDefect', '(accept)( (DE[0-9]+))'],
  ['rally', 'start', '(start)( TA[0-9]+)'],
  ['rally', 'complete', '(complete)( TA[0-9]+)'],
  ['rally', 'createTaskStory', '(create task)( (US[0-9]+))( ([^-\s]+))'],
  ['rally', 'createTaskDefect', '(create task)( (DE[0-9]+))( ([^-\s]+))'],
  ['rally', 'createAlias', '(create alias)( ([A-Za-z0-9]{1,20}))( (.*))'],
  ['rally', 'removeAlias', '(remove alias)( ([A-Za-z0-9]{1,20}))'],
  ['rally', 'alias', '(alias)']
]
