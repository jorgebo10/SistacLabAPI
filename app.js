(function() {

'use strict';

var logger = require('./app/utils/logger');
var express = require('express');
var config = require('./config/environment');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var autoIncrement = require('mongoose-auto-increment');
require('express-safe-json')(express);

var connection = mongoose.connect(config.mongo.uri, config.mongo.options);
autoIncrement.initialize(connection);

if (config.seedDB) {
 require('./config/seed');
}
var app = express();

require('express-safe-json')(app);
require('./config/express')(app);
require('./config/routes')(app);

app.listen(config.port, config.ip, function () {
	logger.info('Express server listening on %d, in %s mode and logging into %s', config.port, config.env, config.logsDir);
	if (config.env === 'development') {
		logger.warn('Application running in development mode');
	}
});

exports = module.exports = app;
}());
