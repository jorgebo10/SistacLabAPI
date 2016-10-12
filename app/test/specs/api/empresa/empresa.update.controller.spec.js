(function() {

	'use strict';

	var sinon = require('sinon');
	require('sinon-as-promised');
	require('sinon-mongoose');
	var should = require('chai').should();

	describe('EmpresaController', function() {
		var EmpresaController = require('../../../../src/api/empresa/empresa.controller.js');
		var EmpresaModel = require('../../../../src/api/empresa/empresa.model.js');

		it('should return 404 while updating and codigo not found', function(done) {

			var statusCallback = function(status) {
				status.should.equal(404);
			};

			var jsonCallback = function(json) {
				json.message.should.equal('codigo or email not found in request params or email not found in request body');
				done();
			};

			var req = {
				params: {
					codigo: ''
				},
				body: {
					codigo: ''
				}
			};

			var res = {
				status: statusCallback,
				json: jsonCallback
			};

			EmpresaController.update(req, res);
		});

		it('should return 404 while updating and codigo not sent', function(done) {
			var codigo = {
				codigo: '1'
			};

			var statusCallback = function(status) {
				status.should.equal(404);
			};

			var jsonCallback = function(json) {
				json.message.should.equal('codigo or email not found in request params or email not found in request body');
				done();
			};

			var req = {
				body: {
					codigo: '1'
				}
			};

			var res = {
				status: statusCallback,
				json: jsonCallback
			};

			EmpresaController.update(req, res);
		});

		it('should return 404 while updating and codigo not found', function(done) {
			var mock = sinon.mock(EmpresaModel);
			var empresa = {
				codigo: '1',
				email: 'pepe@gmail.com'
			};

			var statusCallback = function(status) {
				status.should.equal(404);
			};

			var jsonCallback = function(json) {
				json.message.should.equal('No results found while searching by codigo 1');
				mock.restore();
				done();
			};

			var req = {
				params: {
					codigo: empresa.codigo,
					email: empresa.email
				},
				body: {
					codigo: empresa.codigo,
					email: empresa.email
				}
			};

			var res = {
				status: statusCallback,
				json: jsonCallback
			};

			mock
				.expects('findOneAndUpdate')
				.withArgs({
					codigo: req.params.codigo
				})
				.chain('exec')
				.resolves(null);

			EmpresaController.update(req, res);
		});

		it('should return 400 while updating', function(done) {
			var mock = sinon.mock(EmpresaModel);
			var empresa = {
				codigo: '1',
				email: 'pepe@email.com'
			};

			var statusCallback = function(status) {
				status.should.equal(400);
				mock.restore();
				done();
			};

			var jsonCallback = function(json) {};

			var req = {
				params: {
					codigo: empresa.codigo,
					email: empresa.email
				},
				body: {
					codigo: '1',
					email: empresa.email
				}
			};

			var res = {
				status: statusCallback,
				json: jsonCallback
			};

			mock
				.expects('findOneAndUpdate')
				.withArgs({
					codigo: req.params.codigo
				})
				.chain('exec')
				.rejects('error');

			EmpresaController.update(req, res);
		});

		it('should return 200 while updating ok', function(done) {
			var mock = sinon.mock(EmpresaModel);
			var empresa = {
				codigo: '1',
				email: 'pepe@gmail.com'
			};

			var statusCallback = function(status) {
				status.should.equal(200);
			};

			var jsonCallback = function(json) {
				json.should.equal(empresa.codigo);
				mock.restore();
				done();
			};

			var req = {
				params: {
					codigo: empresa.codigo,
					email: empresa.email
				},
				body: {
					codigo: empresa.codigo,
					email: empresa.email
				}
			};

			var res = {
				status: statusCallback,
				json: jsonCallback
			};

			mock
				.expects('findOneAndUpdate')
				.withArgs({
					codigo: '1'
				})
				.chain('exec')
				.resolves(empresa);

			EmpresaController.update(req, res);
		});

		it('should return 200 while updating with image ok', function(done) {
			var mock = sinon.mock(EmpresaModel);
			var empresa = {
				codigo: '1',
				email: 'pepe@gmail.com'
			};

			var statusCallback = function(status) {
				status.should.equal(200);
			};

			var jsonCallback = function(json) {
				json.should.equal(empresa.codigo);
				mock.restore();
				done();
			};

			var req = {
				params: {
					codigo: empresa.codigo,
					email: empresa.email
				},
				body: {
					codigo: empresa.codigo,
					email: empresa.email,
					imagen: {
						src: 'oo'
					}
				}
			};

			var res = {
				status: statusCallback,
				json: jsonCallback
			};

			mock
				.expects('findOneAndUpdate')
				.withArgs({
					codigo: req.body.codigo
				}, {
					codigo: req.body.codigo,
					nombre: undefined,
					razonSocial: undefined,
					direccion: undefined,
					telefono: undefined,
					email: req.body.email,
					password: undefined,
					token: undefined,
					contacto: undefined,
					imagen: req.body.imagen.src
				}, {
					runValidators: true
				})
				.chain('exec')
				.resolves(empresa);

			EmpresaController.update(req, res);
		});
	});
}());