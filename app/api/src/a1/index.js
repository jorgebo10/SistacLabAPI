(function() {
'use strict';

var express = require('express');
var controller = require('./a1.controller');
var _ = require('underscore');

var router = express.Router();

router.get('/', function(req, res, next) {

	if (!_.isEmpty(req.query)) {
		controller.getByCit(req, res);
	} else {
		controller.findAll(req, res);
	}
});
router.get('/:id', controller.getByNumeroTramite);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.deleteByNumeroTramite);

module.exports = router;
}());
