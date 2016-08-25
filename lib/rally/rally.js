'use strict';

var jsonfile = require('jsonfile'),
    chat = require('./lib/chat'),
    query = require('./lib/query'),
    util = require('./lib/util'),
    aliasManager = require('./lib/alias');

module.exports = (options) => {

    var alias = jsonfile.readFileSync(options.aliasPath),
        config = jsonfile.readFileSync(options.configPath),
        slackUser = options.slackWeb.userInfo,
        logger = options.logger,
        reply = config.reply,
        filter = util.filter,
        unmask = util.unmask,
        commands = util.commands,
        rally = query(options.rallyKey, config);

        //Rally bot commands
    return {

        alias: (bot, message) => {
            logger(message);
            bot.reply(message, aliasManager.parseAlias('Current alias for this bot: \n', alias));
        },

        createAlias: (bot, message) => {
            logger(message);
            var results = util.checkResults(commands, 'createAlias', message, reply),
                proposedAlias = results[1],
                project = results[2],
                query = rally.getProject(proposedAlias, project);

            aliasManager.uniqueAliasValidation(alias, proposedAlias, reply);
            query.then((res) => {
                if (!res.Results.length){
                    return bot.reply(message, reply.empty);
                }
                alias[proposedAlias] = project
                aliasManager.writeAlias(bot, message, options, alias);
            }).catch((err) => {
                bot.reply(message, reply.error);
            });
        },

        removeAlias: (bot, message) => {
            logger(message);
            var results = util.checkResults(commands, 'removeAlias', message, reply);
            var aliasToRemove = results[1];
            if (aliasManager.removeAlias(bot, message, options, alias, aliasToRemove)){
                bot.reply(message, 'That alias does not exist.');
            }
        },

        help: (bot, message) => {
            logger(message);
            bot.reply(message, reply.help);
        },

        list: (bot, message) => {
            logger(message);
            var results = util.checkResults(commands, 'list', message, reply),
                team = unmask(results[1], alias),
                iteration = results[2],
                list = rally.listStories(team, iteration);

            bot.reply(message, 'Loading user stories and defects...');
            list.then((us) => {
                rally.listDefects(team, iteration).then((def) => {
                    chat(bot, message, config, 'list', us, def);
                });
            }).catch((err) => {
                bot.reply(message, reply.error);
            });

        },

        search: (bot, message) => {
            logger(message);
            var results = util.checkResults(commands, 'search', message, reply),
                team = unmask(results[1], alias),
                keyword = results[2],
                list = rally.listStories(team, null);

            bot.reply(message, 'Searching for matches...');
            list.then((us) => {
                return rally.listDefects(team, null).then((def) => {
                    chat(bot, message, config, 'search', filter(keyword.toLowerCase(), us, def), keyword);
                });
            }).catch((err) => {
                bot.reply(message, reply.error);
            });
        },

        tasksStory: (bot, message) => {
            logger(message);
            var results = util.checkResults(commands, 'tasksUs', message, reply),
                getStory = rally.getStory(results[1])

            bot.reply(message, 'Loading story tasks...');
            getStory.then((us) => {
                if (!(us && us.Results.length)){
                    throw 'empty';
                }
                return rally.getTasks(us.Results[0].ObjectID);
            }).then((tasks) => {
                return chat(bot, message, config, 'tasks', tasks);
            }).catch((err) => {
                util.errorHandler(bot, message, reply, err);
            });
        },

        tasksDefect: (bot, message) => {
            logger(message);
            var results = util.checkResults(commands, 'tasksDe', message, reply),
                getDefect = rally.getDefect(results[1]);

            bot.reply(message, 'Loading defect tasks...');
            getDefect.then((def) => {
                if (!(def && def.Results.length)){
                    throw 'empty';
                }
                return rally.getTasks(def.Results[0].ObjectID)
            }).then((tasks) => {
                return chat(bot, message, config, 'tasks', tasks);
            }).catch((err) => {
                util.errorHandler(bot, message, reply, err);
            });
        },

        //Write methods - callbacks due to incompatible flow of promises
        acceptStory: (bot, message) => {
            logger(message);
            var results = util.checkResults(commands, 'acceptUs', message, reply);
            bot.reply(message, 'Making changes...');
            rally.getStory(results[1]).then((us) => {
                if (!(us && us.Results.length)){
                    throw 'empty';
                }
                slackUser(message.user, (error, response, body) => {
                    if (error){
                        return bot.reply(message, reply.error);
                    } else {
                        rally.acceptStory(us.Results[0], JSON.parse(body).user).then((updated) => {
                            chat(bot, message, config, 'accept', updated);
                        }).catch((err) => {
                            bot.reply(message, reply.error);
                        });
                    }
                });
            }).catch((err) => {
                util.errorHandler(bot, message, reply, err);
            });
        },

        acceptDefect: (bot, message) => {
            logger(message);
            var results = util.checkResults(commands, 'acceptDe', message, reply);
            bot.reply(message, 'Making changes...');
            rally.getDefect(results[1]).then((de) => {
                if (!(de && de.Results.length)){
                    throw 'empty';
                }
                slackUser(message.user, (error, response, body) => {
                    if (error){
                        return bot.reply(message, reply.error);
                    } else {
                        rally.acceptDefect(de.Results[0], JSON.parse(body).user).then((updated) => {
                            chat(bot, message, config, 'accept', updated);
                        }).catch((err) => {
                            bot.reply(message, reply.error);
                        });
                    }
                });
            }).catch((err) => {
                util.errorHandler(bot, message, reply, err);
            });
        },

        start: (bot, message) => {
            logger(message);
            var results = util.checkResults(commands, 'start', message, reply);

            bot.reply(message, 'Making changes...');
            rally.getTask(results[1]).then((task) => {
                if (!(task && task.Results.length)){
                    throw 'empty';
                }
                slackUser(message.user, (error, response, body) => {
                    if (error){
                        return bot.reply(message, reply.error);
                    } else {
                        rally.startTask(task.Results[0], JSON.parse(body).user).then((updated) => {
                            chat(bot, message, config, 'start', updated);
                        }).catch((err) => {
                            bot.reply(message, reply.error);
                        });
                    }
                });
            }).catch((err) => {
                util.errorHandler(bot, message, reply, err);
            });
        },

        complete: (bot, message) => {
            logger(message);
            var results = util.checkResults(commands, 'complete', message, reply);

            bot.reply(message, 'Making changes...');
            rally.getTask(results[1]).then((task) => {
                if (!(task && task.Results.length)){
                    throw 'empty';
                }
                slackUser(message.user, (error, response, body) => {
                    if (error){
                        return bot.reply(message, reply.error);
                    } else {
                        rally.completeTask(task.Results[0], JSON.parse(body).user).then((updated) => {
                            chat(bot, message, config, 'complete', updated);
                        }).catch((err) => {
                            bot.reply(message, reply.error);
                        });
                    }
                });
            }).catch((err) => {
                util.errorHandler(bot, message, reply, err);
            });
        },

        createTaskStory: (bot, message) => {
            logger(message);
            var results = util.checkResults(commands, 'createUs', message, reply),
                usid = results[1],
                taskName = results[2];

            bot.reply(message, 'Making changes...');
            rally.getStory(usid).then((us) => {
                if (!(us && us.Results.length)){
                    throw 'empty';
                }
                slackUser(message.user, (err, response, body) => {
                    if (err){
                        return bot.reply(message, reply.error);
                    } else {
                        rally.createTask(us.Results[0], taskName, JSON.parse(body).user).then((newTask) => {
                            chat(bot, message, config, 'create', newTask);
                        }).catch((err) => {
                            bot.reply(message, reply.error);
                        });
                    }
                });
            }).catch((err) => {
                util.errorHandler(bot, message, reply, err);
            });
        },

        createTaskDefect: (bot, message) => {
            logger(message);
            var results = util.checkResults(commands, 'createDe', message, reply),
                deid = results[1],
                taskName = results[2];

            bot.reply(message, 'Making changes...');
            rally.getDefect(deid).then((de) => {
                if (!(de && de.Results.length)){
                    throw 'empty';
                }
                slackUser(message.user, (err, response, body) => {
                    if (err){
                        return bot.reply(message, reply.error);
                    } else {
                        rally.createTask(de.Results[0], taskName, JSON.parse(body).user).then((newTask) => {
                            chat(bot, message, config, 'create', newTask);
                        }).catch((err) => {
                            bot.reply(message, reply.error);
                        });
                    }
                });
            }).catch((err) => {
                util.errorHandler(bot, message, reply, err);
            });
        }
    }
}
