(function() {

'use strict';

var sinon = require('sinon');
require('sinon-as-promised');
require('sinon-mongoose');
var should = require('chai').should();

describe('EmpresaController', function() {
	var EmpresaController = require('../../src/empresa/empresa.controller.js');
	var EmpresaModel = require('../../src/empresa/empresa.model.js');

	it('should return Empresa by codigo', function(done) {
		var mock = sinon.mock(EmpresaModel);

		var statusCallback = function(status) {
			status.should.equal(200);
		};

		var jsonCallback = function(json) {
			json.should.equal('success');
			mock.restore();
			done();		
		};
		
		var req = { params: {codigo: '1'}};
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		mock
			.expects('getByCodigo')
			.withArgs('1')
			.resolves('success');
		
		EmpresaController.getByCodigo(req, res);
	});

	it('should return codigo not found in params if codigo is empty in the request', function(done) {
		var mock = sinon.mock(EmpresaModel);

		var statusCallback = function(status) {
			status.should.equal(404);
			done();
		};

		var jsonCallback = function(json) {
			json.message.should.equal('codigo not found in request params');
		};
		
		var req = { params: {codigo:''}};
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		EmpresaController.getByCodigo(req, res);
	});

	it('should return codigo not found in params if codigo is not sent in the request', function(done) {
		var mock = sinon.mock(EmpresaModel);

		var statusCallback = function(status) {
			status.should.equal(404);
		};

		var jsonCallback = function(json) {
			json.message.should.equal('codigo not found in request params');
			done();
		};
		
		var req = { params: {}};
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		EmpresaController.getByCodigo(req, res);
	});

	it('should return 400 if promise is rejected while looking by codigo', function(done) {
		var mock = sinon.mock(EmpresaModel);

		var statusCallback = function(status) {
			status.should.equal(400);
		};

		var jsonCallback = function(json) {
			json.message.should.equal('error');
			mock.restore();
			done();		
		};
		
		var req = { params: {codigo: '1'}};
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		mock
			.expects('getByCodigo')
			.withArgs('1')
			.rejects('error');
	
		EmpresaController.getByCodigo(req, res);
	});

	it('should return all Empresa', function(done) {
		var mock = sinon.mock(EmpresaModel);

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
		
		EmpresaController.findAll(req, res);
	});

	it('should return 400 if promise is rejected', function(done) {
		var mock = sinon.mock(EmpresaModel);

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
		
		EmpresaController.findAll(req, res);
	});

	
	it('should return 404 if empresa not found by codigo', function(done) {
		var mock = sinon.mock(EmpresaModel);

		var statusCallback = function(status) {
			status.should.equal(404);
		};

		var jsonCallback = function(json) {
			json.message.should.equal('No results found while searching by codigo 1');
			mock.restore();
			done();		
		};
		
		var req = { params: {codigo: '1'}};
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		mock
			.expects('getByCodigo')
			.withArgs('1')
			.resolves(null);
	
		EmpresaController.getByCodigo(req, res);
	});

	it('should return 200 if empresa is found by codigo', function(done) {
		var mock = sinon.mock(EmpresaModel);
		var empresa = {codigo: '1'};

		var statusCallback = function(status) {
			status.should.equal(200);
		};

		var jsonCallback = function(json) {
			json.should.equal(empresa);
			mock.restore();
			done();		
		};
		
		var req = { params: {codigo: '1'}};
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		mock
			.expects('getByCodigo')
			.withArgs('1')
			.resolves(empresa);
	
		EmpresaController.getByCodigo(req, res);
	});

	it('should return 404 if codigo not sent', function(done) {

		var statusCallback = function(status) {
			status.should.equal(404);
		};

		var jsonCallback = function(json) {
			json.message.should.equal('Codigo and/or password not found in request body');
			done();		
		};
		
		var req = { body: {codigo: ''}};
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		EmpresaController.resetToken(req, res);
	});

	it('should return 404 if password not sent', function(done) {

		var statusCallback = function(status) {
			status.should.equal(404);
		};

		var jsonCallback = function(json) {
			json.message.should.equal('Codigo and/or password not found in request body');
			done();		
		};
		
		var req = { body: {codigo: '122'}};
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		EmpresaController.resetToken(req, res);
	});

it('should return 400 if error while getting empresa', function(done) {
		var mock = sinon.mock(EmpresaModel);
		var empresa = {codigo: '1'};

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
				password: '1234'
			}
		};

		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		mock
			.expects('getByCodigo')
			.withArgs(req.body.codigo)
			.chain('exec')
			.rejects('error');

		EmpresaController.resetToken(req, res);
	});

	it('should return 404 if empresa is null', function(done) {
		var mock = sinon.mock(EmpresaModel);
		var empresa = {codigo: '1'};

		var statusCallback = function(status) {
			status.should.equal(404);
		};

		var jsonCallback = function(json) {
			json.message.should.equal('Empresa not found by codigo: 1');
			mock.restore();
			done();		
		};
		
		var req = { 
			body: { 
				codigo: empresa.codigo,
				password: '1234'
			}
		};

		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		mock
			.expects('getByCodigo')
			.withArgs(req.body.codigo)
			.chain('exec')
			.resolves(null);

		EmpresaController.resetToken(req, res);
	});


	it('should return 401 if authentication error', function(done) {
		var mock = sinon.mock(EmpresaModel);
		var empresa = {codigo: '1', password: '1234'};

		var statusCallback = function(status) {
			status.should.equal(401);
		};

		var jsonCallback = function(json) {
			json.message.should.equal('Authetication failure');
			mock.restore();
			done();		
		};
		
		var req = { 
			body: { 
				codigo: empresa.codigo,
				password: 'pp'
			}
		};

		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		mock
			.expects('getByCodigo')
			.withArgs('1')
			.resolves(empresa);

		EmpresaController.resetToken(req, res);
	});
});
}());
