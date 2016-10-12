(function() {

'use strict';

var express = require('express');
var controller = require('./foto.controller');

var router = express.Router();

router.get('/', controller.findByInformeIdAndTags);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.post('/sync', controller.create);
router.put('/:id',  controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
}());
