(function() {

'use strict';

var assert = require('assert');
var sinon = require('sinon');

require('sinon-mongoose');
require('sinon-as-promised');

describe('A1Model', function() {
	var A1Model = require('../../src/a1/a1.model.js');
	var A1Mock = sinon.mock(A1Model);
	
	it('#findByCit', function(done) {
		var a1s = [{cit: '1'}];
		
		A1Mock
			.expects('find')
			.withArgs({cit: '1'})
			.chain('select')
			.withArgs('-sequence -__v')
			.chain('exec')
			.resolves(a1s);
		
		A1Model
			.findByCit('1')
			.then(
				function(result) {
					A1Mock.verify();
					A1Mock.restore();
					assert.equal(result, a1s);
					done();
				}
			);
	});
});
}());
