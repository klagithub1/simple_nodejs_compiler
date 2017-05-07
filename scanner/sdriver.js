//KLAJDI KARANXHA
var prompt = require('prompt');
var fs = require('fs');
var Scanner = require('./scanner.js');



var promptFcn = function(){

    //Start a keyboard input prompt to ask user for the file to be parsed
    prompt.start();

    console.log('Enter the source file from data_sample folder that you want to scan:');

    //user to enter the file to be scanned by the lexical analyzer. the files are in:  data_sample/filename.ext
    prompt.get(['filename'], function (err, result) {

        if (err) { return onErr(err); }

        Scanner( ( fs.createReadStream('./data_sample/'+result.filename, { encoding: 'utf-8' }) ) , ( './token_output/'+result.filename+'.token' ) );

    });

    //user input error
    function onErr(err) {
       // console.log(err);
        return 1;
    }
}
promptFcn();