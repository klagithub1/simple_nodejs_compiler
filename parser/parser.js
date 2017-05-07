'use strict';

var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var str = require('string');
var StringScanner = require("StringScanner");
var Grammar = require('./Grammar.js');
var tokenLog = require('../loggers/TokenLogger.js');
var errorLog = require('../loggers/ErrCompilerLogger.js');
var Stack = require ('stackjs');
var SymbolTable = require('../sym_table/SymbolTable.js');
var tokenLog = require('../loggers/TokenLogger.js');
var errorLog = require('../loggers/ErrCompilerLogger.js');




var tokenIndex = 0;

var tokenId = 0;


var Parser  = function( grammar, tokenStream ){

    console.log('Initializing Parser....');


    this.SymbolStack = new Stack();

    this.tokenStream = tokenStream;

    this.parserGrammar = grammar  ;
};

Parser.prototype.advancePointer = function(){
    if (this.tokenStream[tokenIndex+1])
    {
        tokenIndex++;
    }
    else
    {
        console.log('Info: There is no more elements in the Token Stream. Exiting Program');
        tokenLog.info("Info: There is no more elements in the Token Stream. Exiting Program");

        process.exit();
    }
}

Parser.prototype.getCurrentToken = function(){

    if (this.tokenStream[tokenIndex])
    {
        return this.tokenStream[tokenIndex];
    }
    else
    {
        throw new Error;
    }
}

Parser.prototype.peekToken = function(){

    return this.tokenStream[tokenIndex+1];
}

Parser.prototype.hasNextToken = function(){
    if (this.tokenStream[tokenIndex+1])
    {
        return true;
    }
    else
    {
        return false;
    }
}

Parser.prototype.parse = function(){
    console.log('in: parse');
    tokenLog.info('in: parse');



    this.parseProgram(function(){

    });
}

Parser.prototype.parseProgram = function (callback){
    console.log('in: parseProgram');

    //this.parsedProgram['program-'+tokenId] = {};

    console.log('Info: Creating Initial Symbol Table');
    this.SymbolStack.push((new SymbolTable()));

    this.parseClassDeclaration(function(){

    });

    console.log('Info: Class Declaration Parsed');
    tokenLog.info('Info: Class Declaration Parsed');

    this.parseProgramBody(function(){

    });

    console.log('Info: Popping Initial Symbol Table');
    this.SymbolStack.pop();

    console.log("Info: Stack Size: "+this.SymbolStack.size() );
    tokenLog.info("Info: Stack Size: "+this.SymbolStack.size() )  ;




    callback();
}

Parser.prototype.parseClassDeclaration = function(callback){
    console.log('in: parseClassDeclaration');

    if ( ((this.getCurrentToken())['lexeme']).toLowerCase() == this.parserGrammar.ReservedKeywords['CLASS'] ){
        console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

        (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
        console.log((this.SymbolStack.peek()).search(tokenIndex));
       // console.log("scope depth: "+(this.SymbolStack.peek()).depth);

        this.advancePointer();

        if( ((this.getCurrentToken())['type'] ).toLowerCase() == "id" ){
            console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

            (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
            console.log((this.SymbolStack.peek()).search(tokenIndex));
           // console.log("scope depth: "+(this.SymbolStack.peek()).depth);


            this.advancePointer();

            if( ( (this.getCurrentToken())['type'] ).toLowerCase() == "opencurly" ){
                console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );
                this.advancePointer();

                //new symbol table
                console.log('Info: Creating  Symbol Table');
                this.SymbolStack.push((new SymbolTable()));

                this.parseVariableDeclaration(function(){
                });

                this.parseFunctionDefinition(function(){
                });

                if( ( (this.getCurrentToken())['type'] ).toLowerCase() == "closecurly"){
                    console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

                    //pop symbol table
                    this.SymbolStack.pop();
                    console.log("Info: Stack Size: "+( this.SymbolStack.size() ) );
                    tokenLog.info("Info: Stack Size: "+( this.SymbolStack.size() ) );

                    this.advancePointer();

                    if( (  (this.getCurrentToken())['type'] ).toLowerCase() == "semicolon" ){

                        console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );


                        (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
                        console.log((this.SymbolStack.peek()).search(tokenIndex));
                      //  console.log("scope depth: "+(this.SymbolStack.peek()).depth);


                        this.advancePointer();

                        if ( ((this.getCurrentToken())['lexeme']).toLowerCase() == this.parserGrammar.ReservedKeywords['CLASS'] ){
                            this.parseClassDeclaration(function(){

                            });
                        }
                    }
                }
            }
        }
    }
    callback();
}

Parser.prototype.parseProgramBody = function(callback){
    console.log('in: parseProgramBody');

    if ( ((this.getCurrentToken())['lexeme']).toLowerCase() == "program" ){
        console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

        (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
        console.log((this.SymbolStack.peek()).search(tokenIndex));
       // console.log("scope depth: "+(this.SymbolStack.peek()).depth);

        this.advancePointer();

        this.parseFunctionBody(function(){

        });


        if ( ((this.getCurrentToken())['type']).toLowerCase() == "semicolon" ){
            console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

            (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
            console.log((this.SymbolStack.peek()).search(tokenIndex));
          //  console.log("scope depth: "+(this.SymbolStack.peek()).depth);


            this.advancePointer();

            this.parseFunctionDefinition(function(){

            });
        }

        this.parseStatement(function(){
            //console.log('here');
        });

    }
    else{
        throw new Error;
    }
    callback();
}

Parser.prototype.parseFunctionHead = function(callback){
    console.log('in: parseFunctionHead');
    this.parseType(function(){

    });

    if ( ((this.getCurrentToken())['type']).toLowerCase() == "id" ){
        console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

        (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
        console.log((this.SymbolStack.peek()).search(tokenIndex));
       // console.log("scope depth: "+(this.SymbolStack.peek()).depth);

        this.advancePointer();
        if ( ((this.getCurrentToken())['type']).toLowerCase() == "openparenthesis" ) {
            console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

            (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
            console.log((this.SymbolStack.peek()).search(tokenIndex));
           // console.log("scope depth: "+(this.SymbolStack.peek()).depth);


            this.advancePointer();

            this.parseFParams(function(){

            });

            if ( ((this.getCurrentToken())['type']).toLowerCase() == "closeparenthesis" ) {
                console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

                (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
                console.log((this.SymbolStack.peek()).search(tokenIndex));
               // console.log("scope depth: "+(this.SymbolStack.peek()).depth);


                this.advancePointer();
            }
        }
    }
    callback();
}

Parser.prototype.parseFunctionDefinition = function(callback){
    console.log('in: parseFunctionDefinition');

    this.parseFunctionHead(function(){

    });

    this.parseFunctionBody(function(){

    });

    if( ( (this.getCurrentToken())['type'] ).toLowerCase() == "semicolon"){
        console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );


        (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
        console.log((this.SymbolStack.peek()).search(tokenIndex));


        this.advancePointer();

        if
            (
            (( (this.getCurrentToken())['type'] ).toLowerCase() == "float") ||
                (( (this.getCurrentToken())['type'] ).toLowerCase() == "int") ||
                (( (this.getCurrentToken())['type'] ).toLowerCase() == "id")
            )
        {
            this.parseFunctionDefinition(function(){
            });
        }
    }
    callback();
}

Parser.prototype.parseFunctionBody = function(callback){
    console.log('in: parseFunctionBody');

    if( (this.getCurrentToken()['type']).toLowerCase() == "opencurly" ){
        console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );
        this.advancePointer();

        console.log('Info: Creating  Symbol Table');
        this.SymbolStack.push((new SymbolTable()));

        this.parseVariableDeclaration(function(){

        });

        this.parseStatement(function(){

        });

        console.log('return func body');

        if( (this.getCurrentToken()['lexeme']).toLowerCase() == "}" ){
            console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

            //(this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
            //console.log((this.SymbolStack.peek()).search(tokenIndex));
           // console.log("scope depth: "+(this.SymbolStack.peek()).depth);

            this.advancePointer();

            this.SymbolStack.pop();

            console.log("Info: Stack Size: " + this.SymbolStack.size());
            tokenLog.info("Info: Stack Size: " + this.SymbolStack.size());

            //if( (this.getCurrentToken()['lexeme']).toLowerCase() == ";" ){
            //    console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );
            //    this.advancePointer();
            //}

        }
    }

    callback();
}

Parser.prototype.parseVariableDeclaration = function(callback){
    console.log('in: parseVariableDeclaration');

    this.parseType(function(){

    });

    if( ((this.getCurrentToken())['type'] ).toLowerCase() == "id" ){
        console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

        (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
        console.log((this.SymbolStack.peek()).search(tokenIndex));
      //  console.log("scope depth: "+(this.SymbolStack.peek()).depth);

        this.advancePointer();

        if( ((this.getCurrentToken())['lexeme'] ).toLowerCase() == "[" ){
            this.parseArraySize(function(){

            });
        }
        if( ((this.getCurrentToken())['type'] ).toLowerCase() == "semicolon" ){
           console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

            (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
            console.log((this.SymbolStack.peek()).search(tokenIndex));
           // console.log("scope depth: "+(this.SymbolStack.peek()).depth);

            this.advancePointer();

            //TODO
//            //Recursion to parse other variable declaration
//
//            if (
//                    (( (this.getCurrentToken())['lexeme'] ).toLowerCase() == "float") ||
//                    (( (this.getCurrentToken())['lexeme'] ).toLowerCase() == "int") ||
//                    (( (this.getCurrentToken())['type'] ).toLowerCase() == "id")
//                )
//            {
//                this.parseVariableDeclaration(function(){
//                });
//            }
       }
    }
    callback();
}

Parser.prototype.parseStatement = function(callback){
    console.log('in: parseStatement');


    this.parseAssignStatement(function(){

    });

    if(((this.getCurrentToken())['lexeme'] ).toLowerCase() == "if" ){
        console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

        (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
        console.log((this.SymbolStack.peek()).search(tokenIndex));
      //  console.log("scope depth: "+(this.SymbolStack.peek()).depth);


        this.advancePointer();

        if(((this.getCurrentToken())['lexeme'] ).toLowerCase() == "(" ){
            console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

            (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
            console.log((this.SymbolStack.peek()).search(tokenIndex));
           // console.log("scope depth: "+(this.SymbolStack.peek()).depth);


            this.advancePointer();
        }

    }
    else if(((this.getCurrentToken())['lexeme'] ).toLowerCase() == "for" ){
        console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

        (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
        console.log((this.SymbolStack.peek()).search(tokenIndex));
        console.log("scope depth: "+(this.SymbolStack.peek()).depth);


        this.advancePointer();

        if(((this.getCurrentToken())['lexeme'] ).toLowerCase() == "(" ){
            console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

            (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
            console.log((this.SymbolStack.peek()).search(tokenIndex));
           // console.log("scope depth: "+(this.SymbolStack.peek()).depth);


            this.advancePointer();

            this.parseType(function(){

            });

            if(((this.getCurrentToken())['type'] ).toLowerCase() == "id" ){
                console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

                (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
                console.log((this.SymbolStack.peek()).search(tokenIndex));
                //console.log("scope depth: "+(this.SymbolStack.peek()).depth);


                this.advancePointer();

                this.parseAssignOp(function(){
                });

                this.parseExpression(function(){

                });

                if(((this.getCurrentToken())['lexeme'] ).toLowerCase() == ";" ){
                    console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

                    (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
                    console.log((this.SymbolStack.peek()).search(tokenIndex));
                    //console.log("scope depth: "+(this.SymbolStack.peek()).depth);


                    this.advancePointer();


                    this.parseRelationalExpression(function(){

                    });

                    if(((this.getCurrentToken())['lexeme'] ).toLowerCase() == ";" ){
                        console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

                        (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
                        console.log((this.SymbolStack.peek()).search(tokenIndex));
                        //console.log("scope depth: "+(this.SymbolStack.peek()).depth);


                        this.advancePointer();

                        this.parseAssignStatement(function(){

                        });

                        if(((this.getCurrentToken())['lexeme'] ).toLowerCase() == ")" ){
                            console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

                            (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
                            console.log((this.SymbolStack.peek()).search(tokenIndex));
                            //console.log("scope depth: "+(this.SymbolStack.peek()).depth);

                            this.advancePointer();

                            this.parseStatementBlock(function(){

                            });

                            if(((this.getCurrentToken())['lexeme'] ).toLowerCase() == ";" ){
                                console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );
                                this.advancePointer();



                            }

                            //Recursion

                            this.parseStatement(function(){

                            });


                            if(((this.getCurrentToken())['lexeme'] ).toLowerCase() == "}" ){
                                console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );




                               // (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
                                //console.log((this.SymbolStack.peek()).search(tokenIndex));
                                //console.log("scope depth: "+(this.SymbolStack.peek()).depth);

                                this.advancePointer();


                                this.SymbolStack.pop();

                                console.log("Info: Stack Size:  "+this.SymbolStack.size());
                                tokenLog.info("Info: Stack Size:  "+this.SymbolStack.size());

                                if(((this.getCurrentToken())['lexeme'] ).toLowerCase() == ";" ){
                                    console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

                                    (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
                                    console.log((this.SymbolStack.peek()).search(tokenIndex));
                                   // console.log("scope depth: "+(this.SymbolStack.peek()).depth);

                                    this.advancePointer();



                                }
                            }
                        }
                    }
                }
            }
        }
    }
    else if(((this.getCurrentToken())['lexeme'] ).toLowerCase() == "get" ){
        console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

        (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
        console.log((this.SymbolStack.peek()).search(tokenIndex));
       // console.log("scope depth: "+(this.SymbolStack.peek()).depth);

        this.advancePointer();

        if(((this.getCurrentToken())['lexeme'] ).toLowerCase() == "(" ){
            console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

            (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
            console.log((this.SymbolStack.peek()).search(tokenIndex));
           // console.log("scope depth: "+(this.SymbolStack.peek()).depth);

            this.advancePointer();
        }


    }
    else if(((this.getCurrentToken())['lexeme'] ).toLowerCase() == "put" ){
        console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

        (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
        console.log((this.SymbolStack.peek()).search(tokenIndex));
       // console.log("scope depth: "+(this.SymbolStack.peek()).depth);

        this.advancePointer();

        if(((this.getCurrentToken())['lexeme'] ).toLowerCase() == "(" ){
            console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

            (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
            console.log((this.SymbolStack.peek()).search(tokenIndex));
           // console.log("scope depth: "+(this.SymbolStack.peek()).depth);

            this.advancePointer();
        }


    }
    else if(((this.getCurrentToken())['lexeme'] ).toLowerCase() == "return" ){
        console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

        (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
        console.log((this.SymbolStack.peek()).search(tokenIndex));
       // console.log("scope depth: "+(this.SymbolStack.peek()).depth);

        this.advancePointer();

        if(((this.getCurrentToken())['lexeme'] ).toLowerCase() == "(" ){
            console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

            (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
            console.log((this.SymbolStack.peek()).search(tokenIndex));
           // console.log("scope depth: "+(this.SymbolStack.peek()).depth);

            this.advancePointer();

            this.parseExpression(function(){

            });

            if(((this.getCurrentToken())['lexeme'] ).toLowerCase() == ")" ){
                console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

                (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
                console.log((this.SymbolStack.peek()).search(tokenIndex));
               // console.log("scope depth: "+(this.SymbolStack.peek()).depth);

                this.advancePointer();

                if(((this.getCurrentToken())['lexeme'] ).toLowerCase() == ";" ){
                    console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

                    (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
                    console.log((this.SymbolStack.peek()).search(tokenIndex));
                   // console.log("scope depth: "+(this.SymbolStack.peek()).depth);

                    this.advancePointer();

                    this.parseStatement(function(){

                    });
                }
            }
        }


    }


    callback();

}

Parser.prototype.parseAssignStatement = function(callback){
    console.log('in: parseAssignStatement');

    this.parseVariable(function(){

    });

    this.parseAssignOp(function(){

    });

    this.parseExpression(function(){

    });

    if(((this.getCurrentToken())['lexeme'] ).toLowerCase() == ";" ){
        console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

        (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
        console.log((this.SymbolStack.peek()).search(tokenIndex));
       // console.log("scope depth: "+(this.SymbolStack.peek()).depth);

        this.advancePointer();



    }



    callback();

}


Parser.prototype.parseStatementBlock = function(callback){
    console.log('in: parseStatementBlock');


    if(((this.getCurrentToken())['lexeme'] ).toLowerCase() == "{" ){
        console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );
        this.advancePointer();

        console.log('Info: Creating  Symbol Table');
        this.SymbolStack.push((new SymbolTable()));

        this.parseStatement(function(){

        }) ;

        if(((this.getCurrentToken())['lexeme'] ).toLowerCase() == "}" ){
            console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );
            this.advancePointer();

            this.SymbolStack.pop();
            console.log("Info: Stack Size: "+(this.SymbolStack.size()));
            tokenLog.info("Info: Stack Size: "+(this.SymbolStack.size()));

            if(((this.getCurrentToken())['lexeme'] ).toLowerCase() == ";" ){
                console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

                (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
                console.log((this.SymbolStack.peek()).search(tokenIndex));
               // console.log("scope depth: "+(this.SymbolStack.peek()).depth);

                this.advancePointer();
            }
        }
    }

    callback();

}


Parser.prototype.parseExpression = function(callback){
    console.log('in: parseExpression');

    this.parseArithmeticExpression(function(){

    });


    callback();

}


Parser.prototype.parseRelationalExpression = function(callback){

    console.log('in: parseRelationalExpression');

    this.parseTerm(function(){

    });

    this.parseRelOp(function(){

    });

    this.parseTerm(function(){

    });

    callback();

}


Parser.prototype.parseArithmeticExpression = function(callback){
    console.log('in: parseArithmeticExpression');

    this.parseTerm(function(){

    });

    callback();

}


Parser.prototype.parseSign = function(){

}


Parser.prototype.parseTerm = function(callback){
    console.log('in: parseTerm');



    this.parseFactor(function(){

    });

    //TODO Note one or the other  , refine into conditional

    this.parseMultOp(function(){

    });

    this.parseAddOp(function(){

    });

    this.parseFactor(function(){

    });



    callback();
}


Parser.prototype.parseFactor = function(callback){
    console.log('in: parseFactor');



    if( ((this.getCurrentToken())['type'] ).toLowerCase() == "id" ){
        console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

        (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
        console.log((this.SymbolStack.peek()).search(tokenIndex));
       // console.log("scope depth: "+(this.SymbolStack.peek()).depth);

        this.advancePointer();

        if( ((this.getCurrentToken())['lexeme'] ).toLowerCase() == "." ){
            console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

            (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
            console.log((this.SymbolStack.peek()).search(tokenIndex));
          //  console.log("scope depth: "+(this.SymbolStack.peek()).depth);

            this.advancePointer();

            if( ((this.getCurrentToken())['type'] ).toLowerCase() == "id" ){
                console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

                (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
                console.log((this.SymbolStack.peek()).search(tokenIndex));
               // console.log("scope depth: "+(this.SymbolStack.peek()).depth);

                this.advancePointer();

                if( ((this.getCurrentToken())['lexeme'] ).toLowerCase() == "(" ){
                    console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

                    (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
                    console.log((this.SymbolStack.peek()).search(tokenIndex));
                   // console.log("scope depth: "+(this.SymbolStack.peek()).depth);

                    this.advancePointer();

                    this.parseAParams(function(){

                    });

                    if( ((this.getCurrentToken())['lexeme'] ).toLowerCase() == ")" ){
                        console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

                        (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
                        console.log((this.SymbolStack.peek()).search(tokenIndex));
                       // console.log("scope depth: "+(this.SymbolStack.peek()).depth);

                        this.advancePointer();
                    }

                }


            }


        }

        if( ((this.getCurrentToken())['lexeme'] ).toLowerCase() == "(" ){
            console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

            (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
            console.log((this.SymbolStack.peek()).search(tokenIndex));
           // console.log("scope depth: "+(this.SymbolStack.peek()).depth);

            this.advancePointer();

            this.parseAParams(function(){

            });

            if( ((this.getCurrentToken())['lexeme'] ).toLowerCase() == ")" ){
                console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );


                (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
                console.log((this.SymbolStack.peek()).search(tokenIndex));
               // console.log("scope depth: "+(this.SymbolStack.peek()).depth);

                this.advancePointer();
            }

        }
    }




        callback();
}


    Parser.prototype.parseVariable = function(callback){
        console.log('in: parseVariable');

        if( ((this.getCurrentToken())['type'] ).toLowerCase() == "id" ){
            console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

            (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
            console.log((this.SymbolStack.peek()).search(tokenIndex));
           // console.log("scope depth: "+(this.SymbolStack.peek()).depth);

            this.advancePointer();
        }



        callback();

    }


    Parser.prototype.parseIdNest = function(){

    }


    Parser.prototype.parseIndice = function(){

    }


    Parser.prototype.parseArraySize = function(callback){
        console.log('in: parseArraySize');



        if( ((this.getCurrentToken())['lexeme'] ).toLowerCase() == "[" ){
            console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

            (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
            console.log((this.SymbolStack.peek()).search(tokenIndex));
           // console.log("scope depth: "+(this.SymbolStack.peek()).depth);

            this.advancePointer();

            if( ((this.getCurrentToken())['type'] ).toLowerCase() == "id" ){
                console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

                (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
                console.log((this.SymbolStack.peek()).search(tokenIndex));
                //console.log("scope depth: "+(this.SymbolStack.peek()).depth);

                this.advancePointer();

                if( ((this.getCurrentToken())['lexeme'] ).toLowerCase() == "]" ){
                    console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

                    (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
                    console.log((this.SymbolStack.peek()).search(tokenIndex));
                    //console.log("scope depth: "+(this.SymbolStack.peek()).depth);

                    this.advancePointer();

                    if( ((this.getCurrentToken())['lexeme'] ).toLowerCase() == "[" ){



                        (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
                        console.log((this.SymbolStack.peek()).search(tokenIndex));
                       // console.log("scope depth: "+(this.SymbolStack.peek()).depth);

                        this.parseArraySize(function(){

                        });
                    }

                }


            }


        }


        callback();

    }


    Parser.prototype.parseType = function(callback){

        console.log('in: parseType');
        if
            (
            (( (this.getCurrentToken())['lexeme'] ).toLowerCase() == "float") ||
                (( (this.getCurrentToken())['lexeme'] ).toLowerCase() == "int") ||
                (( (this.getCurrentToken())['lexeme'] ).toLowerCase() == "id")
            )
        {
            console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );


            (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
            console.log((this.SymbolStack.peek()).search(tokenIndex));
            //console.log("scope depth: "+(this.SymbolStack.peek()).depth);

            this.advancePointer();
        }
        callback();
    }



    Parser.prototype.parseFParams = function(callback){

        console.log('in parseFParams');


        this.parseType(function(){

        });

        if( ((this.getCurrentToken())['type'] ).toLowerCase() == "id" ){
            console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );


            (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
            console.log((this.SymbolStack.peek()).search(tokenIndex));
            //console.log("scope depth: "+(this.SymbolStack.peek()).depth);

            this.advancePointer();
        }
        else if ( ((this.getCurrentToken())['lexeme'] ).toLowerCase() == "array" ){
            console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

            (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
            console.log((this.SymbolStack.peek()).search(tokenIndex));
            //console.log("scope depth: "+(this.SymbolStack.peek()).depth);

            this.advancePointer();

            this.parseArraySize(function(){

            });
        }
        else if( ( ((this.getCurrentToken())['lexeme'] ).toLowerCase() == ")" )){
            //empty arguments for funciton
            console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );
            this.advancePointer();

        }

        //TODO the rest of it fo multiple params


        callback();
    }

Parser.prototype.parseAParams = function(callback){
        console.log('in: parseAParams');

        this.parseExpression(function(){

        });

        this.parseAParamsTail(function(){

        });

        callback();

}

Parser.prototype.parseFParamsTail = function(){

}

Parser.prototype.parseAParamsTail = function(callback){

    console.log('in parseAParamsTail');

    if( ((this.getCurrentToken())['lexeme'] ).toLowerCase() == "," ){
        console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

        (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
        console.log((this.SymbolStack.peek()).search(tokenIndex));
       // console.log("scope depth: "+(this.SymbolStack.peek()).depth);

        this.advancePointer();

        this.parseExpression(function(){
        });
    }

    callback();

}

Parser.prototype.parseAssignOp = function(callback){

    console.log('in: parseAssignOp');

    if ( ((this.getCurrentToken())['lexeme'] ).toLowerCase() == "=" ){
        console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

        (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
        console.log((this.SymbolStack.peek()).search(tokenIndex));
       // console.log("scope depth: "+(this.SymbolStack.peek()).depth);

        this.advancePointer();

    }

    callback();

}

Parser.prototype.parseAddOp = function(callback){
    console.log('in: parseAddOp');

    if ( ((this.getCurrentToken())['lexeme'] ).toLowerCase() == "+" ){
        console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

        (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
        console.log((this.SymbolStack.peek()).search(tokenIndex));
       // console.log("scope depth: "+(this.SymbolStack.peek()).depth);

        this.advancePointer();

    }
    else if ( ((this.getCurrentToken())['lexeme'] ).toLowerCase() == "-" ){
        console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

        (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
        console.log((this.SymbolStack.peek()).search(tokenIndex));
        //console.log("scope depth: "+(this.SymbolStack.peek()).depth);

        this.advancePointer();

    }
    else if ( ((this.getCurrentToken())['lexeme'] ).toLowerCase() == "or" ){
        console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

        (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
        console.log((this.SymbolStack.peek()).search(tokenIndex));
       // console.log("scope depth: "+(this.SymbolStack.peek()).depth);

        this.advancePointer();

    }

    callback();

}



Parser.prototype.parseRelOp = function(callback){
    console.log('in: parseRelOp');

    if ( ((this.getCurrentToken())['lexeme'] ).toLowerCase() == ">" ){
        console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

        (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
        console.log((this.SymbolStack.peek()).search(tokenIndex));
       // console.log("scope depth: "+(this.SymbolStack.peek()).depth);

        this.advancePointer();

    }
    else if ( ((this.getCurrentToken())['lexeme'] ).toLowerCase() == "<" ){
        console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

        (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
        console.log((this.SymbolStack.peek()).search(tokenIndex));
      //  console.log("scope depth: "+(this.SymbolStack.peek()).depth);

        this.advancePointer();

    }
    else if ( ((this.getCurrentToken())['lexeme'] ).toLowerCase() == ">=" ){
        console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

        (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
        console.log((this.SymbolStack.peek()).search(tokenIndex));
      //  console.log("scope depth: "+(this.SymbolStack.peek()).depth);

        this.advancePointer();

    }
    else if ( ((this.getCurrentToken())['lexeme'] ).toLowerCase() == "<=" ){
        console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

        (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
        console.log((this.SymbolStack.peek()).search(tokenIndex));
        //console.log("scope depth: "+(this.SymbolStack.peek()).depth);

        this.advancePointer();

    }
    else if ( ((this.getCurrentToken())['lexeme'] ).toLowerCase() == "<>" ){
        console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

        (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
        console.log((this.SymbolStack.peek()).search(tokenIndex));
       // console.log("scope depth: "+(this.SymbolStack.peek()).depth);

        this.advancePointer();

    }

    callback();

}

Parser.prototype.parseMultOp = function(callback){
    console.log('in: parseMultOp');

    if ( ((this.getCurrentToken())['lexeme'] ).toLowerCase() == "*" ){
        console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

        (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
        console.log((this.SymbolStack.peek()).search(tokenIndex));
       // console.log("scope depth: "+(this.SymbolStack.peek()).depth);

        this.advancePointer();

    }
    else if ( ((this.getCurrentToken())['lexeme'] ).toLowerCase() == "/" ){
        console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

        (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
        console.log((this.SymbolStack.peek()).search(tokenIndex));
        //console.log("scope depth: "+(this.SymbolStack.peek()).depth);

        this.advancePointer();

    }
    else if ( ((this.getCurrentToken())['lexeme'] ).toLowerCase() == "and" ){
        console.log( 'parsed: '+ ((this.getCurrentToken())['lexeme']).toLowerCase() );

        (this.SymbolStack.peek()).insertSymbol(tokenIndex,{type: ((this.getCurrentToken())['type']), lexeme:((this.getCurrentToken())['lexeme'])});
        console.log((this.SymbolStack.peek()).search(tokenIndex));
       // console.log("scope depth: "+(this.SymbolStack.peek()).depth);

        this.advancePointer();

    }

    callback();

}


module.exports = Parser;
