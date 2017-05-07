var assert = require("assert");
var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var str = require('string');
var StringScanner = require("StringScanner");
var scanner = require('../scanner/scanner.js');

describe('Test Bundle: Lexical Analyzer', function(){

    describe('tc1: Single Line Comments', function(){
        it('The output should not contain a token with / or //', function(){

            var textstream = './data_sample/single_line_comments.txt' ;

            scanner( fs.createReadStream(textstream, {encoding: 'utf-8'}), 'file1.txt'  );

            //Parse the file with the JSON object saved from scanner
            var obj = JSON.parse(fs.readFileSync('file1.txt' , 'utf8'));

            //Iterate trhough the objects
            for(key in obj)
            {
                //get the content of each token
                var tokenContent =   obj[key].valueOf();
                //get the lexeme property and comparison between lexeme value and / or // should equal -1
                //console.log(tokenContent['lexeme']);
                assert.notEqual('/', (tokenContent['lexeme']) );
            }

            //assert.equal(-1, [1,2,3].indexOf(5));
        })
    }),

    describe('tc2: Multi-Line Comments', function(){
        it('Should return an error if any of the token lexemes matches * or /', function(){
            var textstream = './data_sample/multi_line_comments.txt' ;

            scanner( fs.createReadStream(textstream, {encoding: 'utf-8'}), 'file2.txt' );

            //Parse the file with the JSON object saved from scanner
            var obj = JSON.parse(fs.readFileSync( 'file2.txt' , 'utf8'));

            //Iterate trhough the objects
            for(key in obj)
            {
                //get the content of each token
                var tokenContent =   obj[key].valueOf();
                //get the lexeme property and comparison between lexeme value and / or // should equal -1
                //console.log(tokenContent['lexeme']);
                assert.notEqual('*', (tokenContent['lexeme']) );
            }
        })
    }) ,

    describe('tc3: Single Char Operator ', function(){
        it('Should demonstrate that the lexeme is an operator', function(){
            var textstream = './data_sample/single_char_operators.txt' ;

            scanner( fs.createReadStream(textstream, {encoding: 'utf-8'}), 'file3.txt' );

            //Parse the file with the JSON object saved from scanner
            var obj = JSON.parse(fs.readFileSync( 'file3.txt' , 'utf8'));

            //Iterate trhough the objects
            for(key in obj)
            {
                //get the content of each token
                var tokenContent =   obj[key].valueOf();
                //get the lexeme property and comparison between lexeme value and / or // should equal -1
                //console.log(tokenContent['lexeme']);
                assert.equal('EQUALOP', (tokenContent['type']) );
            }
        })
    }),
    describe('tc4: Double Char Operator ', function(){
        it('Should demonstrate that the double character operator is tokenized properly', function(){
            var textstream = './data_sample/double_char.txt' ;

            scanner( fs.createReadStream(textstream, {encoding: 'utf-8'}), 'file4.txt' );

            //Parse the file with the JSON object saved from scanner
            var obj = JSON.parse(fs.readFileSync( 'file4.txt' , 'utf8'));

            //Iterate trhough the objects
            for(key in obj)
            {
                //get the content of each token
                var tokenContent =   obj[key].valueOf();
                //get the lexeme property and comparison between lexeme value and / or // should equal -1
                //console.log(tokenContent['lexeme']);
                assert.equal('RELINEQUAL', (tokenContent['type']) );
            }
        })
    }),
    describe('tc5: Parsing of an identifier', function(){
        it('Identifier parsing...', function(){
            var textstream = './data_sample/identifier.txt' ;

            scanner( fs.createReadStream(textstream, {encoding: 'utf-8'}), 'file5.txt' );

            //Parse the file with the JSON object saved from scanner
            var obj = JSON.parse(fs.readFileSync( 'file5.txt' , 'utf8'));

            //Iterate trhough the objects
            for(key in obj)
            {
                //get the content of each token
                var tokenContent =   obj[key].valueOf();
                //get the lexeme property and comparison between lexeme value and / or // should equal -1
                //console.log(tokenContent['lexeme']);
                assert.equal('ID', (tokenContent['type']) );
            }
        })
    }),
        describe('tc6: Parsing Integers', function(){
            it('Should demonstrate that the integer character operator is tokenized properly', function(){
                var textstream = '1' ;

                scanner( fs.createReadStream(textstream, {encoding: 'utf-8'}), 'file4.txt' );

                //Parse the file with the JSON object saved from scanner
                var obj = JSON.parse(fs.readFileSync( 'integer.txt' , 'utf8'));

                //Iterate trhough the objects
                for(key in obj)
                {
                    //get the content of each token
                    var tokenContent =   obj[key].valueOf();
                    //get the lexeme property and comparison between lexeme value and / or // should equal -1
                    //console.log(tokenContent['lexeme']);
                    assert.equal('31', (tokenContent['lexeme']) );
                }
            })
        }),
        describe('tc7: Parsing floating points ', function(){
            it('Should demonstrate that the floating point character operator is tokenized properly', function(){
                var textstream = './data_sample/double_char.txt' ;

                scanner( fs.createReadStream(textstream, {encoding: 'utf-8'}), 'file4.txt' );

                //Parse the file with the JSON object saved from scanner
                var obj = JSON.parse(fs.readFileSync( 'file4.txt' , 'utf8'));

                //Iterate trhough the objects
                for(key in obj)
                {
                    //get the content of each token
                    var tokenContent =   obj[key].valueOf();
                    //get the lexeme property and comparison between lexeme value and / or // should equal -1
                    //console.log(tokenContent['lexeme']);
                    assert.equal('RELINEQUAL', (tokenContent['type']) );
                }
            })
        })
});