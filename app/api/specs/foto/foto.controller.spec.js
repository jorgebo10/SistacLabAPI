(function() {

'use strict';

/* jshint node: true */

var sinon = require('sinon');
require('sinon-as-promised');
require('sinon-mongoose');
var should = require('chai').should();

describe('FotoController', function() {
	var FotoController = require('../../src/foto/foto.controller.js');
	var FotoModel = require('../../src/foto/foto.model.js');
	var ImageUtils = require('../../../utils/image.utils');

	var foto = {
			_id: '1',
            idInforme: '1',
            filename: 'mifoto',
            ext: 'jpg',
            syncTime: '2008-09-09',
            descripcion: 'oo',
            tags: ''
    };

	it('should return foto by id', function(done) {
		var mock = sinon.mock(FotoModel);

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
	

	it('should return all fotos by id and tags in base64 format', function(done) {
		var mock = sinon.mock(FotoModel);
		var imageUtilsMock = sinon.mock(ImageUtils);

		var statusCallback = function(status) {
			status.should.equal(200);
		};

		var jsonCallback = function(json) {
			var expected = [ { id: '1', 
				idInforme: '1',
    			url: 'base64Url',
    			syncTime: '2008-09-09',
    			descripcion: 'oo',
    			tags: '' 
    		} ];

			json.should.deep.equal(expected);
			mock.restore();
			done();		
		};
		
		var req = {query: { informeId: '1', tags: ['xxx']}};
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		imageUtilsMock
			.expects('getBase64UrlFromFoto')
			.withArgs(foto)
			.returns('base64Url');

		mock
			.expects('findByInformeIdAndTags')
			.withArgs('1', ['xxx'])
			.resolves([foto]);
		
		FotoController.findByInformeIdAndTags(req, res);
	});

	it('should return all fotos by id and tags in full format', function(done) {
		var mock = sinon.mock(FotoModel);
		var imageUtilsMock = sinon.mock(ImageUtils);

		var statusCallback = function(status) {
			status.should.equal(200);
		};

		var jsonCallback = function(json) {
			var expected = [ { id: '1', 
				idInforme: '1',
    			url: 'fullUrl',
    			syncTime: '2008-09-09',
    			descripcion: 'oo',
    			tags: '' 
    		} ];

			json.should.deep.equal(expected);
			mock.restore();
			done();		
		};
		
		var req = {query: { informeId: '1', tags: ['xxx'], full: true}};
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		imageUtilsMock
			.expects('getFullUrlFromFoto')
			.withArgs(foto)
			.returns('fullUrl');

		mock
			.expects('findByInformeIdAndTags')
			.withArgs('1', ['xxx'])
			.resolves([foto]);
		
		FotoController.findByInformeIdAndTags(req, res);
	});

	it('should return informeId not found in query params if informeId is empty in the request', function(done) {
		var mock = sinon.mock(FotoModel);

		var statusCallback = function(status) {
			status.should.equal(404);
			done();
		};

		var jsonCallback = function(json) {
			json.message.should.equal('informeId not found in query params');
		};
		
		var req = { query: {informeId: ''}};
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		FotoController.findByInformeIdAndTags(req, res);
	});

	it('should return 400 if promise is rejected while looking by informeId', function(done) {
		var mock = sinon.mock(FotoModel);

		var statusCallback = function(status) {
			status.should.equal(400);
		};

		var jsonCallback = function(json) {
			console.log(json);
			json.message.should.equal('error');
			mock.restore();
			done();		
		};
		
		var req = {query: { informeId: '1', tags: ['xxx']}};
		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		mock
			.expects('findByInformeIdAndTags')
			.withArgs('1', ['xxx'])
			.rejects('error');
	
		FotoController.findByInformeIdAndTags(req, res);
	});
});
}());
