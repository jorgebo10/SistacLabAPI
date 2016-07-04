(function() {
	
'use strict';

var express = require('express');
var controller = require('./empresa.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.findAll);
router.get('/:codigo', auth.hasRole('admin'), controller.getByCodigo);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:codigo', auth.hasRole('admin'), controller.update);
router.patch('/:codigo', auth.hasRole('admin'), controller.update);
router.delete('/:codigo', auth.hasRole('admin'), controller.deleteByCodigo);
router.post('/resetToken', controller.syncTokenRequest);

module.exports = router;
}());
