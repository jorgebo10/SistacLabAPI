(function() {

	'use strict';

	var sinon = require('sinon');
	require('sinon-as-promised');
	require('sinon-mongoose');
	var should = require('chai').should();
	var responseUtils = require('../../../../../config/uris');

	describe('EmpresaController', function() {
		var EmpresaController = require('../../../../src/api/empresa/empresa.controller.js');
		var EmpresaModel = require('../../../../src/api/empresa/empresa.model.js');

		it('should return 404 if  email are not not sent while creating', function(done) {

			var statusCallback = function(status) {
				status.should.equal(404);
			};

			var jsonCallback = function(json) {
				json.message.should.equal('codigo or email not found in request params or email not found in request body');
				done();
			};

			var req = {
				body: {}
			};
			var res = {
				status: statusCallback,
				json: jsonCallback
			};

			EmpresaController.create(req, res);
		});

		it('should return 404 if codigo is empty while creating', function(done) {

			var statusCallback = function(status) {
				status.should.equal(404);
			};

			var jsonCallback = function(json) {
				json.message.should.equal('codigo or email not found in request params or email not found in request body');
				done();
			};

			var req = {
				body: {
					codigo: ''
				}
			};
			var res = {
				status: statusCallback,
				json: jsonCallback
			};

			EmpresaController.create(req, res);
		});

		it('should return 404 if email is empty while creating', function(done) {

			var statusCallback = function(status) {
				status.should.equal(404);
			};

			var jsonCallback = function(json) {
				json.message.should.equal('codigo or email not found in request params or email not found in request body');
				done();
			};

			var req = {
				body: {
					codigo: '1',
					email: ''
				}
			};
			var res = {
				status: statusCallback,
				json: jsonCallback
			};

			EmpresaController.create(req, res);
		});

		it('should return 201 while creating', function(done) {
			var mock = sinon.mock(EmpresaModel);
			var empresa = {
				codigo: 1,
				email: 'pepe@gmail.com'
			};

			var statusCallback = function(status) {
				status.should.equal(201);
			};

			var locationCallback = function(location) {
				console.log(location);
				location.should.equal(responseUtils.empresa + empresa.codigo);
			};

			var jsonCallback = function(json) {
				console.log(json);
				json.should.equal(empresa);
				mock.restore();
				done();
			};

			var req = {
				body: {
					codigo: empresa.codigo,
					email: empresa.email
				}
			};

			var res = {
				status: statusCallback,
				location: locationCallback,
				json: jsonCallback
			};

			mock
				.expects('create')
				.withArgs({
					codigo: req.body.codigo,
					nombre: undefined,
					razonSocial: undefined,
					direccion: undefined,
					telefono: undefined,
					email: req.body.email,
					password: undefined,
					token: undefined,
					contacto: undefined,
					imagen: ''
				})
				.resolves(empresa);

			EmpresaController.create(req, res);
		});

		it('should return 201 while creating with image', function(done) {
			var mock = sinon.mock(EmpresaModel);
			var empresa = {
				codigo: 1,
				email: 'pepe@gmail.com'
			};

			var statusCallback = function(status) {
				status.should.equal(201);
			};

			var jsonCallback = function(json) {
				json.should.equal(empresa);
				mock.restore();
				done();
			};

			var locationCallback = function(location) {
				location.should.equal(responseUtils.empresa + empresa.codigo);
			};

			var req = {
				body: {
					codigo: empresa.codigo,
					email: empresa.email,
					imagen: {
						src: 'oooo'
					}
				}
			};

			var res = {
				status: statusCallback,
				location: locationCallback,
				json: jsonCallback
			};

			mock
				.expects('create')
				.withArgs({
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
				})
				.resolves(empresa);

			EmpresaController.create(req, res);
		});

		it('should return 400 if error while creating', function(done) {
			var mock = sinon.mock(EmpresaModel);
			var empresa = {
				codigo: '1',
				email: 'pepe@gmail.com'
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
				.expects('create')
				.withArgs({
					codigo: req.body.codigo,
					nombre: undefined,
					razonSocial: undefined,
					direccion: undefined,
					telefono: undefined,
					email: req.body.email,
					password: undefined,
					token: undefined,
					contacto: undefined,
					imagen: ''
				})
				.chain('exec')
				.rejects('error');

			EmpresaController.create(req, res);
		});
	});
}());