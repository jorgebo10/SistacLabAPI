(function() {

'use strict';

var logger = require('./app/utils/logger');
var express = require('express');
var config = require('./config/environment');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
require('express-safe-json')(express);

var connection = mongoose.connect(config.mongo.uri, config.mongo.options);
autoIncrement.initialize(connection);

if (config.seedDB) {
 require('./config/seed');
}
logger.debug('esto es debug');
var app = express();

require('./config/express')(app);
require('./config/routes')(app);

app.listen(config.port, config.ip, function () {
  logger.info('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

exports = module.exports = app;
}());
