(function() {

'use strict';

var logger = require('../app/utils/logger.js');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var path = require('path');
var config = require('./environment');
var passport = require('passport');

module.exports = function(app) {
	app.disable('x-powered-by');
	app.use("/api/", function(req, res, next) {
		var contentType = req.headers['content-type'];
		if ((req.method === 'POST' || req.method === 'PUT') && !contentType && contentType.indexOf('application/json') !== 0)   {
	return res.status(406);
		} else if (req.method === 'GET' && req.get('accept') !== 'application/json') {
	return res.status(406);
} else {
			next();
   }
	});
  app.use(bodyParser.json({limit: '5mb'}));
  app.use(bodyParser.urlencoded({extended: false, limit: '5mb'}));
  app.use(methodOverride());
  app.use(passport.initialize());
  app.use(morgan('dev', {"stream": logger.stream}));
};
}());
