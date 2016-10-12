(function() {

	'use strict';

	/* jshint node: true */

	var config = require('../../../config/environment');
	var jwt = require('jsonwebtoken');

	var authUtils = {
		sign: function(data) {
			return jwt.sign({
				_id: data
			}, config.secrets.mobileAuthToken, {
				expiresInMinutes: config.secrets.mobileAuthTokenExpiresInMinutes
			});
		}
	};

	module.exports = authUtils;
}());