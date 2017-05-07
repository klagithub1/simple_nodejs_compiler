var request      = require('supertest');
var expect       = require('chai').expect;
var mongoose     = require('mongoose');
var Symbol       = require('../sym_table/Symbol.js');
var SymbolTable  = require('../sym_table/SymbolTable.js');
var Stack        = require('stackjs');
var assert = require("assert");
var fs = require('fs');

describe('Test Bundle: Code Generation', function() {

    it('tc1: Should generate assembly code for int variable memory allocation', function () {

       var sample = {
            op: "lw",
            reg : {
                r1: "R1",
                r2: "K(R1)"
            }

        } ;


        var generated = {

        } ;

        var sampleParsedProgram = {

            "Class_Declarations" : {
                "0":{
                    variableDeclarations:{
                        "0":
                        {
                            type: "INT" ,
                            value: "6"

                        }
                    }
                }
            }
        };

        //Should retrieve the type and the value and export "lw R1, K(R1)"

        assert.equal(sample,generated);
    });

});