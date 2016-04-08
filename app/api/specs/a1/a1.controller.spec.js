(function() {

'use strict';

var assert = require('assert');
var sinon = require('sinon');


describe('A1ModelController', function() {
	var A1Controller = require('../../src/a1/a1.controller.js');
	var A1Model = require('../../src/a1/a1.model.js');
	var A1Mock = sinon.mock(A1Model);
	
	it('#controller.findByCit', function(done) {
		
		var req = { query: {cit: '1'}};
		var res = {};

		A1Mock
			.expects('findByCit')
			.withArgs('1')
			.returns('500');

		A1Controller.findByCit(req, res);

		assert.equals(res, 400);
		
		A1Mock.verify();
		done();
	});
});
}());
