(function() {

'use strict';

var winston = require('winston');
winston.emitErrs = true;

var path = require('path');
var config = require('../../config/environment');

var logger = new winston.Logger({
	transports: [
		new winston.transports.File({
			name: 'info-file',
			filename: config.logsDir + '/all-logs.log',
			level: 'debug',
			maxsize: 5242880,
			maxFiles: 5,
			colorize: false
		}),
		new winston.transports.Console({
			level: 'debug',
			handleExceptions: true,
			json: false,
			colorize: true 
		})
	],
	exitOnError: false
});

module.exports = logger;
module.exports.stream = {
	write: function(message, encoding) {
		logger.info(message);
	}
};
}());
