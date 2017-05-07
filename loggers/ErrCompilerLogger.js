var bunyan = require('bunyan');



var errCompilerLogger = bunyan.createLogger({
    name: 'errCompilerLogger',
    streams: [
        {
            level: 'error'  ,
            path: 'log/error.log'
        }
    ]
});


module.exports = errCompilerLogger;