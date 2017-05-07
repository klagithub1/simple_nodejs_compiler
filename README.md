==============================
= COMP 6421 - Winter 2015    =
=                            =
= Student ID:                =
= (C) Concordia University   =
==============================


-------------------------
1. INSTALLING NODE.JS
-------------------------

Follow instructions on: http://nodejs.org/download/

INSTALLING AND UPDATING PACKAGES

-$ npm install

the package dependencies are in package.json

RUNNING THE LEXICAL ANALYZER

-$ node  scanner/sdriver.js

enter a filename from data_sample folder. If correctly tokenized, should appear as a JSON in token_output

RUNNING THE PARSER

-$ node  parser/pdriver.js

enter a filename from token_output folder. If correctly tokenized, should be fed to the parser as a JSON and then parsed.
If parsed corectly should be outputed on syntax_output as a .tree file.

RUNNING TEST CASES

-$ mocha test/[filename].js

CONSULTING THE OUTPUTS

log/error.log for all errors, including compilation errors
log/token.log for all tokens output during the scanning