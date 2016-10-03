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

it('should return 404 if foto informeId is not sent', function(done) {
		var mock = sinon.mock(FotoModel);

		var statusCallback = function(status) {
			status.should.equal(404);
		};

		var jsonCallback = function(json) {
			json.message.should.equal('informeId not found');
			mock.restore();
			done();		
		};
		
		var req = { params: {id: 1}, body: {}};
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		FotoController.update(req, res);
	});

	it('should return 400 if promise is rejected while searching for informeId and tags', function(done) {
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
			.expects('findOne')
			.withArgs({informeId: 1, tags: {$in: undefined}})
			.chain('select').withArgs('_id')
			.chain('exec')
			.rejects('error');

		FotoController.update(req, res);
	});


	it('should return 400 if promise is rejected because another foto exist with the same tag', function(done) {
		var mock = sinon.mock(FotoModel);

		var statusCallback = function(status) {
			status.should.equal(400);
		};

		var jsonCallback = function(json) {
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
			.expects('findOne')
			.withArgs({informeId: 1, tags: {$in: undefined}})
			.chain('select').withArgs('_id')
			.chain('exec')
			.resolves({_id: 2});

		FotoController.update(req, res);
	});

	it('should return 404 if foto is not found while updating', function(done) {
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
			.expects('findOne')
			.withArgs({informeId: 1, tags: {$in: undefined}})
			.chain('select').withArgs('_id')
			.chain('exec')
			.resolves({_id: 1});

		mock
			.expects('findOneAndUpdate')
			.withArgs(
				{id: 1}, 
				{ 
                	tags: undefined,
                    descripcion: undefined
                }
            )
            .chain('exec')
			.resolves(null);

		FotoController.update(req, res);
	});

	it('should return 200', function(done) {
		var mock = sinon.mock(FotoModel);

		var statusCallback = function(status) {
			status.should.equal(200);
		};

		var jsonCallback = function(json) {
			json.should.equal(1);
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
			.expects('findOne')
			.withArgs({informeId: 1, tags: {$in: undefined}})
			.chain('select').withArgs('_id')
			.chain('exec')
			.resolves({_id: 1});

		mock
			.expects('findOneAndUpdate')
			.withArgs(
				{id: 1}, 
				{ 
                	tags: undefined,
                    descripcion: undefined
                }
            )
            .chain('exec')
			.resolves({_id: 1});

		FotoController.update(req, res);
	});
});
}());
