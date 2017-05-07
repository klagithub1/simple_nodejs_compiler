var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var str = require('string');
var StringScanner = require("StringScanner");
var shortId = require('shortid');
var tokenLog = require('../loggers/TokenLogger.js');
var errorLog = require('../loggers/ErrCompilerLogger.js');
var TokenSaver = require('./TokenSaver.js');


var tokenId = 0;

var Scanner = function( instream, exportFilename ){

    errorLog.error("ERROR: Sample Error to be outputer");

    //define a placeholder for the tokens and compiler errors

    var Token = {};

    var CompilerError = {};

    //define a map of Punctuations
    var Punctuation = {
        '.':'DOT',
        ';':'SEMICOLON',
        ',':'COMMA',
        '(':'OPENPARENTHESIS',
        ')':'CLOSEPARENTHESIS',
        '{':'OPENCURLY',
        '}':'CLOSECURLY',
        '[':'OPENSQUARE',
        ']':'CLOSESQUARE'
     };

    //define a map of Reserved KeyWords
    var ReservedKeywords = {
        IF: 'IF',
        THEN: 'THEN',
        ELSE: 'ELSE',
        FOR: 'FOR',
        CLASS: 'CLASS',
        PROGRAM: 'PROGRAM',
        INT: 'INT',
        FLOAT: 'FLOAT',
        GET: 'GET',
        PUT: 'PUT',
        RETURN: 'RETURN'
    };

    //define a map of Boolean Operators
    var Booleans= {
        AND: 'AND',
        NOT: 'NOT',
        OR: 'OR'
    };

    //define a map of Operators
    var Operators= {
        '==':'RELEQUAL' ,
        '<>':'RELINEQUAL',
        '<':'LESS',
        '>':'MORE',
        '<=':'LESSEQUAL;',
        '>=':'MOREEQUAL',
        '+':'PLUSOP',
        '-':'MINUSOP',
        '*':'MULTIPLOP',
        '/':'DIVOP',
        '=':'EQUALOP'
    };

    //Create a stream to output content
    var outstream = new stream;
    var rl = readline.createInterface(instream, outstream);

    //Initialize a line counter
    var lineCounter = 0;
    var multiLineComment = 0;

    //End of file message
    rl.on('close', function() {

        //In case we opened a /* but never closd...
        if(multiLineComment == 1)
        {
            console.log("ERROR: The multiline comment was not closed properly.");
            errorLog.error("ERROR: The multiline comment was not closed properly.");

            //compiler error
            CompilerError[ tokenId++ ] = {
                type:'Missing parameter: CLosing multiple line comments',
                element:character,
                line: lineCounter,
                position:ii
            }
        }

        console.log("INFO: The File Scanning is Complete.");
        tokenLog.info("INFO: The File Scanning is Complete.");

        //Output all the tokens in a file
        tokenLog.info(Token);

        //Output all compiler errors in a file
        errorLog.error(CompilerError);
        TokenSaver(Token, exportFilename);  //Save the token collection into a plain text file
    });

    //iterate line-by-line
    rl.on('line', function(line) {

        //Displaying line numbers
       // console.log("\n\n\n" );
           console.log("INFO: Scanning Line : " + ++lineCounter);
           tokenLog.info("INFO: Scanning Line : " + ++lineCounter);
       // console.log("\n\n\n" );

        //If this line is empty then skip the rest and move on to the next line
        //empty means: solely composed of whitespaces, just and EoL, null or undefined.
        if(str(line).isEmpty())
        {
             console.log('INFO: Skipping Empty Line...');
              return;
        }

        //Declare a String Scanner Class to scan characters of a line
        var ss = new StringScanner(line);

        //Scan the Line character-by-character
        for ( ii=0; ii < str(line).length; ii++)
        {
            //Analyze current Character
            character = ss.getChar();

           // console.log('character:  '+ii+' CHARACTER IS: ' + character);

            if(multiLineComment ==1 && character != "*")
            {
                console.log('INFO: Multi-Line Comment Block, Ignored.');
            }
            else if (multiLineComment ==1 && character == "*")
            {
                if (ss.peek(1) == "/")
                {
                   // console.log('INFO: Multiblock comments are completed.');
                    multiLineComment = 0;
                    ii++; //skip the '/'
                }
            }
            // Ignoring Whitespaces
            else if(character == ' ')
            {
                //console.log('ignore whitespace');
            }
            //Ignoring Comments Single Line
            else if (character == "/")
            {
                //console.log('entering comment area...');

                //If we have / following a /
                if(ss.peek(1) == "/")
                {
                   // console.log('INFO: Ignoring rest of the line');
                    //Ignore the rest of the line and move to the next line
                    return;
                }
                else if (ss.peek(1) == "*")
                {
                    //console.log('next char:'+ss.peek(1)+'we are dealing with MULTIPLE line comment here...ignore the rest of this line');
                   // console.log('INFO: Starting Multi-line Comments');
                    multiLineComment = 1;
                    return; //skip the rest of the line...
                }
                else
                {
                    //In case it is not followed by either / or * then it is a division   operator
                    //console.log(Operators.DIVIDEOP == "/");

                    //Token Identified division operator
                    Token[ tokenId++ ] = {
                        type:Operators[character],
                        lexeme:character,
                        line: lineCounter,
                        position:ii
                    }

                }
            }
            //If we are dealing with an Operator
            else if (character in Operators)
            {
               //console.log('is in there');
               //console.log('--Char:  '+Operators[character]) ;

                //Check for double equal
                if (character == "=")
                {
                      if(ss.peek(1)=="=")
                      {
                         // console.log("---> here: "+Operators[character+ss.peek(1)]);

                          //Token Identified
                          Token[ tokenId++ ] = {
                              type:Operators[character+ss.peek(1)],
                              lexeme:character+ss.peek(1),
                              line: lineCounter,
                              position:ii
                          }

                          //Move pointer by 1 to skip the next =
                          ii++;
                      }
                      else
                      {
                          //single equal
                          //Token Identified
                          Token[ tokenId++ ] = {
                              type:Operators[character],
                              lexeme:character,
                              line: lineCounter,
                              position:ii
                          }
                      }
                }
                else if (character == "<")
                {
                    if(ss.peek(1)==">")
                    {
                        //console.log("---> here: "+Operators[character+ss.peek(1)]);
                        //Token Identified
                        Token[ tokenId++ ] = {
                            type:Operators[character+ss.peek(1)],
                            lexeme:character+ss.peek(1),
                            line: lineCounter,
                            position:ii
                        }

                        //Move pointer by 1 to skip the next =
                        ii = ii+2;
                    }
                    else if (ss.peek(1)=="=")
                    {
                        //console.log("---> here: "+Operators[character+ss.peek(1)]);
                        //Token Identified
                        Token[ tokenId++ ] = {
                            type:Operators[character+ss.peek(1)],
                            lexeme:character+ss.peek(1),
                            line: lineCounter,
                            position:ii
                        }

                        //Move pointer by 1 to skip the next =
                        ii++;
                    }
                    else
                    {
                        //Token Identified
                        Token[ tokenId++ ] = {
                            type:Operators[character],
                            lexeme:character,
                            line: lineCounter,
                            position:ii
                        }
                    }
                }
                else if (character == ">")
                {
                    if (ss.peek(1)=="=")
                    {
                        //console.log("---> here: "+Operators[character+ss.peek(1)]);
                        //Token Identified
                        Token[ tokenId++ ] = {
                            type:Operators[character+ss.peek(1)],
                            lexeme:character+ss.peek(1),
                            line: lineCounter,
                            position:ii
                        }

                        //Move pointer by 1 to skip the next =
                        ii++;
                    }
                    else
                    {
                        //Token Identified
                        Token[ tokenId++ ] = {
                            type:Operators[character],
                            lexeme:character,
                            line: lineCounter,
                            position:ii
                        }
                    }
                }
                else
                {
                    //just another type of operator
                    //Token Identified
                    Token[ tokenId++ ] = {
                        type:Operators[character],
                        lexeme:character,
                        line: lineCounter,
                        position:ii
                    }
                }
            }
            //If we are dealing with a Punctuation
            else if (character in Punctuation && character != ".")
            {
                Token[ tokenId++ ] = {
                    type:Punctuation[character],
                    lexeme:character,
                    line: lineCounter,
                    position:ii
                }
            }
            //Check for FRACTION, they always start with a dot, but sometimes . may simply be punctuation
            else if (character == ".")
            {
                if ( str( ss.peek(1) ).isNumeric() &&  str( ss.peek(1)) != '')
                {


                    //Insert a new Token
                    Token[ tokenId++ ] = {
                        type:'FRACTION',
                        lexeme:character+ss.scanUntil(/[0-9]+/),
                        line: lineCounter,
                        position:ii
                    }

                    //Since we scanned, advance the pointer of the characters
                    ii = ii + (ss.pointer()-1);
                }
                else
                {
                   // console.log(str( ss.peek(1)) + character+' is PUNCTUATION' );
                    Token[ tokenId++ ] = {
                        type:Punctuation[character],
                        lexeme:character,
                        line: lineCounter,
                        position:ii
                    }
                }
            }
            //Check for numerical characters integer and floats
            else if ( str(character).isNumeric() && str(character) != '' )
            {
                //console.log( '>>non numeric:  ' + character);


                if( (character == "0") && ( !( ss.peek(-1).isNumeric ) ) )
                {
                  // console.log('we are dealign with digits');
                        Token[ tokenId++ ] = {
                            type:'DIGIT',
                            lexeme:character,
                            line: lineCounter,
                            position:ii
                        }
                }
                else if ( x = ss.scanUntil(/[0-9]+\.[0-9]+/))
                {
                    //console.log('is: '+ character + x);
                    Token[ tokenId++ ] = {
                        type:'FLOAT',
                        lexeme:character+x,
                        line: lineCounter,
                        position:ii
                    }

                    ii = ii+(ss.pointer()-1);
                }
                else  // at this point it is at least an integer
                {
                    Token[ tokenId++ ] = {
                        type:'INTEGER',
                        lexeme:character+ss.scanUntil(/[0-9]+/),
                        line: lineCounter,
                        position:ii
                    }

                    ii = ii+(ss.pointer()-1);
                }
            }
            //Dealing with identifiers
            else if (!(character == null) && (str(character).isAlpha()))
            {
              // console.log('di: '+character);
               if (y = ss.scanUntil(/\w+/))
               {
                   //Check if it is reserved word
                   if( (character+y).toUpperCase() in ReservedKeywords )
                   {
                       Token[ tokenId++ ] = {
                           type:'RESERVED',
                           lexeme: (character+y).toLowerCase(),
                           line: lineCounter,
                           position:ii
                       }
                       ii = ii+(ss.pointer()-1);
                   }
                   else if( (character+y).toUpperCase() in Booleans )
                   {
                       Token[ tokenId++ ] = {
                           type:'BOOLEAN',
                           lexeme:Booleans[character+y],
                           line: lineCounter,
                           position:ii
                       }
                       ii = ii+(ss.pointer()-1);
                   }
                   else
                   {
                       Token[ tokenId++ ] = {
                           type:'ID',
                           lexeme:character+y,
                           line: lineCounter,
                           position:ii
                       }
                       ii = ii+(ss.pointer()-1);
                   }
               }
            }
            else
            {
                errorLog.error("ERROR: Invalid Identifier.");
                CompilerError[ tokenId++ ] = {
                    type:'Invalid Identifier',
                    element:character,
                    line: lineCounter,
                    position:ii
                }
            }
        }
    });
};

module.exports = Scanner;