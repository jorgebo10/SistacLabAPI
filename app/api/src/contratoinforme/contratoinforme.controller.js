(function() {
'use strict';

var _ = require('lodash');
var Contratoinforme = require('./contratoinforme.model');
var winston = require('winston');
var sistacLoggerError = winston.loggers.get('sistac-error');

// Get list of contratoinformes
exports.index = function(req, res) {
  Contratoinforme.find(function (err, contratoinformes) {
    if(err) { return handleError(res, err); }
    return res.json(200, contratoinformes);
  });
};

// Get a single contratoinforme
exports.show = function(req, res) {
  Contratoinforme.findById(req.params.id, function (err, contratoinforme) {
    if(err) { return handleError(res, err); }
    if(!contratoinforme) { return res.send(404); }
    return res.json(contratoinforme);
  });
};

// Creates a new contratoinforme in the DB.
exports.create = function(req, res) {
  Contratoinforme.create(req.body, function(err, contratoinforme) {
    if(err) { return handleError(res, err); }
    return res.json(201, contratoinforme);
  });
};

// Updates an existing contratoinforme in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Contratoinforme.findById(req.params.id, function (err, contratoinforme) {
    if (err) { return handleError(res, err); }
    if(!contratoinforme) { return res.send(404); }
    var updated = _.merge(contratoinforme, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, contratoinforme);
    });
  });
};

// Deletes a contratoinforme from the DB.
exports.destroy = function(req, res) {
  Contratoinforme.findById(req.params.id, function (err, contratoinforme) {
    if(err) { return handleError(res, err); }
    if(!contratoinforme) { return res.send(404); }
    contratoinforme.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

exports.getContratoInforme = function(req, res) {
  Contratoinforme.findOne({
    informe: req.params.informeId
  }, function(err, contratoInforme) {
    if (err) {
      sistacLoggerError.error('Error al buscar Contrato/Informe ' + req.params.informeId);
      return handleError(res, err);
    }
    if (!contratoInforme) {
      return res.send(404);
    }
    return res.json(200, contratoInforme);
  }).populate('contrato');
};

exports.updateContratoInforme = function(req, res) {
  Contratoinforme.findById(req.body._id, function(err, contratoInforme) {
    if (err) {
      return handleError(res, err);
    }
    if (!contratoInforme) {
      return res.send(404);
    }
    var updated = _.merge(contratoInforme, req.body);
    updated.save(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, contratoInforme);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
}());
