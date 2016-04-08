(function() {
'use strict';

var _ = require('lodash');
var ContratoinformeHistorico = require('./contratoinformehistorico.model');
var winston = require('winston');
var sistacLoggerError = winston.loggers.get('sistac-error');
var sistacLoggerInfo = winston.loggers.get('sistac-info');

// Get list of contratoinformesHistoricos
exports.index = function(req, res) {
  ContratoinformeHistorico.find(function (err, contratoinformesHistoricos) {
    if(err) { return handleError(res, err); }
    return res.json(200, contratoinformesHistoricos);
  });
};

// Get a single contratoinformesHistorico
exports.show = function(req, res) {
  ContratoinformeHistorico.findById(req.params.id, function (err, contratoinformesHistorico) {
    if(err) { return handleError(res, err); }
    if(!contratoinformesHistorico) { return res.send(404); }
    return res.json(contratoinformesHistorico);
  });
};

// Creates a new contratoinformesHistorico in the DB.
exports.create = function(req, res) {
  ContratoinformeHistorico.create(req.body, function(err, contratoinformesHistorico) {
    if(err) { return handleError(res, err); }
    return res.json(201, contratoinformesHistorico);
  });
};

// Updates an existing contratoinformesHistorico in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  ContratoinformeHistorico.findById(req.params.id, function (err, contratoinformesHistorico) {
    if (err) { return handleError(res, err); }
    if(!contratoinformesHistorico) { return res.send(404); }
    var updated = _.merge(contratoinformesHistorico, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, contratoinformesHistorico);
    });
  });
};

// Deletes a contratoinformesHistorico from the DB.
exports.destroy = function(req, res) {
  ContratoinformeHistorico.findById(req.params.id, function (err, contratoinformesHistorico) {
    if(err) { return handleError(res, err); }
    if(!contratoinformesHistorico) { return res.send(404); }
    contratoinformesHistorico.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

exports.getContratoInformeHistorico = function(req, res) {
  console.log('LLEGA '+req.params.contrato+' Cert: '+req.params.certificado);
//  return res.send(500);
  ContratoinformeHistorico.find({
    contrato: req.params.contrato,
    certificado: req.params.certificado
  }, {
    contrato: 0,
    __v: 0
  }, function(err, informes) {
    if (err) {
      console.log('ERR1 '+err);
      sistacLoggerError.error('ERROR AL BUSCAR CERTIFICADO - Contrato: ' + req.params.contrato + ', Certificado: ' + req.params.certificado + ' - ' + err);
    }
    if (!informes) {
      console.log('ERR2 ');
    }
    console.log('OBTIENE HISTORICOS '+informes.length+'-');
    return res.json(informes);
  }).populate('informe');
};

exports.getContratoInformeHistoricoAnterior = function(req, res) {
  console.log('LLEGA '+req.params.contrato+' Cert: '+req.params.certificado);
//  return res.send(500);
  ContratoinformeHistorico.find({
    contrato: req.params.contrato
  }, {
    contrato: 0,
    __v: 0
  }, function(err, informes) {
    if (err) {
      console.log('ERR1 '+err);
      sistacLoggerError.error('ERROR AL BUSCAR CERTIFICADO - Contrato: ' + req.params.contrato + ', Certificado: ' + req.params.certificado + ' - ' + err);
    }
    if (!informes) {
      console.log('ERR2 ');
    }
    console.log('OBTIENE HISTORICOS '+informes.length+'-');
    if (informes.length > 0){
      console.log('INF '+informes[0].certificado);
    }
    return res.json(200, informes);
  }).populate('informe').sort({'certificado':-1});
};

exports.getCertificadosContrato = function(req, res) {
  ContratoinformeHistorico.distinct('certificado', {
    contrato: req.params.contrato
  },function(err, certificados) {
    if (err) {
      sistacLoggerError.error('ERROR AL BUSCAR CERTIFICADOS DEL CONTRATO: ' + req.params.contrato + ' - ' + err);
    }
    if (!certificados) {
      sistacLoggerInfo.info('!CERTIFICADOS DEL CONTRATO: ' + req.params.contrato);
    }
    return res.json(200, certificados);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
}());
