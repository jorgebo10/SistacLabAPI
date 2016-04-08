(function() {
'use strict';

var express = require('express');
var controller = require('./a1.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', function(req, res, next) {
	if (req.query.cit) {
		controller.findByCit(req, res);
	} else {
		controller.findAll(req, res);
	}
});
router.get('/:id', auth.hasRole('admin'), controller.getByNumeroTramite);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.delete);

module.exports = router;
}());
