(function() {
'use strict';

/* jshint node: true */

var A1 = require('./a1.model');
var logger = require('../../../utils/logger');

var sendJsonResponse = function(res, status, content) {
    res.status(status);
	res.json(content);
    if (400 === status || 404 === status) {
        logger.error(content);
    }
};

exports.getByCit = function(req, res) {
    logger.debug('Entering A1Controller#getByCit(req.query.cit={%s})', req.query.cit);

    if (!req.query || !req.query.cit) {
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
                    return sendJsonResponse(res, 404, {'message': 'No results found while searching by cit ' + req.query.cit});
                } else {
                    logger.info('Found a1Doc with cit %s while searching by cit %s', req.query.cit, a1.cit);
                    return sendJsonResponse(res, 200, a1);
                }
            }
        )
        .catch(
            function(err) {
                return sendJsonResponse(res, 400, err);
            }
        );

    logger.debug('Leaving A1Controller#getByCit');
};


exports.getByNumeroTramite = function(req, res) {
    logger.debug('Entering A1Controller#getByNumeroTramite(req.params.numeroTramite={%s})', req.params.numeroTramite);

    if (!req.params || !req.params.numeroTramite) {
        return sendJsonResponse(res, 404, {
            'message': 'numeroTramite not found in request params'
        });
    }
    A1
        .getByNumeroTramite(req.params.numeroTramite)
        .then(
            function(a1) {
                if (null === a1) {
                    return sendJsonResponse(res, 404, {'message': 'No results found while searching by numeroTramite ' + req.params.numeroTramite});
                } else {
                    logger.info('Found a1Doc with numeroTramite %s while searching by numeroTramite %s', req.params.numeroTramite, a1.numeroTramite);
                    return sendJsonResponse(res, 200, a1);
                }
            }
        )
        .catch(
            function(err) {
                return sendJsonResponse(res, 400, err);
            }
        );

    logger.debug('Leaving A1Controller#getByNumeroTramite');
};

exports.findAll = function(req, res) {
    logger.debug('Entering A1Controller#findAll');
    A1
        .find()
        .select('-sequence -__v')
        .exec()
        .then(
            function(a1s) {
                logger.info('Found %d results while searching by all', a1s.length);
                return sendJsonResponse(res, 200, a1s);
            }
        )
        .catch(
            function(err) {
                return sendJsonResponse(res, 400, err);
            }
        );
    logger.debug('Leaving A1Controller#findAll');
};

exports.create = function(req, res) {
    logger.debug('Entering A1Controller#create(req.body={%s}', req.body);
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
            logger.info('A1Doc created with numeroTramite %s', a1.numeroTramite);
            return sendJsonResponse(res, 201, a1);
        }
    )
    .catch(
        function(err) {
            return sendJsonResponse(res, 400, err);
        }
    );
    logger.debug('Leaving A1Controller#create');
};

exports.update = function(req, res) {
    logger.debug('Entering A1Controller#update %j', req.body);
    if (!req.params || !req.params.numeroTramite) {
        return sendJsonResponse(res, 404, {
            'message': 'numeroTramite not found in request params'
        });
    }
    A1
        .findOneAndUpdate({numeroTramite: req.params.numeroTramite}, { 
            cit: req.body.cit,
            normaFabricacion : req.body.normaFabricacion,
            fabricante : req.body.fabricante,
            nombreInstalacion : req.body.nombreInstalacion,
            matricula : req.body.matricula,
            estado : req.body.estado,
            anioFabricacion : req.body.anioFabricacion,
            anioInstalacion : req.body.anioInstalacion,
            placaIdentificacion : req.body.placaIdentificacion,
            temperaturaOperacion : req.body.temperaturaOperacion,
            especificacionChapas : req.body.especificacionChapas,
            numeroInterno : req.body.numeroInterno,
            observaciones : req.body.observaciones,
            laminasInspeccionadas : req.body.laminasInspeccionadas,
            elevado : req.body.elevado,
            tieneInspeccionesAnteriores: req.body.tieneInspeccionesAnteriores
        }, {runValidators: true})
        .exec()
        .then(
            function(a1) {
                if (null === a1) {
                    return sendJsonResponse(res, 404, {'message': 'No results found while searching by numeroTramite ' + req.params.numeroTramite});
                } else {
                    logger.info('A1Doc updated by numeroTramite %s', a1.numeroTramite);
                    return sendJsonResponse(res, 200, a1.numeroTramite);
                }
            }
        )
        .catch(
            function(err) {
                return sendJsonResponse(res, 400, err);
            }
        );
    logger.debug('Leaving A1Controller#update');
};

exports.deleteByNumeroTramite = function(req, res) {
    logger.debug('Entering A1Controller#deleteByNumeroTramite(req.params.numeroTramite={%s}', req.params.numeroTramite);
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
                logger.info('A1Doc deleted by numeroTramite %s', a1.numeroTramite);
                return sendJsonResponse(res, 204, a1);
            }
        )
        .catch(
            function(err) {
                return sendJsonResponse(res, 400, err);
            }
        );
    logger.debug('Entering A1Controller#deleteByNumeroTramite');
};
}());
