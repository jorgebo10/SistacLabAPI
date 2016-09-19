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

	it('should return 204 if foto was removed ok', function(done) {
		var mock = sinon.mock(FotoModel);
		var imageUtilsMock = sinon.mock(ImageUtils);
		var foto = {id: '1', filename: 'myphoto', ext: 'jpg'};

		var statusCallback = function(status) {
			status.should.equal(204);
		};

		var jsonCallback = function(json) {
			should.not.exist(json);
			mock.restore();
			done();		
		};
		
		var req = { params: {id: '1'} };
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		imageUtilsMock
			.expects('unlink')
			.withArgs(foto.filename, foto.ext)
			.returns(null);


		mock
			.expects('findByIdAndRemove')
			.chain('select').withArgs('filename ext')
			.chain('exec')
			.resolves({filename: foto.filename, ext: foto.ext});

		FotoController.deleteById(req, res);
	});

	it('should return 400 if there was an error while removing a photo', function(done) {
		var mock = sinon.mock(FotoModel);
		var foto = {id: '1'};

		var statusCallback = function(status) {
			status.should.equal(400);
		};

		var jsonCallback = function(json) {
			json.message.should.equal('error');
			mock.restore();
			done();		
		};
		
		var req = { params: {id: '1'} };
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		mock
			.expects('findByIdAndRemove')
			.chain('select').withArgs('filename ext')
			.chain('exec')
			.rejects('error');
		
		FotoController.deleteById(req, res);
	});

	it('should return 404 if foto not found by id while deleting', function(done) {

		var statusCallback = function(status) {
			status.should.equal(404);
		};

		var jsonCallback = function(json) {
			json.message.should.equal('id not found in request params');
			done();		
		};
		
		var req = { params: {id: ''}};
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		FotoController.deleteById(req, res);
	});
});
}());
