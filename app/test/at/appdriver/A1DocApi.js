(function() {

	'use strict';

	/* jshint node: true */

	var requestify = require('requestify');

	var A1DocApi = {
		new: function(data) {
			requestify.post('$URL:$PORT/a1s', data)
				.then(function(response) {
					response.getBody();
				});
		},

		getByNumeroTramite: function(numeroTramite) {
			requestify.get('$URL:$PORT/a1s?numeroTramite=' + numeroTramite)
				.then(function(response) {
					response.getBody();
				});
		}
	};

	module.exports = A1DocApi;
}());