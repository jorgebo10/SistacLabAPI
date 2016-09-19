(function() {

'use strict';

var sinon = require('sinon');
require('sinon-as-promised');
require('sinon-mongoose');
var should = require('chai').should();

describe('FotoController', function() {
	var FotoController = require('../../src/foto/foto.controller.js');
	var FotoModel = require('../../src/foto/foto.model.js');

	it('should return foto by id', function(done) {
		var mock = sinon.mock(FotoModel);

		var foto = {
			_id: '1',
            idInforme: '1',
            filename: 'mifoto',
            ext: 'jpg',
            syncTime: '2008-09-09',
            descripcion: 'oo',
            tags: ''
        };

		var statusCallback = function(status) {
			status.should.equal(200);
		};

		var jsonCallback = function(json) {
			var expected = {
				id: '1',
  				idInforme: '1',
  				url: 'images/thumb/mifoto.jpg',
  				syncTime: '2008-09-09',
  				descripcion: 'oo',
  				tags: ''
  			};

			json.should.deep.equal(expected);
            mock.restore();
			done();		
		};
		
		var req = { params: {id: '1'}};
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		mock
			.expects('getById')
			.withArgs('1')
			.resolves(foto);
		
		FotoController.getById(req, res);
	});

	it('should return id not found in params if id is empty in the request', function(done) {
		var mock = sinon.mock(FotoModel);

		var statusCallback = function(status) {
			status.should.equal(404);
			done();
		};

		var jsonCallback = function(json) {
			json.message.should.equal('id not found in request params');
		};
		
		var req = { params: {id:''}};
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		FotoController.getById(req, res);
	});

	it('should return id not found in params if id is not sent in the request', function(done) {
		var mock = sinon.mock(FotoModel);

		var statusCallback = function(status) {
			status.should.equal(404);
		};

		var jsonCallback = function(json) {
			json.message.should.equal('id not found in request params');
			done();
		};
		
		var req = { params: {}};
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		FotoController.getById(req, res);
	});

	it('should return 400 if promise is rejected while looking by id', function(done) {
		var mock = sinon.mock(FotoModel);

		var statusCallback = function(status) {
			status.should.equal(400);
		};

		var jsonCallback = function(json) {
			json.message.should.equal('error');
			mock.restore();
			done();		
		};
		
		var req = { params: {id: '1'}};
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		mock
			.expects('getById')
			.withArgs('1')
			.rejects('error');
	
		FotoController.getById(req, res);
	});

	it('should return 404 if foto not found by id', function(done) {
		var mock = sinon.mock(FotoModel);

		var statusCallback = function(status) {
			status.should.equal(404);
		};

		var jsonCallback = function(json) {
			json.message.should.equal('No results found while searching by id 1');
			mock.restore();
			done();		
		};
		
		var req = { params: {id: '1'}};
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		mock
			.expects('getById')
			.withArgs('1')
			.resolves(null);
	
		FotoController.getById(req, res);
	});
	/*
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
				var mock = sinon.mock(A1Model);var statusCallback = function(status) {
			status.should.equal(404);
			done();
		};

		var jsonCallback = function(json) {
			json.message.should.equal('numeroTramite not found in request params');
		};
		
		var req = { params: {numeroTramite:''}};
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		A1Controller.getByNumeroTramite(req, res);
	});

	it('should return numeroTramite not found in params if numero tramite is not sent in the request', function(done) {
		var mock = sinon.mock(A1Model);
		
		var statusCallback = function(status) {
			status.should.equal(404);
		};

		var jsonCallback = function(json) {
			json.message.should.equal('numeroTramite not found in request params');
			done();
		};
		
		var req = { params: {}};
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
			json.message.should.equal('No results found while searching by cit 1');
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
			json.message.should.equal('No results found while searching by numeroTramite 1');
			mock.restore();
			done();		
		};
		
		var req = { params: {numeroTramite: '1'}};
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
		
		var req = { params: {numeroTramite: '1'}};
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
	});*/
});
}());
