(function() {

'use strict';

var logger = require('../app/utils/logger.js');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var path = require('path');
var config = require('./environment');
var passport = require('passport');

module.exports = function(app) {
  app.use(bodyParser.json({limit: '5mb'}));
  app.use(bodyParser.urlencoded({extended: false, limit: '5mb'}));
  app.use(methodOverride());
  app.use(passport.initialize());
  app.use(morgan('dev', {"stream": logger.stream}));
};
}());
