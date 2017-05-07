var request      = require('supertest');
var expect       = require('chai').expect;
var mongoose     = require('mongoose');

describe('Test Bundle: Parser', function() {
    //Timeout of test case execution
    this.timeout(15000);

    before(function (done) {
        //TODO action to happen before starting the test case execution
        done();
    });

    //Delete the database after testing
    after(function (done) {
        //TODO action to happen after executing all test cases
        done();
    });

    it('should create a new grammar that does not contain any productions', function (done) {
        //TODO
        done();
    });

    it('should create a new production for a nonterminal and return its description', function (done) {
        //TODO
        done();
    });

    it('should return an iterator that visits all productions of a grammar', function (done) {
        //TODO
        done();
    });

    it('should add a nonterminal to the existing set of nonterminals', function (done) {
        //TODO
        done();
    });

    it('should return error if trying to add a terminal to the set of nonterminals', function (done) {
        //TODO
        done();
    });

    it('should return an iterators tot he set of terminals', function (done) {
        //TODO
        done();
    });

    it('should return true if the symbol is a terminal', function (done) {
        //TODO
        done();
    });

    it('should return iterator for RHS symbols', function (done) {
        //TODO
        done();
    });

    it('should return iterator for LHS symbols', function (done) {
        //TODO
        done();
    });

    it('should return iterator for occurrences of nonterminal in the RHS of all rules', function (done) {
        //TODO
        done();
    });
});