//Private Attributes

//Reference to the Parent
var depth = -1;

function SymbolTable(){

    //The private attribute Parent should be populated with the Parent argument passed from constructor



    //Class attributes
    this.depth = depth;
    this.SymTable = {};

    //Increment Scope
    depth++;
}

//Get Parent, next node in linked list
//SymbolTable.prototype.getParent = function(){
//    return this.Parent;
//}

//Insert a symbol
SymbolTable.prototype.insertSymbol = function(symbolName, symbolValue){
    this.SymTable[symbolName] = symbolValue;
}

//Search for a symbol
SymbolTable.prototype.search = function(symbolName){

    if(symbolName in this.SymTable)
    {
        return this.SymTable[symbolName];
    }
    else
    {
        throw ("ERROR: Symbol Not Found in Table!");
    }
}

//Print All Symbols
SymbolTable.prototype.printAllSymbols = function(){
    return this.SymTable;
}

//Delete a symbol
SymbolTable.prototype.delete = function(symbolName){
    if(symbolName in this.SymTable)
    {
        return (delete this.SymTable[symbolName]);
    }
    else
    {
        throw ("ERROR: Symbol you are Trying to Delete, Not Found in Table!");
    }
}

module.exports = SymbolTable;