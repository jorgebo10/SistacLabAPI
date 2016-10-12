(function() {

	'use strict';

	var express = require('express');
	var controller = require('./empresa.controller');
	var auth = require('../../auth/auth.service');

	var router = express.Router();

	router.get('/', controller.findAll);
	router.get('/:codigo', controller.getByCodigo);
	router.post('/', controller.create);
	router.put('/:codigo', controller.update);
	router.patch('/:codigo', controller.update);
	router.delete('/:codigo', controller.deleteByCodigo);
	router.post('/resetToken', controller.syncTokenRequest);

	module.exports = router;
}());