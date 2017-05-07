var assert = require("assert");
var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var str = require('string');
var StringScanner = require("StringScanner");
var scanner = require('../scanner/scanner.js');

describe('Test Bundle: Lexical Analyzer: Integer and Floats', function(){

    describe('tc1: Parsing an Integer', function(){
        it('The output should contain the same integer as parsed from the file', function(){

           var sampleIntegerToken = {
               "0":{
                   "type":"INTEGER",
                   "lexeme":"43"
               }
           };

           var scan = function(callback){
               scanner( ( fs.createReadStream('./data_sample/integer.txt', { encoding: 'utf-8' }) ) , ( './token_output/integer.token' ) );

                callback();
           }

           scan(function(){

           });

            //Parse the file with the JSON object saved from scanner
            var obj = JSON.parse(fs.readFileSync("./token_output/integer.token" , 'utf8'));

           // console.log(obj);

            assert.equal(sampleIntegerToken['0']['type'],obj['0']['type']);
            assert.equal(sampleIntegerToken['0']['lexeme'],obj['0']['lexeme']);

        })
    }),
    describe('tc2: Parsing a Floating Point Number', function(){
        it('The output should contain the same floating point as parsed from the file', function(){

            var sampleFloatToken = {
                "1":{
                    "type":"FLOAT",
                    "lexeme":"13.3456789454"
                }
            };

            var scan = function(callback){
                scanner( ( fs.createReadStream('./data_sample/floating.txt', { encoding: 'utf-8' }) ) , ( './token_output/floating.token' ) );

                callback();
            }

            scan(function(){

            });

            //Parse the file with the JSON object saved from scanner
            var obj = JSON.parse(fs.readFileSync("./token_output/floating.token" , 'utf8'));

            // console.log(obj);

            assert.equal(sampleFloatToken['1']['type'],obj['1']['type']);
            assert.equal(sampleFloatToken['1']['lexeme'],obj['1']['lexeme']);

        })
    })
});