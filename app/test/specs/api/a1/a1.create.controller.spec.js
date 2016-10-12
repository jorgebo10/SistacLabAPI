(function() {

	'use strict';

	var sinon = require('sinon');
	require('sinon-as-promised');
	require('sinon-mongoose');
	var should = require('chai').should();

	describe('A1Controller', function() {
		var A1Controller = require('../../../../src/api/a1/a1.controller.js');
		var A1Model = require('../../../../src/api/a1/a1.model.js');

		it('should return 404 if numeroTramite is not sent while creating', function(done) {
			var mock = sinon.mock(A1Model);

			var statusCallback = function(status) {
				status.should.equal(404);
			};

			var jsonCallback = function(json) {
				json.message.should.equal('numeroTramite not found');
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

			A1Controller.create(req, res);
		});

		it('should return 404 if numeroTramite is empty while creating', function(done) {
			var mock = sinon.mock(A1Model);

			var statusCallback = function(status) {
				status.should.equal(404);
			};

			var jsonCallback = function(json) {
				json.message.should.equal('numeroTramite not found');
				mock.restore();
				done();
			};

			var req = {
				body: {
					numeroTramite: ''
				}
			};
			var res = {
				status: statusCallback,
				json: jsonCallback
			};

			A1Controller.create(req, res);
		});

		it('should return 201 while creating', function(done) {
			var mock = sinon.mock(A1Model);
			var a1 = {
				numeroTramite: '1'
			};

			var statusCallback = function(status) {
				status.should.equal(201);
			};

			var jsonCallback = function(json) {
				json.should.equal(a1);
				mock.restore();
				done();
			};

			var req = {
				body: {
					numeroTramite: '1'
				}
			};

			var res = {
				status: statusCallback,
				json: jsonCallback
			};

			mock
				.expects('create')
				.withArgs({
					anioInstalacion: undefined,
					cit: undefined,
					elevado: undefined,
					especificacionChapas: undefined,
					estado: undefined,
					fabricante: undefined,
					matricula: undefined,
					nombreInstalacion: undefined,
					normaFabricacion: undefined,
					numeroInterno: undefined,
					numeroTramite: "1",
					observaciones: undefined,
					placaIdentificacion: undefined,
					temperaturaOperacion: undefined,
					tieneInspeccionesAnteriores: undefined,
					volumenEndicamientoMinimo: undefined
				})
				.chain('exec')
				.resolves(a1);

			A1Controller.create(req, res);
		});

		it('should return 400 if error while creating', function(done) {
			var mock = sinon.mock(A1Model);
			var a1 = {
				numeroTramite: '1'
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
					numeroTramite: '1'
				}
			};

			var res = {
				status: statusCallback,
				json: jsonCallback
			};

			mock
				.expects('create')
				.withArgs({
					anioInstalacion: undefined,
					cit: undefined,
					elevado: undefined,
					especificacionChapas: undefined,
					estado: undefined,
					fabricante: undefined,
					matricula: undefined,
					nombreInstalacion: undefined,
					normaFabricacion: undefined,
					numeroInterno: undefined,
					numeroTramite: "1",
					observaciones: undefined,
					placaIdentificacion: undefined,
					temperaturaOperacion: undefined,
					tieneInspeccionesAnteriores: undefined,
					volumenEndicamientoMinimo: undefined
				})
				.chain('exec')
				.rejects('error');

			A1Controller.create(req, res);
		});
	});
}());