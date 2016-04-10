(function() {

'use strict';

var sinon = require('sinon');
require('sinon-as-promised');
require('sinon-mongoose');
var should = require('chai').should();

describe('A1ModelController', function() {
	var A1Controller = require('../../src/a1/a1.controller.js');
	var A1Model = require('../../src/a1/a1.model.js');
	
	it('should return A1 by CIT', function(done) {
	
	var mock = sinon.mock(A1Model);

    var statusCallback = function(status) {
			status.should.equal(200);
		};

    var jsonCallback = function(json) {
			json.should.equal('success');
			mock.restore();
			done();		
		};
	
		var req = { query: {cit: '1'}};
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		mock
			.expects('findByCit')
			.withArgs('1')
			.resolves('success');
	
		A1Controller.findByCit(req, res);
	});
});
}());
