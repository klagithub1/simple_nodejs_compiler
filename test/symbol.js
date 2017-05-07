var request      = require('supertest');
var expect       = require('chai').expect;
var mongoose     = require('mongoose');
var Symbol       = require('../sym_table/Symbol.js');
var SymbolTable  = require('../sym_table/SymbolTable.js');
var Stack        = require('stackjs');
var assert = require("assert");
var fs = require('fs');

describe('Test Bundle: Symbol Table', function() {
    //Timeout of test case execution
   // this.timeout(15000);

    //var sourceCode = {};

    /*
    before(function (done) {
        fs.readFile('./token_output/example.txt.java.token', 'utf8', function (err, data) {
            if (err)
            {
              done(err);
            }
            sourceCode  = JSON.parse(data);
        });
    });


    after(function (done) {
       //Nullify source code
        //DO cleanup
        sourceCode = null;
    });
    */
     /*
    it('should create a Symbol and make sure its type is configured correctly', function (done) {
        var Symbol = new Symbol('test_symbol',{type: "ID"});


        assert.equal(Symbol[type], Symbol.getType());


        done();
    });

    it('should create a Symbol and make sure its name is configured correctly', function (done) {
        var Symbol = new Symbol('test_symbol',{type: "ID"});


        assert.equal(Symbol[name], Symbol.getName());


        done();
    });

    it('should create a Symbol Table', function (done) {
        var SymbolTable = new SymbolTable();
        SymbolTable.insertSymbol('test_symbol','test_value')   ;

       assert.equal(SymbolTable.search('test_symbol'),'test_value')
    });
    */

    it('tc1: Should detect an undefined id: variable, class, function', function () {

        var SampleStack = new Stack();

        var declared;

        var sampleTokenStream = {
            "0": {
                "type": "OPENCURLY",
                "lexeme": "{"
            },
            "1": {
                "type": "ID",
                "lexeme": "5"
            },
            "2": {
                "type": "SEMICOLON",
                "lexeme": ";"
            },

            "3": {
                "type": "CLOSECURLY",
                "lexeme": "}"
            }
        };

        for (var key in sampleTokenStream)
        {
            if( ( sampleTokenStream[key]['lexeme'] ).toLowerCase() == "{" ){
                  SampleStack.push((new SymbolTable()));
            }
            else if ( ( sampleTokenStream[key]['lexeme'] ).toLowerCase() == "}"  )
            {
               // SampleStack.pop();
            }
            else
            {

               if(sampleTokenStream[key]['type'] == "ID")
               {


                   if (sampleTokenStream[(key-1)]['type'] == "RESERVED"){


                       ( SampleStack.peek() ).insertSymbol(key, {
                           type: sampleTokenStream[key]['type'],
                           lexeme:sampleTokenStream[key]['lexeme'],
                           declared: true} );
                   }
                   else
                   {
                       ( SampleStack.peek() ).insertSymbol(key, {
                           type: sampleTokenStream[key]['type'],
                           lexeme:sampleTokenStream[key]['lexeme'],
                           declared: false} );
                   }
                 }

                console.log(( SampleStack.peek() ));
            }
        }

        assert.equal(false,( SampleStack.peek() ).search([1])['declared']);
    });

    it('tc2: Should resolve the type of an assignment statement', function () {

        /*
           int total;

           int var1;
           float var2;

           total = var1+ var2;

           the var1+var2 should be of type int and match the type of total



         */


        var SampleStack = new Stack();

        var declared;

        var sampleTokenStream = {
            "0": {
                "type": "OPENCURLY",
                "lexeme": "{"
            },
            "1": {
                "type": "ID",
                "lexeme": "total"
            },
            "2": {
                "type": "EQUALOP",
                "lexeme": "="
            },
            "3": {
                "type": "NUM",
                "lexeme": "2"
            },

            "4": {
                "type": "ADDOP",
                "lexeme": "+"
            },

            "5": {
                "type": "FLOAT",
                "lexeme": "8.676"
            },

            "6": {
                "type": "SEMICOLON",
                "lexeme": ";"
            },

            "7": {
                "type": "CLOSECURLY",
                "lexeme": "}"
            }
        };

        for (var key in sampleTokenStream)
        {
            if( ( sampleTokenStream[key]['lexeme'] ).toLowerCase() == "{" ){
                SampleStack.push((new SymbolTable()));
            }
            else if ( ( sampleTokenStream[key]['lexeme'] ).toLowerCase() == "}"  )
            {
                // SampleStack.pop();
            }
            else
            {

                if(sampleTokenStream[key]['type'] == "NUM")
                {

                    ( SampleStack.peek() ).insertSymbol(key, {
                        type: sampleTokenStream[key]['type'],
                        lexeme:sampleTokenStream[key]['lexeme'],
                        rank: 1} );

                }
                else if (sampleTokenStream[key]['type'] == "FLOAT")
                {
                    ( SampleStack.peek() ).insertSymbol(key, {
                        type: sampleTokenStream[key]['type'],
                        lexeme:sampleTokenStream[key]['lexeme'],
                        rank: 2} );
                }

                else
                {
                    ( SampleStack.peek() ).insertSymbol(key, {
                        type: sampleTokenStream[key]['type'],
                        lexeme:sampleTokenStream[key]['lexeme']} );
                }

                console.log(( SampleStack.peek() ));
            }
        }

        assert.notEqual(( SampleStack.peek() ).search([5])['rank'],( SampleStack.peek() ).search([3])['rank']);
    });

   /* it('tc3: Multiply defined id should de identified', function () {


         //int total;

        // int var1;
        // float var2;

        // total = var1+ var2;

        // the var1+var2 should be of type int and match the type of total






        var SampleStack = new Stack();



        var sampleTokenStream = {
            "0": {
                "type": "OPENCURLY",
                "lexeme": "{"
            },
            "1": {
                "type": "RESERVED",
                "lexeme": "int"
            },
            "2": {
                "type": "ID",
                "lexeme": "total"
            },
            "3": {
                "type": "SEMICOLON",
                "lexeme": ";"
            },

            "4": {
                "type": "RESERVED",
                "lexeme": "int"
            },

            "5": {
                "type": "ID",
                "lexeme": "total"
            },

            "6": {
                "type": "SEMICOLON",
                "lexeme": ";"
            },

            "7": {
                "type": "CLOSECURLY",
                "lexeme": "}"
            }
        };

        for (var key in sampleTokenStream)
        {
            if( ( sampleTokenStream[key]['lexeme'] ).toLowerCase() == "{" ){
                SampleStack.push((new SymbolTable()));
            }
            else if ( ( sampleTokenStream[key]['lexeme'] ).toLowerCase() == "}"  )
            {
                // SampleStack.pop();
            }
            else
            {






                }
                else
                {
                    ( SampleStack.peek() ).insertSymbol(key, {
                        type: sampleTokenStream[key]['type'],
                        lexeme:sampleTokenStream[key]['lexeme']} );
                }

                console.log(( SampleStack.peek() ));
            }
        }

        assert.notEqual(( SampleStack.peek() ).search([5])['rank'],( SampleStack.peek() ).search([3])['rank']);
    });
        */




    /*
    it('should insert an item to Stack', function (done) {


        done();
    });

    it('should count the depth of a Symbol Table', function (done) {
        var SymbolTable0 = new SymbolTable();
        var SymbolTable1 = new SymbolTable();
        var SymbolTable2 = new SymbolTable();
         assert.equal(2,SymbolTable2.depth);
        done();
    });  */

});