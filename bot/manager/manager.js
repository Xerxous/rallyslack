'use strict';

var fs = require('fs'),
    replace = require('replace');

module.exports = (argv, modules) => {
    switch (argv[2]){
    case 'load': {
        load(modules);
        break;
    }
    default:{
        console.log(('Unknown command: ' + argv[2]));
        break;
    }
    }
}


function load(modules){

    var baseDir = './lib/'

    for (let mod in modules){
        if (modules[mod].loadIgnore){
            'pass'
        } else if (!modules[mod].path){
            console.log('WARNING: Missing module path in config.json: \'' + mod + '\'\n');
        } else if (modules[mod].path !== baseDir + mod + '/' + mod) {
            console.log('WARNING: Module path in config.json should be: ' + baseDir + mod + '/' + mod + ' for the module ' + mod + ' for initial loading.');
        } else if (!fs.existsSync(baseDir + mod) && modules[mod].path){
            console.log('Adding file:' + baseDir + mod + '/' + mod + '.js')
            fs.mkdirSync(baseDir + mod);
            fs.writeFileSync(baseDir + mod + '/' + mod + '.js', fs.readFileSync('./bot/manager/template/module.js'));
            fs.writeFileSync(baseDir + mod + '/' + 'config' + '.json', fs.readFileSync('./bot/manager/template/config.json'));
            fs.writeFileSync(baseDir + mod + '/' + 'listens' + '.js', fs.readFileSync('./bot/manager/template/listens.js'));
            replace({
                regex: '0',
                replacement: mod,
                paths: [baseDir + mod + '/' + mod + '.js', baseDir + mod + '/' + 'config' + '.json', baseDir + mod + '/' + 'listens' + '.js'],
                recursive: true,
                silent: true
            })
            console.log('Created new module: ' + mod);
        } else {
            console.log('Module \'' + mod + '\' already exists.');
        }
    }

    console.log('Done');
}
