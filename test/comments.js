var assert = require("assert");
var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var str = require('string');
var StringScanner = require("StringScanner");
var scanner = require('../scanner/scanner.js');

describe('Test Bundle: Lexical Analyzer: Comments', function(){

    describe('tc1: Inline Comments', function(){
        it('The output should ignore inline comments and parse only the variables', function(){



            var scan = function(callback){
                scanner( ( fs.createReadStream('./data_sample/inline_comments.txt', { encoding: 'utf-8' }) ) , ( './token_output/inline_comments.token' ) );

                callback();
            }

            scan(function(){

            });

            //Parse the file with the JSON object saved from scanner
            var obj = JSON.parse(fs.readFileSync("./token_output/inline_comments.token" , 'utf8'));

            // console.log(obj);

            assert.equal(obj['0']['type'],'ID');
            assert.equal(obj['1']['type'],'ID');
            assert.equal(obj['2']['type'],'SEMICOLON');

        })
    }),
    describe('tc2: Multiline comments', function(){
        it('Should ignore multiline comments', function(){


            var scan = function(callback){
                scanner( ( fs.createReadStream('./data_sample/multi_line_comments.txt', { encoding: 'utf-8' }) ) , ( './token_output/multi_line_comments.token' ) );

                callback();
            }

            scan(function(){

            });

            //Parse the file with the JSON object saved from scanner
            var obj = JSON.parse(fs.readFileSync("./token_output/multi_line_comments.token" , 'utf8'));

            // console.log(obj);

            assert.equal(obj['3']['type'],'INTEGER');


        })
    }),
    describe('tc2: Unending comments', function(){
        it('Should identify unending comments and the output should be empty because everything is ignored.', function(){


            var scan = function(callback){
                scanner( ( fs.createReadStream('./data_sample/unending_comments.txt', { encoding: 'utf-8' }) ) , ( './token_output/unending_comments.token' ) );

                callback();
            }

            scan(function(){

            });

            //Parse the file with the JSON object saved from scanner
            var obj = JSON.parse(fs.readFileSync("./token_output/unending_comments.token" , 'utf8'));

            // console.log(obj);

            assert.equal(Object.keys(obj).length, 0);


        })
    })
});