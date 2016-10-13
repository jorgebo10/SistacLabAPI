(function() {

	'use strict';

	/* jshint node: true */

	var logger = require('../../../src/utils/logger');
	var requestify = require('requestify');
	var uris = require('../../../../config/uris');
	var mocha = require('mocha'),
		sinon = require('sinon'),
		expect = require('chai').expect;

	var A1DocApi = {

		new: function(data, callback) {
			requestify
				.post('http://localhost:9000' + uris.a1, data)
				.then(function(response) {
					expect(response.code).to.equal(201);
					callback();
				})
				.fail(function(response) {
					logger.error(response);
					callback();
				});
			callback();
		},

		getByNumeroTramite: function(numeroTramite, callback) {

			requestify
				.request('http://localhost:9000' + uris.a1 + numeroTramite, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json'
					}
				})
				.then(function(response) {
					expect(JSON.parse(response.body).numeroTramite).to.equal(parseInt(numeroTramite));
					callback();
				})
				.fail(function(response) {
					logger.error(response);
					callback();
				});
		}
	};

	module.exports = A1DocApi;
}());