// Intentionally left

var bunyan = require('bunyan');



var log = bunyan.createLogger({name: 'myapp'});

log.info('hi');

log.error('error');

