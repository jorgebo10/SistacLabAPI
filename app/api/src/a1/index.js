(function() {
'use strict';

var express = require('express');
var controller = require('./a1.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', function(req, res, next) {
	console.log(req);
	if (req.query.cit) {
		controller.findByCit(req, res);
	} else {
		controller.findAll(req, res);
	}
});
router.get('/:id', controller.getByNumeroTramite);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
}());
