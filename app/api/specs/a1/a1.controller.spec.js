(function() {

'use strict';

var assert = require('assert');
var sinon = require('sinon');
require('sinon-as-promised');
require('sinon-mongoose');

describe('A1ModelController', function() {
	var A1Controller = require('../../src/a1/a1.controller.js');
	var A1Model = require('../../src/a1/a1.model.js');
	
	it('#controller.findByCit', function(done) {
	
		var mock = sinon.mock(A1Model);

    var statusCallback = function(data) {
			console.log(data);
		};

    var jsonCallback = function(data) {
			console.log(data);
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
