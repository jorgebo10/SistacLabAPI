(function() {

'use strict';

var express = require('express');
var controller = require('./contratoinformehistorico.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('comercial'), controller.index);
router.get('/:id', auth.hasRole('comercial'), controller.show);
router.post('/', auth.hasRole('comercial'), controller.create);
router.put('/:id', auth.hasRole('comercial'), controller.update);
router.patch('/:id', auth.hasRole('comercial'), controller.update);
router.delete('/:id', auth.hasRole('comercial'), controller.destroy);
router.get('/certificadosContrato/:contrato', auth.hasRole('comercial'), controller.getCertificadosContrato);
router.get('/contratoInformeHistorico/:contrato/:certificado', auth.hasRole('comercial'), controller.getContratoInformeHistorico);
router.get('/contratoInformeHistoricoAnterior/:contrato', auth.hasRole('comercial'), controller.getContratoInformeHistoricoAnterior);

module.exports = router;
}());

