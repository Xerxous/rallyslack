/*
 * Some snippets in this file were based on samples from the Rally REST API User Guide:
 * https://github.com/RallyTools/rally-node/wiki/User-Guide
 *
 * Copyright (c) 2002-2012 Rally Software Development Corp. All Rights Reserved.
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
'use strict';

var rally_api = require('rally'),
    format = require('util').format,
    util = require('./util');

module.exports = (key, config) => {

    var queryUtils = rally_api.util.query,
        restApi = rally_api({
            apiKey: key,
        }),
        notes = util.notes,
        fields = util.fields;

    return {
        listStories: (project, iteration) => {
            var query;
            if (iteration) {
                query = fields.us(queryUtils.where('Project.Name', '=', project)
                                  .and('Iteration.Name', 'contains', format(config.iterationFormat, iteration)));
            } else {
                let now = new Date().toISOString();
                query = fields.us(queryUtils.where('Project.Name', '=', project)
                                  .and('Iteration.EndDate', '>', now)
                                  .and('Iteration.StartDate', '<=', now));
            }
            return new Promise((fulfill, reject) => {
                restApi.query(query, (err, res) => {
                    if (err){
                        reject(err);
                    } else {
                        fulfill(res);
                    }
                });
            });
        },

        listDefects: (project, iteration) => {
            var query;
            if (iteration) {
                query = fields.def(queryUtils.where('Project.Name', '=', project)
                                  .and('Iteration.Name', 'contains', format(config.iterationFormat, iteration)));
            } else {
                let now = new Date().toISOString();
                query = fields.def(queryUtils.where('Project.Name', '=', project)
                                  .and('Iteration.EndDate', '>', now)
                                  .and('Iteration.StartDate', '<=', now));
            }
            return new Promise((fulfill, reject) => {
                restApi.query(query, (err, res) => {
                    if (err){
                        reject(err);
                    } else {
                        fulfill(res);
                    }
                });
            });
        },

        getProject: (alias, project) => {
            return new Promise((fulfill, reject) => {
                restApi.query(fields.proj(queryUtils.where('Name', '=', project).and('Name', '!=', alias)), (err, res) => {
                    if (err){
                        reject(err);
                    } else {
                        fulfill(res);
                    }
                });
            });
        },

        getStory: (usid) => {
            return new Promise((fulfill, reject) => {
                restApi.query(fields.us(queryUtils.where('FormattedID', '=', usid)), (err, res) => {
                    if (err){
                        reject(err);
                    } else {
                        fulfill(res);
                    }
                });
            });
        },

        getDefect: (deid) => {
            return new Promise((fulfill, reject) => {
                restApi.query(fields.def(queryUtils.where('FormattedID', '=', deid)), (err, res) => {
                    if (err){
                        reject(err);
                    } else {
                        fulfill(res);
                    }
                });
            });
        },

        getTask: (taid) => {
            return new Promise((fulfill, reject) => {
                restApi.query(fields.task(queryUtils.where('FormattedID', '=', taid)), (err, res) => {
                    if (err){
                        reject(err);
                    } else {
                        fulfill(res);
                    }
                });
            });
        },

        getTasks: (id) => {
            return new Promise((fulfill, reject) => {
                restApi.query(fields.task(queryUtils.where('WorkProduct.ObjectID', '=', id)), (err, res) => {
                    if (err){
                        reject(err);
                    } else {
                        fulfill(res);
                    }
                });
            });
        },

        acceptStory: (us, user) => {
            return new Promise((fulfill, reject) => {
                restApi.update(fields.us(null, us, {ScheduleState: 'Accepted', Notes: notes(us, user, 'Accepted')}), (err, res) => {
                    if (err){
                        reject(err);
                    } else {
                        fulfill(res);
                    }
                });
            });
        },

        acceptDefect: (de, user) => {
            return new Promise((fulfill, reject) => {
                restApi.update(fields.def(null, de, {ScheduleState: 'Accepted', Notes: notes(de, user, 'Accepted')}), (err, res) => {
                    if (err){
                        reject(err);
                    } else {
                        fulfill(res);
                    }
                });
            });
        },

        startTask: (task, user) => {
            return new Promise((fulfill, reject) => {
                restApi.update(fields.task(null, task, {State: 'In-Progress', Notes: notes(task, user, 'Started')}), (err, res) => {
                    if (err){
                        reject(err);
                    } else {
                        fulfill(res);
                    }
                });
            });
        },

        completeTask: (task, user) => {
            return new Promise((fulfill, reject) => {
                restApi.update(fields.task(null, task, {State: 'Completed', Notes: notes(task, user, 'Completed')}), (err, res) => {
                    if (err){
                        reject(err);
                    } else {
                        fulfill(res);
                    }
                });
            });
        },

        createTask: (id, name, user) => {
            return new Promise((fulfill, reject) => {
                restApi.create(fields.task(null, null, {Name: name, WorkProduct: id, Notes: notes({ Notes:'' }, user, 'Created')}), (err, res) => {
                    if (err){
                        reject(err);
                    } else {
                        fulfill(res);
                    }
                });
            });
        }
        //include other commands
    }
}
