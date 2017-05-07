var fs = require('fs');

var TokenSaver = function( tokenMap, filename ){

    var file = fs.createWriteStream(filename);
    file.on('error', function(err) { /* error handling */ });
    file.write( JSON.stringify(tokenMap) );
    file.end();
}

module.exports = TokenSaver;