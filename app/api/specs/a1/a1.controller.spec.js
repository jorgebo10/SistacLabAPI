(function() {

'use strict';

var sinon = require('sinon');
require('sinon-as-promised');
require('sinon-mongoose');
var should = require('chai').should();

describe('A1ModelController', function() {
	var A1Controller = require('../../src/a1/a1.controller.js');
	var A1Model = require('../../src/a1/a1.model.js');

	it('should return A1 by CIT', function(done) {
		var mock = sinon.mock(A1Model);

		var statusCallback = function(status) {
			status.should.equal(200);
		};

		var jsonCallback = function(json) {
			json.should.equal('success');
			mock.restore();
			done();		
		};
		
		var req = { query: {cit: '1'}};
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		mock
			.expects('getByCit')
			.withArgs('1')
			.resolves('success');
		
		A1Controller.getByCit(req, res);
	});

	it('should return cit not found in params if cit is empty in the request', function(done) {
		var statusCallback = function(status) {
			status.should.equal(404);
			done();
		};

		var jsonCallback = function(json) {
			json.message.should.equal('cit not found in request params');
		};
		
		var req = { query: {cit:''}};
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		A1Controller.getByCit(req, res);
	});

	it('should return cit not found in params if cit is not sent in the request', function(done) {
		var statusCallback = function(status) {
			status.should.equal(404);
		};

		var jsonCallback = function(json) {
			json.message.should.equal('cit not found in request params');
			done();
		};
		
		var req = { query: {}};
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		A1Controller.getByCit(req, res);
	});

	it('should return 400 if promise is rejected while looking by numeroTramite', function(done) {
		var mock = sinon.mock(A1Model);

		var statusCallback = function(status) {
			status.should.equal(400);
		};

		var jsonCallback = function(json) {
			json.message.should.equal('error');
			mock.restore();
			done();		
		};
		
		var req = { query: {cit: '1'}};
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		mock
			.expects('getByCit')
			.withArgs('1')
			.rejects('error');
	
		A1Controller.getByCit(req, res);
	});

	it('should return 400 if promise is rejected while looking by numeroTramite', function(done) {
		var mock = sinon.mock(A1Model);

		var statusCallback = function(status) {
			status.should.equal(400);
		};

		var jsonCallback = function(json) {
			json.message.should.equal('error');
			mock.restore();
			done();		
		};
		
		var req = { query: {numeroTramite: '1'}};
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		mock
			.expects('getByNumeroTramite')
			.withArgs('1')
			.rejects('error');
	
		A1Controller.getByNumeroTramite(req, res);
	});

	it('should return all A1 docs', function(done) {
		var mock = sinon.mock(A1Model);

		var statusCallback = function(status) {
			status.should.equal(200);
		};

		var jsonCallback = function(json) {
			json.should.equal('success');
			mock.restore();
			done();		
		};
		
		var req = {};
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		mock
			.expects('find')
			.chain('select').withArgs('-sequence -__v')
			.chain('exec')
			.resolves('success');
		
		A1Controller.findAll(req, res);
	});

	it('should return 400 if promise is rejected', function(done) {
		var mock = sinon.mock(A1Model);

		var statusCallback = function(status) {
			status.should.equal(400);
		};

		var jsonCallback = function(json) {
			json.message.should.equal('error');
			mock.restore();
			done();
		};
		
		var req = {};
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		mock
			.expects('find')
			.chain('select').withArgs('-sequence -__v')
			.chain('exec')
			.rejects('error');
		
		A1Controller.findAll(req, res);
	});

	it('should return numeroTramite not found in params if it is empty in the request', function(done) {
		var statusCallback = function(status) {
			status.should.equal(404);
			done();
		};

		var jsonCallback = function(json) {
			json.message.should.equal('numeroTramite not found in request params');
		};
		
		var req = { query: {numeroTramite:''}};
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		A1Controller.getByNumeroTramite(req, res);
	});

	it('should return numeroTramite not found in params if numero tramite is not sent in the request', function(done) {
		var statusCallback = function(status) {
			status.should.equal(404);
		};

		var jsonCallback = function(json) {
			json.message.should.equal('numeroTramite not found in request params');
			done();
		};
		
		var req = { query: {}};
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		A1Controller.getByNumeroTramite(req, res);
	});

	it('should return 404 if a1Doc not found by cit', function(done) {
		var mock = sinon.mock(A1Model);

		var statusCallback = function(status) {
			status.should.equal(404);
		};

		var jsonCallback = function(json) {
			json.message.should.equal('a1Doc not found');
			mock.restore();
			done();		
		};
		
		var req = { query: {cit: '1'}};
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		mock
			.expects('getByCit')
			.withArgs('1')
			.resolves(null);
	
		A1Controller.getByCit(req, res);
	});

	it('should return 404 if a1Doc not found by numeroTramite', function(done) {
		var mock = sinon.mock(A1Model);

		var statusCallback = function(status) {
			status.should.equal(404);
		};

		var jsonCallback = function(json) {
			json.message.should.equal('a1Doc not found');
			mock.restore();
			done();		
		};
		
		var req = { query: {numeroTramite: '1'}};
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		mock
			.expects('getByNumeroTramite')
			.withArgs('1')
			.resolves(null);
	
		A1Controller.getByNumeroTramite(req, res);
	});

	it('should return 200 if a1Doc is found by numeroTramite', function(done) {
		var mock = sinon.mock(A1Model);
		var a1 = {numeroTramite: '1'};

		var statusCallback = function(status) {
			status.should.equal(200);
		};

		var jsonCallback = function(json) {
			json.should.equal(a1);
			mock.restore();
			done();		
		};
		
		var req = { query: {numeroTramite: '1'}};
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		mock
			.expects('getByNumeroTramite')
			.withArgs('1')
			.resolves(a1);
	
		A1Controller.getByNumeroTramite(req, res);
	});

	it('should return 200 if a1Doc is found by cit', function(done) {
		var mock = sinon.mock(A1Model);
		var a1 = {cit: '1'};

		var statusCallback = function(status) {
			status.should.equal(200);
		};

		var jsonCallback = function(json) {
			json.should.equal(a1);
			mock.restore();
			done();		
		};
		
		var req = { query: {cit: '1'}};
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		mock
			.expects('getByCit')
			.withArgs('1')
			.resolves(a1);
	
		A1Controller.getByCit(req, res);
	});

	it('should return 204 if a1 was removed ok', function(done) {
		var mock = sinon.mock(A1Model);
		var a1 = {numeroTramite: '1'};

		var statusCallback = function(status) {
			status.should.equal(204);
		};

		var jsonCallback = function(json) {
			json.should.equal(a1);
			mock.restore();
			done();		
		};
		
		var req = { params: {numeroTramite: '1'} };
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		mock
			.expects('findOneAndRemove')
			.chain('exec')
			.resolves(a1);
		
		A1Controller.deleteByNumeroTramite(req, res);
	});

	it('should return 400 if there was an error while removing a1Doc', function(done) {
		var mock = sinon.mock(A1Model);
		var a1 = {numeroTramite: '1'};

		var statusCallback = function(status) {
			status.should.equal(400);
		};

		var jsonCallback = function(json) {
			json.message.should.equal('error');
			mock.restore();
			done();		
		};
		
		var req = { params: {numeroTramite: '1'} };
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		mock
			.expects('findOneAndRemove')
			.chain('exec')
			.rejects('error');
		
		A1Controller.deleteByNumeroTramite(req, res);
	});

	it('should return 404 if a1Doc not found by numeroTramite while deleting', function(done) {
		var mock = sinon.mock(A1Model);

		var statusCallback = function(status) {
			status.should.equal(404);
		};

		var jsonCallback = function(json) {
			json.message.should.equal('a1Doc not found');
			mock.restore();
			done();		
		};
		
		var req = { params: {numeroTramite: ''}};
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		A1Controller.deleteByNumeroTramite(req, res);
	});

	it('should return 404 if a1Doc not sent by numeroTramite while deleting', function(done) {
		var mock = sinon.mock(A1Model);

		var statusCallback = function(status) {
			status.should.equal(404);
		};

		var jsonCallback = function(json) {
			json.message.should.equal('a1Doc not found');
			mock.restore();
			done();		
		};
		
		var req = { params: {}};
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		A1Controller.deleteByNumeroTramite(req, res);
	});

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
		
		var req = { body: {}};
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
		
		var req = { body: { numeroTramite: ''}};
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		A1Controller.create(req, res);
	});

	it('should return 201 while creating', function(done) {
		var mock = sinon.mock(A1Model);
		var a1 = {numeroTramite: '1'};

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
				numeroTramite: '1',
				cit: undefined,
				normaFabricacion: undefined,
				fabricante: undefined,
				matricula: undefined,
				estado: undefined,
				nombreInstalacion: undefined,
				anioFabricacion: undefined,
				anioInstalacion: undefined,
				placaIdentificacion: undefined,
				temperaturaOperacion: undefined,
				especificacionChapas: undefined,
				numeroInterno: undefined,
				observaciones: undefined,
				elevado: undefined,
				tieneInspeccionesAnteriores: undefined,
				laminasInspeccionadas: undefined
			})
			.chain('exec')
			.resolves(a1);

		A1Controller.create(req, res);
	});

	it('should return 400 if error while creating', function(done) {
		var mock = sinon.mock(A1Model);
		var a1 = {numeroTramite: '1'};

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
				numeroTramite: '1',
				cit: undefined,
				normaFabricacion: undefined,
				fabricante: undefined,
				matricula: undefined,
				estado: undefined,
				nombreInstalacion: undefined,
				anioFabricacion: undefined,
				anioInstalacion: undefined,
				placaIdentificacion: undefined,
				temperaturaOperacion: undefined,
				especificacionChapas: undefined,
				numeroInterno: undefined,
				observaciones: undefined,
				elevado: undefined,
				tieneInspeccionesAnteriores: undefined,
				laminasInspeccionadas: undefined
			})
			.chain('exec')
			.rejects('error');

		A1Controller.create(req, res);
	});

});
}());
