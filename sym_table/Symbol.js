function Symbol(name, type)
{
   this.name = name;
   this.type = type;
}

Symbol.prototype.getName = function(){

    return this.name;
}

Symbol.prototype.getType = function(){

    return this.type;
}

Symbol.prototype.toString = function(){

    return "Symbol: name: \""+this.name+ "\" type: \""+this.type+"\"";
}

module.exports = Symbol;