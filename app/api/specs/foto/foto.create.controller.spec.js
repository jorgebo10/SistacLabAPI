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

	it('should return 404 if informeId is not sent while creating', function(done) {
		var mock = sinon.mock(FotoModel);

		var statusCallback = function(status) {
			status.should.equal(404);
		};

		var jsonCallback = function(json) {
			json.message.should.equal('informeId not found');
			mock.restore();
			done();		
		};
		
		var req = { body: {}};
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		FotoController.create(req, res);
	});

	it('should return 404 if imagen is not sent while creating', function(done) {
		var mock = sinon.mock(FotoModel);

		var statusCallback = function(status) {
			status.should.equal(404);
		};

		var jsonCallback = function(json) {
			json.message.should.equal('image not found');
			mock.restore();
			done();		
		};
		
		var req = { body: { informeId: 1}};
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		FotoController.create(req, res);
	});

	it('should return 201 while creating', function(done) {
		var mock = sinon.mock(FotoModel);
		var imageUtilsMock = sinon.mock(ImageUtils);
		var foto = {informeId: '1'};

		var statusCallback = function(status) {
			status.should.equal(201);
		};

		var jsonCallback = function(json) {
			json.should.equal(foto);
			mock.restore();
			done();		
		};
		
		var req = { 
			body: { 
				informeId: '1'
			}
		};

		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		var imagen = 'data:dfdfdfdfdf;base64,fdfdfdfdfdfdf';
		imageUtilsMock
			.expects('getDataFromBase64Image')
			.withArgs(imagen)
			.returns('dfdfdfdfdf');

		imageUtilsMock
			.expects('getExtFromBase64Image')
			.withArgs(imagen)
			.returns('png');

		imageUtilsMock
			.expects('getFilename')
			.withArgs(1)
			.returns('1hhh');

		imageUtilsMock
			.expects('writeBase64Image')
			.withArgs('dfdfdfdfdf', '1hhh', 'png')
			.returns('');

		imageUtilsMock
			.expects('resizeImage')
			.withArgs('1hhh', 'png')
			.returns('');

		mock
			.expects('create')
			.withArgs({
				informeId: '1',
				imagen: imagen
			})
			.chain('exec')
			.resolves(foto);

		FotoController.create(req, res);
	});
});
}());
