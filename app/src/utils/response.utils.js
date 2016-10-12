(function() {

	'use strict';

	/* jshint node: true */

	var logger = require('./logger');

	var responseUtils = {
		sendJsonResponse: function(res, status, content) {
        	res.status(status);
        	res.json(content);
        	if (400 === status || 404 === status) {
            	logger.error(content);
        	}
		}
	};

	module.exports = responseUtils;
}());