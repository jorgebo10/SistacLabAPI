(function() {

	'use strict';

	var sinon = require('sinon');
	require('sinon-as-promised');
	require('sinon-mongoose');
	var should = require('chai').should();

	describe('FotoController', function() {
		var FotoController = require('../../../../src/api/foto/foto.controller.js');
		var FotoModel = require('../../../../src/api/foto/foto.model.js');
		var ImageUtils = require('../../../../src/utils/image.utils');


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

			var req = {
				body: {}
			};
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

			var req = {
				body: {
					informeId: 1
				}
			};
			var res = {
				status: statusCallback,
				json: jsonCallback
			};

			FotoController.create(req, res);
		});

		it('should return 400 if promise is rejected', function(done) {
			var mock = sinon.mock(FotoModel);
			var imageUtilsMock = sinon.mock(ImageUtils);
			var imagen = 'data:dfdfdfdfdf;base64,fdfdfdfdfdfdf';

			var statusCallback = function(status) {
				status.should.equal(400);
			};

			var jsonCallback = function(json) {
				json.message.should.equal('error');
				mock.restore();
				imageUtilsMock.restore();
				done();
			};

			var req = {
				body: {
					informeId: 1,
					imagen: imagen
				}
			};

			var res = {
				status: statusCallback,
				json: jsonCallback
			};

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
				.expects('writeImageBase64')
				.withArgs('dfdfdfdfdf', '1hhh', 'png')
				.returns('');

			imageUtilsMock
				.expects('resizeImage')
				.withArgs('1hhh', 'png')
				.returns('');

			mock
				.expects('create')
				.withArgs({
					informeId: 1,
					descripcion: undefined,
					ext: "png",
					filename: "1hhh",
					syncTime: undefined,
					tags: undefined
				})
				.chain('exec')
				.rejects('error');

			FotoController.create(req, res);
		});

		it('should return 201 while creating', function(done) {
			var mock = sinon.mock(FotoModel);
			var imageUtilsMock = sinon.mock(ImageUtils);
			var foto = {
				descripcion: undefined,
				ext: "png",
				filename: "1hhh",
				informeId: 1,
				syncTime: undefined,
				tags: undefined
			};

			var statusCallback = function(status) {
				status.should.equal(201);
			};

			var jsonCallback = function(json) {
				json.should.deep.equal(foto);
				mock.restore();
				imageUtilsMock.restore();
				done();
			};

			var imagen = 'data:dfdfdfdfdf;base64,fdfdfdfdfdfdf';

			var req = {
				body: {
					informeId: 1,
					imagen: imagen
				}
			};

			var res = {
				status: statusCallback,
				json: jsonCallback
			};

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
				.expects('writeImageBase64')
				.withArgs('dfdfdfdfdf', '1hhh', 'png')
				.returns('');

			imageUtilsMock
				.expects('resizeImage')
				.withArgs('1hhh', 'png')
				.returns('');

			mock
				.expects('create')
				.withArgs({
					informeId: 1,
					descripcion: undefined,
					ext: "png",
					filename: "1hhh",
					syncTime: undefined,
					tags: undefined
				})
				.chain('exec')
				.resolves(foto);

			FotoController.create(req, res);
		});
	});
}());