(function() {

	'use strict';

	/* jshint node: true */

	var A1DocApi = {
		new: function(data) {
			console.log('Call new');
		},
		getByNumeroTramite: function(numeroTramite) {
			console.log('getByNumeroTramite');
		}
	};

	module.exports = A1DocApi;
}());