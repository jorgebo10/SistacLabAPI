(function() {

	'use strict';

	var sinon = require('sinon');
	require('sinon-as-promised');
	require('sinon-mongoose');
	var should = require('chai').should();

	describe('A1Controller', function() {
		var A1Controller = require('../../../../src/api/a1/a1.controller.js');
		var A1Model = require('../../../../src/api/a1/a1.model.js');

		it('should return 204 if a1 was removed ok', function(done) {
			var mock = sinon.mock(A1Model);
			var a1 = {
				numeroTramite: '1'
			};

			var statusCallback = function(status) {
				status.should.equal(204);
			};

			var jsonCallback = function(json) {
				json.should.equal(a1);
				mock.restore();
				done();
			};

			var req = {
				params: {
					numeroTramite: '1'
				}
			};
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
				params: {
					numeroTramite: '1'
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

			A1Controller.deleteByNumeroTramite(req, res);
		});

		it('should return 404 if a1Doc not found by numeroTramite while deleting', function(done) {

			var statusCallback = function(status) {
				status.should.equal(404);
			};

			var jsonCallback = function(json) {
				json.message.should.equal('a1Doc not found');
				done();
			};

			var req = {
				params: {
					numeroTramite: ''
				}
			};
			var res = {
				status: statusCallback,
				json: jsonCallback
			};

			A1Controller.deleteByNumeroTramite(req, res);
		});

		it('should return 404 if a1Doc not sent by numeroTramite while deleting', function(done) {

			var statusCallback = function(status) {
				status.should.equal(404);
			};

			var jsonCallback = function(json) {
				json.message.should.equal('a1Doc not found');
				done();
			};

			var req = {
				params: {}
			};
			var res = {
				status: statusCallback,
				json: jsonCallback
			};

			A1Controller.deleteByNumeroTramite(req, res);
		});
	});
}());