(function() {

	'use strict';

	var sinon = require('sinon');
	require('sinon-as-promised');
	require('sinon-mongoose');
	var should = require('chai').should();

	describe('EmpresaController', function() {
		var EmpresaController = require('../../../../src/api/empresa/empresa.controller.js');
		var EmpresaModel = require('../../../../src/api/empresa/empresa.model.js');

		it('should return 204 if empresa was removed ok', function(done) {
			var mock = sinon.mock(EmpresaModel);
			var empresa = {
				codigo: '1'
			};

			var statusCallback = function(status) {
				status.should.equal(204);
			};

			var jsonCallback = function(json) {
				json.should.equal(empresa);
				mock.restore();
				done();
			};

			var req = {
				params: {
					codigo: '1'
				}
			};
			var res = {
				status: statusCallback,
				json: jsonCallback
			};

			mock
				.expects('findOneAndRemove')
				.chain('exec')
				.resolves(empresa);

			EmpresaController.deleteByCodigo(req, res);
		});

		it('should return 400 if there was an error while removing empresa', function(done) {
			var mock = sinon.mock(EmpresaModel);
			var empresa = {
				codigo: '1'
			};

			var statusCallback = function(status) {
				status.should.equal(400);
			};

			var jsonCallback = function(json) {
				json.message.should.equal('error');
				mock.restore();
				done();
			};

			var req = {
				params: {
					codigo: '1'
				}
			};
			var res = {
				status: statusCallback,
				json: jsonCallback
			};

			mock
				.expects('findOneAndRemove')
				.chain('exec')
				.rejects('error');

			EmpresaController.deleteByCodigo(req, res);
		});

		it('should return 404 if empresa not found by codigo while deleting', function(done) {

			var statusCallback = function(status) {
				status.should.equal(404);
			};

			var jsonCallback = function(json) {
				json.message.should.equal('codigo not found in request params');
				done();
			};

			var req = {
				params: {
					codigo: ''
				}
			};
			var res = {
				status: statusCallback,
				json: jsonCallback
			};

			EmpresaController.deleteByCodigo(req, res);
		});

		it('should return 404 if empresa not sent by codigo while deleting', function(done) {
			var mock = sinon.mock(EmpresaModel);

			var statusCallback = function(status) {
				status.should.equal(404);
			};

			var jsonCallback = function(json) {
				json.message.should.equal('codigo not found in request params');
				mock.restore();
				done();
			};

			var req = {
				params: {}
			};
			var res = {
				status: statusCallback,
				json: jsonCallback
			};

			EmpresaController.deleteByCodigo(req, res);
		});
	});
}());