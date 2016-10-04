(function() {
'use strict';

/* jshint node: true */

var Empresa = require('./empresa.model');
var logger = require('../../../utils/logger');
var authUtils = require('../../../utils/auth.utils');

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
    if (400 === status || 404 === status) {
        logger.error(content);
    }
};

exports.findAll = function(req, res) {
    logger.info('Entering EmpresaController#findAll');

    Empresa
        .find()
        .select('-sequence -__v')
        .exec()
        .then(
            function(empresas) {
                logger.info('Found %d results while searching by all', empresas.length);
                return sendJsonResponse(res, 200, empresas);
            }
        )
        .catch(
            function(err) {
                return sendJsonResponse(res, 400, err);
            }
        );

    logger.info('Leaving EmpresaController#findAll');
};

exports.getByCodigo = function(req, res) {
    logger.info('Entering EmpresaController#getByCodigo(req.params.codigo={%s})', req.params.codigo);

    if (!req.params || !req.params.codigo) {
        return sendJsonResponse(res, 404, {
            'message': 'codigo not found in request params'
        });
    }

    Empresa
        .getByCodigo(req.params.codigo)
        .then(
            function(empresa) {
                if (null === empresa) {
                    return sendJsonResponse(res, 404, {'message': 'No results found while searching by codigo ' + req.params.codigo});
                } else {
                    logger.info('Found empresa with codigo %s while searching by codigo %s', empresa.codigo, req.params.codigo);
                    return sendJsonResponse(res, 200, empresa);
                }
            }
        )
        .catch(
            function(err) {
                return sendJsonResponse(res, 400, err);
            }
        );

    logger.info('Leaving EmpresaController#getByCodigo');
};

exports.create = function(req, res) {
    logger.info('Entering EmpresaController#create(req.body={%s}', req.body);
    
    if (!req.body.codigo || !req.body.email) {
        return sendJsonResponse(res, 404, {
            'message': 'codigo or email not found in request params or email not found in request body'
        });
    }

    Empresa.create({
        codigo: req.body.codigo,
        nombre: req.body.nombre,
        razonSocial: req.body.razonSocial,
        direccion: req.body.direccion,
        telefono: req.body.telefono,
        email: req.body.email,
        password: req.body.password,
        token: req.body.token,
        contacto: req.body.contact,
        imagen: req.body.imagen !== undefined ? req.body.imagen.src : ''
    })
    .exec()
    .then(
        function(empresa) {
            logger.info('Empresa created with codigo %s', empresa.codigo);
            return sendJsonResponse(res, 201, empresa);
        }
    )
    .catch(
        function(err) {
            return sendJsonResponse(res, 400, err);
        }
    );

    logger.info('Leaving EmpresaController#create');
};

exports.update = function(req, res) {
  logger.info('Entering EmpresaController#update %j', req.body);

    if (!req.params || !req.params.codigo || !req.body.email) {
        return sendJsonResponse(res, 404, {
            'message': 'codigo or email not found in request params or email not found in request body'
        });
    }

    Empresa
        .findOneAndUpdate({codigo: req.params.codigo}, { 
            codigo: req.body.codigo,
            nombre: req.body.nombre,
            razonSocial: req.body.razonSocial,
            direccion: req.body.direccion,
            telefono: req.body.telefono,
            email: req.body.email,
            password: req.body.password,
            token: req.body.token,
            contacto: req.body.contact,
            imagen: req.body.imagen !== undefined ? req.body.imagen.src : ''
        }, {runValidators: true})
        .exec()
        .then(
            function(empresa) {
                if (null === empresa) {
                    return sendJsonResponse(res, 404, {'message': 'No results found while searching by codigo ' + req.params.codigo});
                } else {
                    logger.info('Empresa updated by codigo %s', empresa.codigo);
                    return sendJsonResponse(res, 200, empresa.codigo);
                }
            }
        )
        .catch(
            function(err) {
                return sendJsonResponse(res, 400, err);
            }
        );

    logger.info('Leaving EmpresaController#update');
};

exports.deleteByCodigo = function(req, res) {
    logger.info('Entering EmpresaController#deleteByCodigo(req.params.codigo={%s}', req.params.codigo);


    if (!req.params.codigo) {
        return sendJsonResponse(res, 404, {
            'message': 'codigo not found in request params'
        });
    }

    Empresa
        .findOneAndRemove({
            codigo: req.params.codigo
        })
        .exec()
        .then(
            function(empresa) {
                logger.info('Empresa deleted by codigo %s', empresa.codigo);
                return sendJsonResponse(res, 204, empresa);
            }
        )
        .catch(
            function(err) {
                return sendJsonResponse(res, 400, err);
            }
        );

    logger.info('Entering EmpresaController#deleteByCodigo');
};

exports.resetToken = function(req, res, next) {
    logger.info('Entering EmpresaController#resetToken(req.body.codigo={%s}', req.body.codigo);

    if (!req.body || !req.body.codigo || !req.body.password) {
        return sendJsonResponse(res, 404, {
            'message': 'Codigo and/or password not found in request body'
        });
    }

    var codigo = String(req.body.codigo).toUpperCase();
    var password = String(req.body.password);

    Empresa
        .getByCodigo(codigo)
        .then(
            function(empresa) {
                if (null === empresa) {
                    return sendJsonResponse(res, 404, {
                        'message': 'Empresa not found by codigo: ' + req.body.codigo
                    });
                }

                if (empresa.password !== password) {
                    sendJsonResponse(res, 401, {
                        'message': 'Authetication failure'
                    });
                } else {
                    sendJsonResponse(res, 200, {
                        email: empresa.email,
                        codigo: empresa.codigo,
                        token: authUtils.sign(empresa._id)
                    });
                }
            }
        )
        .catch(
            function(err) {
                console.log(err);
                return sendJsonResponse(res, 400, err);
            }
        );

    logger.info('Leaving EmpresaController#resetToken');
};
}());
