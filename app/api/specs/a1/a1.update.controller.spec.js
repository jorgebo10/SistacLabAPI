(function() {

'use strict';

var sinon = require('sinon');
require('sinon-as-promised');
require('sinon-mongoose');
var should = require('chai').should();

describe('A1ModelController', function() {
	var A1Controller = require('../../src/a1/a1.controller.js');
	var A1Model = require('../../src/a1/a1.model.js');
	
	it('should return 404 while updating and numeroTramite not found', function(done) {
		var mock = sinon.mock(A1Model);
		var a1 = {numeroTramite: '1'};

		var statusCallback = function(status) {
			status.should.equal(404);
		};

		var jsonCallback = function(json) {
			json.message.should.equal('numeroTramite not found in request params');
			mock.restore();
			done();		
		};
		
		var req = { 
			params: {
				numeroTramite: ''
			},
			body: { 
				numeroTramite: '1'
			}
		};

		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		A1Controller.update(req, res);
	});

	it('should return 404 while updating and numeroTramite not sent', function(done) {
		var mock = sinon.mock(A1Model);
		var a1 = {numeroTramite: '1'};

		var statusCallback = function(status) {
			status.should.equal(404);
		};

		var jsonCallback = function(json) {
			json.message.should.equal('numeroTramite not found in request params');
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

		A1Controller.update(req, res);
	});

	it('should return 404 while updating and a1Doc not found', function(done) {
		var mock = sinon.mock(A1Model);
		var a1 = {numeroTramite: '1'};

		var statusCallback = function(status) {
			status.should.equal(404);
		};

		var jsonCallback = function(json) {
			json.message.should.equal('No results found while searching by numeroTramite 1');
			mock.restore();
			done();		
		};
		
		var req = {
			params: {
				numeroTramite: '1'
			}, 
			body: { 
				numeroTramite: '1'
			}
		};

		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		mock
			.expects('findOneAndUpdate')
			.withArgs({numeroTramite: '1'})
			.chain('exec')
			.resolves(null);

		A1Controller.update(req, res);
	});

	it('should return 400 while updating', function(done) {
		var mock = sinon.mock(A1Model);
		var a1 = {numeroTramite: '1'};

		var statusCallback = function(status) {
			status.should.equal(400);
			mock.restore();
			done();		
		};

		var jsonCallback = function(json) {
		};
		
		var req = {
			params: {
				numeroTramite: '1'
			}, 
			body: { 
				numeroTramite: '1'
			}
		};

		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		mock
			.expects('findOneAndUpdate')
			.withArgs({numeroTramite: '1'})
			.chain('exec')
			.rejects('error');

		A1Controller.update(req, res);
	});

	it('should return 200 while updating ok', function(done) {
		var mock = sinon.mock(A1Model);
		var a1 = {numeroTramite: '1'};

		var statusCallback = function(status) {
			status.should.equal(200);
		};

		var jsonCallback = function(json) {
			json.should.equal(a1.numeroTramite);
			mock.restore();
			done();		
		};
		
		var req = {
			params: {
				numeroTramite: '1'
			}, 
			body: { 
				numeroTramite: '1'
			}
		};

		var res = { 
			status: statusCallback,
			json: jsonCallback
		};

		mock
			.expects('findOneAndUpdate')
			.withArgs({numeroTramite: '1'})
			.chain('exec')
			.resolves(a1);

		A1Controller.update(req, res);
	});
});
}());
