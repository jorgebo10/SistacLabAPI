(function() {
'use strict';

/* jshint node: true */

var A1 = require('./a1.model');
var winston = require('winston');
var sistacLoggerError = winston.loggers.get('sistac-error');
var _ = require('underscore');

var sendJsonResponse = function(res, status, content) {
    res.status(status);
	res.json(content);
    if (400 === status || 404 === status) {
        sistacLoggerError.error(content);
    }
};

exports.getByCit = function(req, res) {
    if (_.isEmpty(req.query) || !req.query.cit) {
        return sendJsonResponse(res, 404, {
            'message': 'cit not found in request params'
        });
    }
    /*
     Although this method is expected to return one object,
     it is implemented to return an array so that we have compatibility
      with other finders method
     */
    A1
        .getByCit(req.query.cit)
		.then(
            function(a1) {
                if (null === a1) {
                    return sendJsonResponse(res, 404, {'message': 'a1Doc not found'});
                } else {
                    return sendJsonResponse(res, 200, a1);
                }
            }
        )
        .catch(
            function(err) {
                return sendJsonResponse(res, 400, err);
            }
        );
};


exports.getByNumeroTramite = function(req, res) {
    if (!req.query || !req.query.numeroTramite) {
        return sendJsonResponse(res, 404, {
            'message': 'numeroTramite not found in request params'
        });
    }
    A1
        .getByNumeroTramite(req.query.numeroTramite)
        .then(
            function(a1) {
                if (null === a1) {
                    return sendJsonResponse(res, 404, {'message': 'a1Doc not found'});
                } else {
                    return sendJsonResponse(res, 200, a1);
                }
            }
        )
        .catch(
            function(err) {
                return sendJsonResponse(res, 400, err);
            }
        );
};

exports.findAll = function(req, res) {
    A1
        .find()
        .select('-sequence -__v')
        .exec()
        .then(
            function(a1s) {
                return sendJsonResponse(res, 200, a1s);
            }
        )
        .catch(
            function(err) {
                return sendJsonResponse(res, 400, err);
            }
        );
};

exports.create = function(req, res) {
    if (!req.body.numeroTramite) {
        return sendJsonResponse(res, 404, {
            'message': 'numeroTramite not found'
        });
    }
    A1.create({
        numeroTramite: req.body.numeroTramite,
        cit: req.body.cit,
        normaFabricacion: req.body.normaFabricacion,
        fabricante: req.body.fabricante,
        matricula: req.body.matricula,
        estado: req.body.estado,
        nombreInstalacion: req.body.nombreInstalacion,
        anioFabricacion: req.body.anioFabricacion,
        anioInstalacion: req.body.anioInstalacion,
        placaIdentificacion: req.body.placaIdentificacion,
        temperaturaOperacion: req.body.temperaturaOperacion,
        especificacionChapas: req.body.especificacionChapas,
        numeroInterno: req.body.numeroInterno,
        observaciones: req.body.observaciones,
        elevado: req.body.elevado,
        tieneInspeccionesAnteriores: req.body.tieneInspeccionesAnteriores,
        laminasInspeccionadas: req.body.laminasInspeccionadas
    })
    .exec()
    .then(
        function(a1) {
            return sendJsonResponse(res, 201, a1);
        }
    )
    .catch(
        function(err) {
            return sendJsonResponse(res, 400, err);
        }
    );
};

exports.update = function(req, res) {
    if (!req.params || !req.params.id) {
        return sendJsonResponse(res, 404, {
            'message': 'id not found in request params'
        });
    }
    A1
        .findOne({
            numeroTramite: req.params.id
        })
        .exec(
            function(err, a1) {
                if (err) {
                    return sendJsonResponse(res, 400, err);
                } else if (!a1) {
                    return sendJsonResponse(res, 404, {
                        'message': 'A1 not found by numeroTramite:' + req.params.id
                    });
                }
                a1.numeroTramite = req.body.numeroTramite;
                a1.cit = req.body.cit;
                a1.normaFabricacion = req.body.normaFabricacion;
                a1.fabricante = req.body.fabricante;
                a1.nombreInstalacion = req.body.nombreInstalacion;
                a1.matricula = req.body.matricula;
                a1.estado = req.body.estado;
                a1.anioFabricacion = req.body.anioFabricacion;
                a1.anioInstalacion = req.body.anioInstalacion;
                a1.placaIdentificacion = req.body.placaIdentificacion;
                a1.temperaturaOperacion = req.body.temperaturaOperacion;
                a1.especificacionChapas = req.body.especificacionChapas;
                a1.numeroInterno = req.body.numeroInterno;
                a1.observaciones = req.body.observaciones;
                a1.laminasInspeccionadas = req.body.laminasInspeccionadas;
                a1.elevado = req.body.elevado;
                a1.tieneInspeccionesAnteriores = req.body.tieneInspeccionesAnteriores;
                a1.save(function(err, a1) {
                    return err ? sendJsonResponse(res, 400, err) : sendJsonResponse(res, 200, a1);
                });
            }
        );
};

exports.deleteByNumeroTramite = function(req, res) {
    var numeroTramite = req.params.numeroTramite;
    if (!numeroTramite) {
        return sendJsonResponse(res, 404, {
            'message': 'a1Doc not found'
        });
    }

    A1
        .findOneAndRemove({
            numeroTramite: numeroTramite
        })
        .exec()
        .then(
            function(a1) {
                return sendJsonResponse(res, 204, a1);
            }
        )
        .catch(
            function(err) {
                return sendJsonResponse(res, 400, err);
            }
        );
};
}());
