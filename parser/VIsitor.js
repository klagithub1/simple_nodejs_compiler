'use strict';



var Visitor  = function(mapItem){

    this.Visited = {};

    this.MapItem = mapItem;


}


Visitor.prototype.addToVisited = function(item, callback) {

    this.Visited.push(item);


    callback();
}

Visitor.prototype.get = function(item, callback) {

    this.Visited.push(item);


    callback();
}


module.exports = Visitor;


