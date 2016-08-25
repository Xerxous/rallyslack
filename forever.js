var forever = require('forever-monitor');

var child = new (forever.Monitor)('index.js');

child.on('exit', () => {
    console.log('Unexpected exit, most likely a connection issue.');
});

child.start();
 
