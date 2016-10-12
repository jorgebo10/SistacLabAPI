(function() {
	'use strict';

	var express = require('express');
	var controller = require('./contrato.controller');
	var auth = require('../../auth/auth.service');

	var router = express.Router();

	router.get('/', auth.hasRole('comercial'), controller.index);
	router.get('/:id', auth.hasRole('comercial'), controller.show);
	router.post('/', auth.hasRole('comercial'), controller.create);
	router.put('/:id', auth.hasRole('comercial'), controller.update);
	router.patch('/:id', auth.hasRole('comercial'), controller.update);
	router.delete('/:id', auth.hasRole('comercial'), controller.destroy);
	router.get('/contratoByName/:contrato', auth.hasRole('comercial'), controller.getByName);
	router.get('/export-data/:id/:certificado', auth.hasRole('comercial'), controller.exportData);

	module.exports = router;
}());