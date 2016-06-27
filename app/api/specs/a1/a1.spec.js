(function() {

'use strict';

var assert = require('assert');
var sinon = require('sinon');

require('sinon-mongoose');
require('sinon-as-promised');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');


describe('A1Model', function() {
	var A1Model = require('../../src/a1/a1.model.js');

	it('getByNumeroTramite', function(done) {
		var A1Mock = sinon.mock(A1Model);
		var a1s = [{numeroTramite: '1'}];
		
		A1Mock
			.expects('findOne')
			.withArgs({numeroTramite: '1'})
			.chain('select')
			.withArgs('-sequence -__v')
			.chain('exec')
			.resolves(a1s);
		
		A1Model
			.getByNumeroTramite('1')
			.then(
				function(result) {
					assert.equal(result, a1s);
					A1Mock.verify();
					A1Mock.restore();
					done();
				}
			);
	});

	it('getByCit', function(done) {
		var A1Mock = sinon.mock(A1Model);
		var a1s = [{cit: '1'}];
		
		A1Mock
			.expects('findOne')
			.withArgs({cit: '1'})
			.chain('select')
			.withArgs('-sequence -__v')
			.chain('exec')
			.resolves(a1s);
		
		A1Model
			.getByCit('1')
			.then(
				function(result) {
					assert.equal(result, a1s);
					A1Mock.verify();
					A1Mock.restore();
					done();
				}
			);
	});
});
}());
