(function() {
'use strict';

var mongoose = require('mongoose');
var Informe = require('../informe/informe.model');
var Empresa = require('./empresa.model');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var winston = require('winston');
var sistacLoggerError = winston.loggers.get('sistac-error');

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
    if (400 === status || 404 === status) {
        sistacLoggerError.error(content);
    }
};

exports.index = function(req, res) {
    Empresa
        .find({
            active: true
        })
        .select('-sequence -__v')
        .exec(
            function(err, a1s) {
                if (err) {
                    return sendJsonResponse(res, 400, err);
                }
                return sendJsonResponse(res, 200, a1s);
            }
        );
};

exports.getById = function(req, res) {
    if (!req.params || !req.params.id) {
        return sendJsonResponse(res, 404, {
            'message': 'id not found in request params'
        });
    }
    Empresa
        .findById(req.params.id)
        .select('-sequence -__v')
        .exec(
            function(err, empresa) {
                if (err) {
                    return sendJsonResponse(res, 400, err);
                } else if (!empresa) {
                    return sendJsonResponse(res, 404, {
                        'message': 'empresa not found by id: ' + req.params.id
                    });
                } else {
                    return sendJsonResponse(res, 200, empresa);
                }
            }
        );
};

exports.create = function(req, res) {
    Empresa.create({
        nombre: req.body.nombre,
        razonSocial: req.body.razonSocial,
        direccion: req.body.direccion,
        telefono: req.body.telefono,
        email: req.body.email,
        password: req.body.password,
        token: req.body.token,
        contacto: req.body.contact,
        imagen: req.body.imagen !== undefined ? req.body.imagen.src : ''
    }, function(err, empresa) {
        return err ? sendJsonResponse(res, 400, err) : sendJsonResponse(res, 201, empresa);
    });
};

exports.update = function(req, res) {
    if (!req.params || !req.params.id) {
        return sendJsonResponse(res, 404, {
            'message': 'id not found in request params'
        });
    }
    Empresa
        .findById(req.params.id)
        .exec(
            function(err, empresa) {
                if (err) {
                    return sendJsonResponse(res, 400, err);
                } else if (!empresa) {
                    return sendJsonResponse(res, 404, {
                        'message': 'Empresa not found by id:' + req.params.id
                    });
                }
                empresa.nombre = req.body.nombre;
                empresa.razonSocial = req.body.razonSocial;
                empresa.direccion = req.body.direccion;
                empresa.telefono = req.body.telefono;
                empresa.email = req.body.email;
                empresa.password = req.body.password;
                empresa.token = req.body.token;
                empresa.contacto = req.body.contact;
                empresa.imagen = req.body.imagen !== undefined ? req.body.imagen.src : '';
                empresa.save(
                    function(err, empresa) {
                        return err ? sendJsonResponse(res, 400, err) : sendJsonResponse(res, 200, empresa);
                    }
                );
            }
        );
};

exports.delete = function(req, res) {
    var id = req.params.id;
    if (id) {
        Informe
            .findOne({
                empresa: new mongoose.mongo.ObjectID(id)
            })
            .select('_id')
            .exec(
                function(err, empresa) {
                    if (empresa) {
                        return sendJsonResponse(res, 400, {
                            'message': 'Informes are associated to empresa'
                        });
                    } else {
                        Empresa
                            .findByIdAndRemove(id)
                            .exec(
                                function(err) {
                                    if (err) {
                                        return sendJsonResponse(res, 404, err);
                                    }
                                    return sendJsonResponse(res, 204, null);
                                }
                            );
                    }
                }
            );
    } else {
        return sendJsonResponse(res, 404, {
            'message': 'Empresa not found by id: ' + id
        });
    }
};

exports.syncTokenRequest = function(req, res, next) {
    if (!req.body || !req.body.nombre || !req.body.password) {
        return sendJsonResponse(res, 404, {
            'message': 'Credentials not found in request body'
        });
    }

    var nombre = String(req.body.nombre).toUpperCase();
    var pass = String(req.body.password);

    Empresa.findOne({
        nombre: nombre
    }, function(err, empresa) {
        if (err) {
            return next(err);
        }

        if (!empresa) {
            return sendJsonResponse(res, 404, {
                'message': 'Empresa not found by nombre: ' + nombre
            });
        }

        if (empresa.password !== pass) {
            res.setHeader('WWW-Authenticate', 'empresa:pass incorrect');
            return sendJsonResponse(res, 401, {
                'message': 'Authetication failure'
            });
        } else {
            var token = jwt.sign({
                _id: empresa._id
            }, config.secrets.mobileAuthToken, {
                expiresInMinutes: 30 * 24 * 60
            });
            return res.json({
                email: empresa.email,
                name: empresa.razonSocial,
                token: token
            });
        }
    });
};
}());
