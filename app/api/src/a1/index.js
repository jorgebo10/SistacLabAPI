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
router.get('/:numeroTramite', controller.getByNumeroTramite);
router.post('/', controller.create);
router.put('/:numeroTramite', controller.update);
router.patch('/:numeroTramite', controller.update);
router.delete('/:numeroTramite', controller.deleteByNumeroTramite);

module.exports = router;
}());
