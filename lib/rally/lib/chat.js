'use strict';

var util = require('util');

module.exports = (bot, message, config, context, arg1, arg2) => {

    var reply = config.reply,
        urls = config.urls,
        clrFormat = config.clrFormat;

    try {
        switch (context){
        case 'list': {
            var data = [].concat(arg2.Results, arg1.Results);
            bot.reply(message, 'List of User Stories and Defects for *' + data[0].Iteration.Name + '*')
            for (let i = 0; i < data.length; i++){
                if (!data[i].PlanEstimate) {
                    data[i].PlanEstimate = 'Not yet scored';
                } else {
                    data[i].PlanEstimate += ' Points';
                }

                let attach = [{
                    fallback: 'List of User Stories and Defects',
                    color: clrFormat[data[i].ScheduleState],
                    title: data[i].FormattedID + '\t' + data[i].ScheduleState + '\t' + data[i].PlanEstimate,
                    title_link: util.format(urls.defect, data[i].Project.ObjectID, data[i].ObjectID),
                    text: data[i].Name
                }]

                if (data[i]._type === 'Defect'){
                    attach[0].title_link = util.format(urls.defect, data[i].Project.ObjectID, data[i].ObjectID)
                } else {
                    attach[0].title_link = util.format(urls.hierarchicalrequirement, data[i].Project.ObjectID, data[i].ObjectID)
                }
                bot.reply(message, {
                    attachments: attach
                });
            }
            break;
        }

        case 'tasks': {
            bot.reply(message, 'List of tasks for *' + arg1.Results[0].WorkProduct._refObjectName + '*');
            for (let i = 0; i < arg1.Results.length; i++){
                if (!arg1.Results[i].Owner) {
                    arg1.Results[i].Owner = {
                        _refObjectName: 'Unassigned'
                    }
                }
                bot.reply(message, {
                    attachments: [
                        {
                            fallback: 'Tasks',
                            author_name: arg1.Results[i].Owner._refObjectName,
                            color: clrFormat[arg1.Results[i].State],
                            title: arg1.Results[i].FormattedID + '\t' + arg1.Results[i].Name + '\t' + arg1.Results[i].State,
                            title_link: util.format(urls.task, arg1.Results[i].Project.ObjectID, arg1.Results[i].ObjectID)
                        }
                    ]
                });
            }
            break;
        }

        case 'accept': {

            let attach = [{
                fallback: 'Accepted.',
                color: clrFormat[arg1.Object.ScheduleState],
                pretext: 'Done.',
                title: arg1.Object.FormattedID + '\t' + arg1.Object.ScheduleState,
                text: arg1.Object.Name
            }]

            if (arg1.Object._type === 'Defect'){
                attach[0].title_link = util.format(urls.defect, arg1.Object.Project.ObjectID, arg1.Object.ObjectID);
            } else {
                attach[0].title_link = util.format(urls.hierarchicalrequirement, arg1.Object.Project.ObjectID, arg1.Object.ObjectID);
            }
            bot.reply(message, {
                attachments: attach
            });

            break;
        }

        case 'start': {
            bot.reply(message, {
                attachments: [
                    {
                        fallback: 'Started Task',
                        color: clrFormat[arg1.Object.State],
                        pretext: 'Good luck.',
                        title: arg1.Object.FormattedID + '\t' + arg1.Object.State,
                        title_link: util.format(urls.task, arg1.Object.Project.ObjectID, arg1.Object.ObjectID),
                        text: arg1.Object.Name
                    }
                ]
            });
            break;
        }

        case 'complete': {
            bot.reply(message, {
                attachments: [
                    {
                        fallback: 'Completed Task',
                        color: clrFormat[arg1.Object.State],
                        pretext: 'Good Job.',
                        title: arg1.Object.FormattedID + '\t' + arg1.Object.State,
                        title_link: util.format(urls.task, arg1.Object.Project.ObjectID, arg1.Object.ObjectID),
                        text: arg1.Object.Name
                    }
                ]
            });
            break;
        }

        case 'search': {
            if (!arg1.length){
                bot.reply(message, reply.empty);
            } else {
                bot.reply(message, 'List of results for the keyword: *' + arg2 + '*')
                for (let i = 0; i < arg1.length; i++){
                    bot.reply(message, {
                        attachments: [
                            {
                                fallback: 'List of User Stories',
                                color: clrFormat[arg1[i].ScheduleState],
                                title: arg1[i].FormattedID + '\t' + arg1[i].ScheduleState,
                                title_link: util.format(urls.hierarchicalrequirement, arg1[i].Project.ObjectID, arg1[i].ObjectID),
                                text: arg1[i].Name
                            }
                        ]
                    });
                }
            }
            break;
        }

        case 'create': {
            bot.reply(message, {
                attachments: [
                    {
                        fallback: 'Created a new Task',
                        color: clrFormat[arg1.Object.ScheduleState],
                        pretext: 'Done.',
                        title: arg1.Object.FormattedID + '\t' + arg1.Object.State,
                        title_link: util.format(urls.task, arg1.Object.Project.ObjectID, arg1.Object.ObjectID),
                        text: arg1.Object.Name
                    }
                ]
            });
            break;
        }

        default: {
            //not evoked during production
            console.log('Unknown context case. Please direct to a valid case');
            break;
        }

        }
    } catch (err) {
        // All errors are related to empty query
        //console.log(err);
        bot.reply(message, reply.empty)
    }
}
