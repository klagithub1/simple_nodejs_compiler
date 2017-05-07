var bunyan = require('bunyan');



var tokenLogger = bunyan.createLogger({
    name: 'tokenLogger',
    streams: [
        {
            level: 'info'  ,
            path: 'log/token.log'
        }
    ]
});


module.exports = tokenLogger;