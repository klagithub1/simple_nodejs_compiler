var Symbol = require('./Symbol.js');
var SymbolTable = require('./SymbolTable.js');
var fs = require('fs');
var Stack = require('stackjs')
var prompt = require('prompt');
var tokenLog = require('../loggers/TokenLogger.js');
var errorLog = require('../loggers/ErrCompilerLogger.js');




var promptFcn = function(){

    //Start a keyboard input prompt to ask user for the file to be parsed
    prompt.start();

    console.log('Enter the source file from token_output folder that you want to leverage the Symbol Table:');

    //user to enter the file to be scanned by the lexical analyzer. the files are in:  data_sample/filename.ext
    prompt.get(['filename'], function (err, result) {

        if (err) {
            return onErr(err);
        }

        var SymStack = new Stack();

        fs.readFile( './token_output/'+result.filename, { encoding: 'utf-8' }, function(err, data) {

            if (err) throw err;

            var tokenMap =  JSON.parse(data) ;


            SymStack.push(new SymbolTable());

            //Iterate through the map until no nodes are left
            for (var key in tokenMap)
            {
                if(tokenMap[key]['type'] == "OPENCURLY")
                {
                    SymStack.push(new SymbolTable());
                    tokenLog.info("INFO: New Scope Detected");
                    console.log("INFO: New Scope Detected");

                }
                else if(tokenMap[key]['type'] == "CLOSECURLY")
                {
                    SymStack.pop();
                    tokenLog.info("INFO: Scope terminated.");
                    console.log("INFO: New Scope Detected");
                }
                else
                {
                    (SymStack.peek()).insertSymbol(key,{type: tokenMap[key]['type'], lexeme:tokenMap[key]['lexeme'] });
                    console.log((SymStack.peek()).search(key));
                    console.log((SymStack.peek()).depth);
                }
            }

        });


        // Scanner( ( fs.createReadStream('./token_output/'+result.filename, { encoding: 'utf-8' }) ) , ( './token_output/'+result.filename+'.token' ) );

    });

    //user input error
    function onErr(err) {
        // console.log(err);
        return 1;
    }






}
promptFcn();

//Import Token Stream from JSON file
//ASSUMPTION: Parser is correctly parsed the file and found no syntactical errors.
