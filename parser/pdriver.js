var prompt = require('prompt');
var fs = require('fs');
var Parser = require('./Parser.js');
var Grammar = require('./Grammar.js');

function execute(){

    //Start a keyboard input prompt to ask user for the file to be parsed
    prompt.start();

    console.log(' Enter the filename of the scanned token stream found in \'token_output\' folder that you want to parse: ');

    //user to enter the file to be scanned by the lexical analyzer. the files are in:  data_sample/filename.ext
    prompt.get(['filename'], function (err, result) {

        if (err) { return onErr(err); }

       // console.log ((new Grammar()).Punctuation[']']);

        fs.readFile('./token_output/'+result['filename'], 'utf8', function (err, data) {

            //error in file read
            if (err) throw err;
            //Parse the JSON file into a token Map
            var tokenMap =  JSON.parse(data) ;

            var sampleGrammar = new Grammar();
            var sampleParser = new Parser(sampleGrammar, tokenMap);
           // sampleParser.parseClassDeclaration(tokenMap, 1);

            sampleParser.parse();

            //console.log();


            //Iterate through the map until no nodes are left
           // for (var token in tokenMap)
            //{
                //console.log(token + '-->'+ tokenMap[token]['lexeme']);
           //}
        });
    });

    //user input error
    function onErr(err) {
        console.log(err);
        return 1;
    }
}
execute();