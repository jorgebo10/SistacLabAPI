(function() {

'use strict';

var sinon = require('sinon');
require('sinon-as-promised');
require('sinon-mongoose');
var should = require('chai').should();

describe('FotoController', function() {
	var FotoController = require('../../src/foto/foto.controller.js');
	var FotoModel = require('../../src/foto/foto.model.js');
	var ImageUtils = require('../../../utils/image.utils');

	
	it('should return 404 if foto id is not sent', function(done) {
		var mock = sinon.mock(FotoModel);

		var statusCallback = function(status) {
			status.should.equal(404);
		};

		var jsonCallback = function(json) {
			json.message.should.equal('id not found in request params');
			mock.restore();
			done();		
		};
		
		var req = { params: {}};
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		FotoController.update(req, res);
	});


	it('should return 400 if promise is rejected', function(done) {
		var mock = sinon.mock(FotoModel);

		var statusCallback = function(status) {
			status.should.equal(400);
		};

		var jsonCallback = function(json) {
			json.message.should.equal('error');
			mock.restore();
			done();		
		};
		
		var req = { 
			params: {id: 1},
			body: {informeId: 1}
		};

		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		mock
			.expects('findById')
			.withArgs(1)
			.chain('select').withArgs('-sequence -__v')
			.chain('exec')
			.rejects('error');

		FotoController.update(req, res);
	});

	it('should return 400 if foto to update is not found', function(done) {
		var mock = sinon.mock(FotoModel);

		var statusCallback = function(status) {
			status.should.equal(404);
		};

		var jsonCallback = function(json) {
			json.message.should.equal('No results found while searching by id 1');
			mock.restore();
			done();		
		};
		
		var req = { 
			params: {id: 1},
			body: {informeId: 1}
		};

		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		mock
			.expects('findById')
			.chain('select').withArgs('-sequence -__v')
			.chain('exec')
			.resolves(null);

		FotoController.update(req, res);
	});

	it('should return 400 if foto to update found but error thrown', function(done) {
		var mock = sinon.mock(FotoModel);
		var foto = {};

		var statusCallback = function(status) {
			status.should.equal(400);
		};

		var jsonCallback = function(json) {
			json.message.should.equal('error');
			mock.restore();
			done();		
		};
		
		var req = { 
			params: {id: 1},
			body: {informeId: 1}
		};

		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		mock
			.expects('findById')
			.chain('select').withArgs('-sequence -__v')
			.chain('exec')
			.resolves(foto);

		mock
			.expects('findOne')
			.withArgs({informeId: 1, tags: {$in: undefined}})
			.chain('select').withArgs('_id')
			.chain('exec')
			.rejects('error');

		FotoController.update(req, res);
	});

	it('should return 400 if foto tag is already duplicated', function(done) {
		var mock = sinon.mock(FotoModel);
		var foto = {_id: 1};

		var statusCallback = function(status) {
			status.should.equal(400);
			console.log(status);
		};

		var jsonCallback = function(json) {
			console.log(json);
			json.message.should.equal('Tags already assinged');
			mock.restore();
			done();		
		};
		
		var req = { 
			params: {id: 1},
			body: {informeId: 1}
		};

		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		mock
			.expects('findById')
			.chain('select').withArgs('-sequence -__v')
			.chain('exec')
			.resolves(foto);

		mock
			.expects('findOne')
			.withArgs({informeId: 1, tags: {$in: undefined}})
			.chain('select').withArgs('_id')
			.chain('exec')
			.resolves({_id: 2});

		FotoController.update(req, res);
	});
});
}());
