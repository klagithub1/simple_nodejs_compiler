var Grammar = function(){

    //Declaration of Enumerations and other helpers

    //define a map of Punctuations
     this.Punctuation = {
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
    this.ReservedKeywords = {
        IF: 'IF',
        THEN: 'THEN',
        ELSE: 'ELSE',
        FOR: 'FOR',
        CLASS: 'class',
        INT: 'INT',
        FLOAT: 'FLOAT',
        GET: 'GET',
        PUT: 'PUT',
        RETURN: 'RETURN',
        PROGRAM: 'program'
    };

    //define a map of Boolean Operators
     this.Booleans= {
        AND: 'AND',
        NOT: 'NOT',
        OR: 'OR'
    };

    //define a map of Operators
     this.Operators= {
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

    //define a map of non-terminals

    this.NonTerminals= {
        '<prog>' :    'prog',
        '<classDecl>' : 'classDecl',
        '<progBody>' : 'progBody',
        '<funcHead>' :  'funcHead',
        '<funcDef>' : 'funcDef',
        '<funcBody>' : 'funcBody',
        '<varDecl>' :  'varDecl',
        '<statement>' :  'statement',
        '<assignStat>' : 'assignStat',
        '<statBlock>' :  'statBlock',
        '<expr>' :   'expr',
        '<relExpr>' :  'relExpr',
        '<arithExpr>' :   'arithExpr',
        '<sign>' :  'sign',
        '<term>' :  'term',
        '<factor>' : 'factor',
        '<variable>' : 'variable',
        '<idnest>' :  'idnest',
        '<indice>' :     'indice',
        '<arraySize>' :  'arraySize',
        '<type>' :   'type',
        '<fParams>' :  'fParams',
        '<aParams>' :   'aParams',
        '<fParamsTail>' : 'fParamsTail',
        '<aParamsTail>' :   'aParamsTail',
        '<similTerm>' :   'similTerm',
        '<similAddOp>'  :  'similAddOp',
        '<similFactor>' : 'similFactor',
        '<similMultOp>' :'similMultOp' ,
        '<assignOp>' :     'assignOp',
        '<relOp>' :  'relOp',
        '<addOp>' :  'addOp',
        '<multOp>' :   'multOp'
    };
}


module.exports = Grammar;
