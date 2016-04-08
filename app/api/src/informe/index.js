(function() {
'use strict';

var express = require('express');
var controller = require('./informe.controller');
var config = require('../../config/environment');

var router = express.Router();

router.get('/:id', controller.show);
router.get('/param/userId', controller.getInformesUsuario);
router.get('/medicionesAlturaVirolas/:informeId', controller.getMedicionesAlturaVirolas);
router.get('/medicionesChapa/:informeId', controller.getMedicionesChapa);
router.get('/espesoresEnvolvente/:informeId', controller.getEspesoresEnvolvente);
router.get('/espesoresAccesorios/:informeId', controller.getEspesoresAccesorios);
router.get('/espesoresAsentamiento/:informeId', auth.isAuthenticated(), controller.getEspesoresAsentamiento);
router.get('/espesoresCunas/:informeId', auth.isAuthenticated(), controller.getEspesoresCunas);
router.get('/espesoresCabezales/:informeId', auth.isAuthenticated(), controller.getEspesoresCabezales);
router.get('/espesoresPiso/:informeId', auth.isAuthenticated(), controller.getEspesoresPiso);
router.get('/espesoresTecho/:informeId', auth.isAuthenticated(), controller.getEspesoresTecho);
router.get('/observacionesMFL/:informeId', auth.isAuthenticated(), controller.getObservacionesMFL);
router.get('/:id/cabezalesInfo', controller.cabezalesInfoByInformeId);
router.post('/espesoresPiso', auth.isAuthenticated(), controller.updateEspesoresPiso);
router.post('/espesoresTecho', auth.isAuthenticated(), controller.updateEspesoresTecho);
router.post('/espesoresEnvolvente', auth.isAuthenticated(), controller.updateEspesoresEnvolvente);
router.post('/espesoresAccesorios', auth.isAuthenticated(), controller.updateEspesoresAccesorios);
router.post('/espesoresAsentamiento', auth.isAuthenticated(), controller.updateEspesoresAsentamiento);
router.post('/espesoresCunas', auth.isAuthenticated(), controller.updateEspesoresCunas);
router.post('/espesoresCabezales', auth.isAuthenticated(), controller.updateEspesoresCabezales);


router.post('/observacionesMFL', auth.isAuthenticated(), controller.updateObservacionesMFL);
router.get('/calculosEspesores/:informeId', auth.isAuthenticated(), controller.getCalculosEspesores);
router.post('/calculosEspesores', auth.isAuthenticated(), controller.updateCalculosEspesores);
router.post('/crearCalculoEspesor', auth.isAuthenticated(), controller.crearCalculoEspesor);
router.get('/calculosEnvolventeHorizontal/:informeId', auth.isAuthenticated(), controller.getCalculosEnvolvente);
router.post('/calculosEnvolvente', auth.isAuthenticated(), controller.updateCalculosEnvolvente);
router.post('/crearCalculoEnvolvente', auth.isAuthenticated(), controller.crearCalculoEnvolvente);
router.post('/', controller.create);
router.post('/sync', auth.isEmpresaAuthenticatedToSync(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);


module.exports = router;
}());
