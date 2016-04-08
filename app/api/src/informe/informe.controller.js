(function() {
'use strict';

/* jshint loopfunc: true */

var _ = require('lodash');
var Informe = require('./informe.model');
var FotoController = require('../foto/foto.controller');
var Empresa = require('../empresa/empresa.model');
var UsuarioEmpresaModel = require('../usuarioempresa/usuarioempresa.model');
var winston = require('winston');
var sistacLoggerError = winston.loggers.get('sistac-error');
var sistacLoggerInfo = winston.loggers.get('sistac-info');
var auth = require('../../auth/auth.service');

// Get list of informes from user
exports.getInformesUsuario = function(req, res) {
    //Si es Admin ve todos
    if (auth.hasEspecificRole(req.user.role, 'admin')) {
        Informe.find(function(err, informes) {
            if (err) {
                return handleError(res, err);
            }
            sistacLoggerInfo.info('Buscando informes con perfil admin');
            return res.json(200, informes.sort(reverseSortByObjectProperty('informeCampoDetails', 'fechaHora')));
        });
    } else {
        //Filtro por usuario
        findEmpresasUsuario(req.user._id, function(idEmpresasUsuario, error) {
            if (error) {
                sistacLoggerError.error('ERROR AL FILTRAR INFORMES POR USUARIO ' + error);
                return handleError(idEmpresasUsuario, error);
            }
            Informe.find({
                "empresa": {
                    $in: idEmpresasUsuario
                }
            }, function(err, informes) {
                if (err) {
                    sistacLoggerError.error('ERROR AL OBTENER EMPRESAS POR USUARIO' + err);
                    return handleError(res, err);
                }
                return res.json(200, informes.sort(reverseSortByObjectProperty('informeCampoDetails', 'fechaHora')));
            });
        });
    }
};

// Get a single informe
exports.show = function(req, res) {
    Informe.findById(req.params.id, function(err, informe) {

        if (err) {
            sistacLoggerError.error('ERROR AL OBTENER INFORME' + err);
            return handleError(res, err);
        }
        if (!informe) {
            sistacLoggerError.info('NO SE ENCONTRO EL INFORME BUSCADO POR ID: ' + req.params.id);
            return res.send(404);
        }
        if (auth.hasEspecificRole(req.user.role, 'admin')) {
            sistacLoggerInfo.info('Obtiene Informe con perfil Admin');
            return res.json(informe);
        } else {
            //VALIDAR QUE SEA EL USUARIO CON PERMISOS PARA ESTE INFORME
            validateUsuario(req.user._id, informe.codigoEmpresa, function(validUser, error) {
                if (error) {
                    sistacLoggerError.error('ERROR AL VALIDAR AL USUARIO ' + error);
                    return handleError(validUser, error);
                }
                if (!validUser) {
                    sistacLoggerError.info('El usuario ' + req.user.name + ' no tiene permisos para el informe ' + req.params.id);
                    return res.send(401);
                }
                return res.json(informe);
            });
        }
    });
};

// Creates a new informe in the DB.
exports.create = function(req, res) {
    //buscar empresa ṕor nombre y setear id
    //No debería venir nula la empresa pero valido por las dudas
    if (req.body.codigoEmpresa === null) {
        sistacLoggerError.info('A punto de crear un informe con código de empresa nulo');
        req.body.codigoEmpresa = "";
    }
    findEmpresaIdByName(req.body.codigoEmpresa, function(response, error) {
        if (error) {
            sistacLoggerError.error('ERROR AL ENCONTRAR EMPRESA' + error);
            return handleError(response, error);
        }
        req.body.empresa = response;
        var medicionesAlturaVirolas = req.body.medicionesAlturaVirolas;
        var medicionesChapas = req.body.medicionesChapas;
        var espesoresPiso = req.body.espesoresPiso;
        var espesoresTecho = req.body.espesoresTecho;
        var espesoresEnvolvente = req.body.espesoresEnvolvente;
        var espesoresAccesorios = req.body.espesoresAccesorios;
        var espesoresAsentamiento = req.body.espesoresAsentamiento;
        var espesoresCunas = req.body.espesoresCunas;
        var espesoresCabezales = req.body.espesoresCabezales;
        var observacionesMFL = req.body.observacionesMFL;
        Informe.create(req.body, function(err, informe) {
            if (err) {
                sistacLoggerError.error('ERROR AL CREAR INFORME' + err);
                return handleError(res, err);
            }
            crearMedicionesAlturaVirolas(informe._id, medicionesAlturaVirolas);
            crearMedicionesChapa(informe._id, medicionesChapas);
            crearEspesoresPiso(informe._id, espesoresPiso);
            crearEspesoresTecho(informe._id, espesoresTecho);
            crearEspesoresEnvolvente(informe._id, espesoresEnvolvente);
            crearEspesoresAccesorios(informe._id, espesoresAccesorios);
            crearEspesoresAsentamiento(informe._id, espesoresAsentamiento);
            crearEspesoresCunas(informe._id, espesoresCunas);
            crearEspesoresCabezales(informe._id, espesoresCabezales);
            crearObservacionesMFL(informe._id, observacionesMFL);
            return res.json(201, informe._id);
        });
    });
};

// Updates an existing informe in the DB. TODO log
exports.update = function(req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    Informe.findById(req.params.id, function(err, informe) {
        if (err) {
            return handleError(res, err);
        }
        if (!informe) {
            return res.send(404);
        }

        if (auth.hasEspecificRole(req.user.role, 'admin')) {
            var informeEdited = req.body;
            //No debería venir nula la empresa pero valido por las dudas
            if (informeEdited.codigoEmpresa === null)
                informeEdited.codigoEmpresa = "";
            findEmpresaIdByName(informeEdited.codigoEmpresa, function(response, error) {
                if (error) {
                    return handleError(response, error);
                }

                informeEdited.empresa = response;
                var updated = _.merge(informe, informeEdited);
                updated.save(function(err) {
                    if (err) {
                        sistacLoggerError.error('ERROR AL ACTUALIZAR EL INFORME  ' + err);
                        return handleError(res, err);
                    }
                    return res.json(200, informe);
                });
            });
        } else {
            //VALIDAR QUE SEA EL USUARIO CON PERMISOS PARA ESTE INFORME
            validateUsuario(req.user._id, informe.codigoEmpresa, function(validUser, error) {
                if (error) {
                    sistacLoggerError.error('ERROR AL VALIDAR AL USUARIO ' + error);
                    return handleError(validUser, error);
                }
                if (!validUser) {
                    sistacLoggerInfo.info('El usuario ' + req.user.name + ' no tiene permisos para el informe ' + req.params.id);
                    return res.send(401);
                }
                var informeEdited = req.body;
                //No debería venir nula la empresa pero valido por las dudas
                if (informeEdited.codigoEmpresa === null)
                    informeEdited.codigoEmpresa = "";
                findEmpresaIdByName(informeEdited.codigoEmpresa, function(response, error) {
                    if (error) {
                        return handleError(response, error);
                    }
                    informeEdited.empresa = response;
                    var updated = _.merge(informe, informeEdited);
                    updated.save(function(err) {
                        if (err) {
                            return handleError(res, err);
                        }
                        return res.json(200, informe);
                    });
                });
            });
        }
    });
};

// Deletes a informe from the DB. TODO log
exports.destroy = function(req, res) {
    Informe.findById(req.params.id, function(err, informe) {
        if (err) {
            return handleError(res, err);
        }
        if (!informe) {
            return res.send(404);
        }
        //Borro imagenes
        req.params.idTanque = informe.informeCampoDetails.idTanque;
        FotoController.deleteByInformeId(req, res);
        borrarMedicionesAlturaVirolas(informe._id);
        borrarMedicionesChapa(informe._id);
        borrarEspesoresTecho(informe._id);
        borrarEspesoresPiso(informe._id);
        borrarEspesoresEnvolvente(informe._id);
        borrarEspesoresAccesorios(informe._id);
        borrarEspesoresAsentamiento(informe._id);
        borrarEspesoresCunas(informe._id);
        borrarEspesoresCabezales(informe._id);
        borrarObservacionesMFL(informe._id);
        borrarCalculosEspesores(informe._id);
        borrarCalculosEnvolvente(informe._id);
        /* BAJA LOGICA, habilitar cuando no haya más informes dummy
         var updated = _.merge(informe, {active:false});
         updated.save(function (err) {
         if (err) { return handleError(res, err); }
         return res.json(200, informe);
         });*/
        informe.remove(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.send(204);
        });
    });
};

function validateUsuario(userId, empresaName, callback) {
    findEmpresaIdByName(empresaName, function(empresa, error) {
        if (error) {
            sistacLoggerError.error('ERROR AL OBTENER EMPRESA POR CODIGO' + error);
            return callback(false);
        }
        UsuarioEmpresaModel.findOne({
            usuario: userId,
            empresa: empresa
        }, function(err, usuarioEmpresa) {
            if (err) {
                sistacLoggerError.error('ERROR AL BUSCAR RELACION ENTRE USUARIO Y EMPRESA' + err);
                return callback(null);
            }
            if (!usuarioEmpresa) {
                sistacLoggerError.info('Relación entre usuario ' + userId + ' y empresa ' + empresaName + ' no encontrada');
                return callback(null);
            }
            return callback(usuarioEmpresa);
        });
    });
}

function findEmpresaIdByName(name, callback) {
    var nombre = name.toUpperCase();
    Empresa.findOne({
        nombre: nombre
    }, function(err, empresa) {
        if (err) {
            sistacLoggerError.error('ERROR AL BUSCAR LA EMPRESA POR NOMBRE' + err);
            return callback(null);
        }
        if (!empresa) {
            sistacLoggerError.info('Empresa ' + name + ' no encontrada');
            return callback(null);
        }
        return callback(empresa._id);
    });
}

function findEmpresasUsuario(userId, callback) {
    //Obtengo lista de empresas en la que está el usuario logueado
    UsuarioEmpresaModel.find({
        usuario: userId
    }, {
        empresa: 1,
        _id: 0
    }, function(err, empresasUsuario) {
        if (err) {
            sistacLoggerError.error('ERROR RECUPERANDO LAS EMPRESAS DEL USUARIO' + err);
            return callback(null);
        }
        if (!empresasUsuario) {
            sistacLoggerError.info('EMPRESAS NO ENCONTRADAS PARA EL USUARIO ' + userId);
            return callback(null);
        }
        var idEmpresasUsuario = [];
        for (var index = 0; index < empresasUsuario.length; ++index) {
            idEmpresasUsuario.push(empresasUsuario[index].empresa);
        }
        return callback(idEmpresasUsuario);
    });
}

function handleError(res, err) {
    sistacLoggerError.error('Manejando error en informes controller' + err);
    return res.send(500, err);
}

//Colecciones
var MedicionesAlturaVirolas = require('./medicionesalturavirolas.model');
var MedicionesChapa = require('./medicioneschapa.model');
var EspesoresPiso = require('./espesoresPiso.model');
var EspesoresTecho = require('./espesoresTecho.model');
var EspesoresEnvolvente = require('./espesoresEnvolvente.model');
var EspesoresAccesorios = require('./espesoresAccesorios.model');
var EspesoresAsentamiento = require('./espesoresAsentamiento.model');
var EspesoresCunas = require('./espesoresCunas.model');
var EspesoresCabezales = require('./espesoresCabezales.model');
var ObservacionesMFL = require('./observacionesMFL.model');
var CalculosEspesores = require('./calculosEspesores.model');
var CalculosEnvolvente = require('./calculosEnvolvente.model');

//Medicion Altura Virolas
exports.getMedicionesAlturaVirolas = function(req, res) {
    MedicionesAlturaVirolas.find({
        'informe': req.params.informeId
    }, function(err, mediciones) {
        if (err) {
            sistacLoggerError.error('Error al buscar las mediciones en la altura de las virolas ' + req.params.informeId);
        }
        return res.json(200, mediciones.sort(sortByProperty('numeroVirola')));
    });
};

function crearMedicionesAlturaVirolas(informeId, mediciones) {
    //Por cada medicion del array agregamos un registro de Medición Altura Virolas
    for (var indexMedicion = 0; indexMedicion < mediciones.length; ++indexMedicion) {
        MedicionesAlturaVirolas.create({
            informe: informeId,
            numeroVirola: mediciones[indexMedicion].numeroVirola,
            alto: mediciones[indexMedicion].alto
        });
    }
}

function borrarMedicionesAlturaVirolas(informeId) {
    sistacLoggerInfo.info('Elimina Mediciones Altura Virolas de ' + informeId);
    MedicionesAlturaVirolas.find({
        'informe': informeId
    }, function(err, mediciones) {
        if (err) {
            sistacLoggerError.error('Error al buscar Mediciones Altura Virolas de informe ' + informeId + ' ' + err);
        }
        if (!mediciones) {
            sistacLoggerError.error('El informe no tiene Mediciones Altura Virolas');
        }
        for (var index = 0; index < mediciones.length; ++index) {
            mediciones[index].remove(function(err) {
                if (err) {
                    sistacLoggerError.error('Error al eliminar Medición Altura Virola ' + err);
                }
            });
        }
    });
}

//Mediciones Chapa
exports.getMedicionesChapa = function(req, res) {
    MedicionesChapa.find({
        'informe': req.params.informeId
    }, function(err, mediciones) {
        if (err) {
            sistacLoggerError.error('Error al buscar las mediciones del informe ' + req.params.informeId);
        }
        return res.json(200, mediciones);
    });
};

function crearMedicionesChapa(informeId, mediciones) {
    //Por cada medicion del array agregamos un registro de Medición Chapa
    for (var indexMedicion = 0; indexMedicion < mediciones.length; ++indexMedicion) {
        MedicionesChapa.create({
            informe: informeId,
            numeroChapa: mediciones[indexMedicion].numeroChapa,
            numeroVirola: mediciones[indexMedicion].numerovirola,
            largo: mediciones[indexMedicion].largo,
            ancho: mediciones[indexMedicion].ancho
        });
    }
}

function borrarMedicionesChapa(informeId) {
    sistacLoggerInfo.info('Elimina Mediciones Chapa de ' + informeId);
    MedicionesChapa.find({
        'informe': informeId
    }, function(err, mediciones) {
        if (err) {
            sistacLoggerError.error('Error al buscar Mediciones Chapa de informe ' + informeId + ' ' + err);
        }
        if (!mediciones) {
            sistacLoggerError.error('El informe no tiene Mediciones Chapa');
        }
        for (var index = 0; index < mediciones.length; ++index) {
            mediciones[index].remove(function(err) {
                if (err) {
                    sistacLoggerError.error('Error al eliminar Medición Altura Virola ' + err);
                }
            });
        }
    });
}

//Espesores Piso
exports.getEspesoresPiso = function(req, res) {
    EspesoresPiso.find({
        'informe': req.params.informeId
    }, function(err, espesoresPiso) {
        if (err) {
            sistacLoggerError.error('Error al buscar los espesores de Piso del informe ' + req.params.informeId);
        }
        return res.json(200, espesoresPiso.sort(sortByProperty('chapa')));
    });
};

exports.updateEspesoresPiso = function(req, res) {
    EspesoresPiso.findById(req.body._id, function(err, espesorPiso) {
        if (err) {
            return handleError(res, err);
        }
        if (!espesorPiso) {
            return res.send(404);
        }
        var updated = _.merge(espesorPiso, req.body);
        updated.save(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, espesorPiso);
        });
    });
};

function crearEspesoresPiso(informeId, espesores) {
    for (var index = 0; index < espesores.length; ++index) {
        EspesoresPiso.create({
            informe: informeId,
            chapa: espesores[index].chapa,
            medicion1: espesores[index].medicion1,
            medicion2: espesores[index].medicion2,
            medicion3: espesores[index].medicion3,
            medicion4: espesores[index].medicion4,
            medicion5: espesores[index].medicion5,
            medicion6: espesores[index].medicion6
        });
    }
}

function borrarEspesoresPiso(informeId) {
    sistacLoggerInfo.info('Elimina Espesores Piso de ' + informeId);
    EspesoresPiso.find({
        'informe': informeId
    }, function(err, espesores) {
        if (err) {
            sistacLoggerError.error('Error al buscar Espesores Piso de informe ' + informeId + ' ' + err);
        }
        if (!espesores) {
            sistacLoggerError.error('El informe no tiene espesores piso');
        }
        for (var index = 0; index < espesores.length; ++index) {
            espesores[index].remove(function(err) {
                if (err) {
                    sistacLoggerError.error('Error al eliminar Espesor Piso ' + err);
                }
            });
        }
    });
}

//Espesores Techo
exports.getEspesoresTecho = function(req, res) {
    EspesoresTecho.find({
        'informe': req.params.informeId
    }, function(err, espesoresTecho) {
        if (err) {
            sistacLoggerError.error('Error al buscar los espesores de Techo del informe ' + req.params.informeId);
        }
        return res.json(200, espesoresTecho.sort(sortByProperty('chapa')));
    });
};

exports.updateEspesoresTecho = function(req, res) {
    EspesoresTecho.findById(req.body._id, function(err, espesorTecho) {
        if (err) {
            return handleError(res, err);
        }
        if (!espesorTecho) {
            return res.send(404);
        }
        var updated = _.merge(espesorTecho, req.body);
        updated.save(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, espesorTecho);
        });
    });
};

function crearEspesoresTecho(informeId, espesores) {
    for (var index = 0; index < espesores.length; ++index) {
        EspesoresTecho.create({
            informe: informeId,
            chapa: espesores[index].chapa,
            medicion1: espesores[index].medicion1,
            medicion2: espesores[index].medicion2,
            medicion3: espesores[index].medicion3,
            medicion4: espesores[index].medicion4,
            medicion5: espesores[index].medicion5,
            medicion6: espesores[index].medicion6
        });
    }
}

function borrarEspesoresTecho(informeId) {
    sistacLoggerInfo.info('Elimina Espesores Techo de ' + informeId);
    EspesoresTecho.find({
        'informe': informeId
    }, function(err, espesores) {
        if (err) {
            sistacLoggerError.error('Error al buscar Espesores Techo de informe ' + informeId + ' ' + err);
        }
        if (!espesores) {
            sistacLoggerError.error('El informe no tiene espesores Techo');
        }
        for (var index = 0; index < espesores.length; ++index) {
            espesores[index].remove(function(err) {
                if (err) {
                    sistacLoggerError.error('Error al eliminar Espesor Techo ' + err);
                }
            });
        }
    });
}

//Espesores Envolvente
exports.getEspesoresEnvolvente = function(req, res) {
    EspesoresEnvolvente.find({
        'informe': req.params.informeId
    }, function(err, espesoresEnvolvente) {
        if (err) {
            sistacLoggerError.error('Error al buscar los espesores de Envolvente del informe ' + req.params.informeId);
        }
        return res.json(200, espesoresEnvolvente.sort(sortByProperty('virola')));
        //TODO ordenar por generatriz dentro de cada virola
    });
};

exports.updateEspesoresEnvolvente = function(req, res) {
    EspesoresEnvolvente.findById(req.body._id, function(err, espesorEnvolvente) {
        if (err) {
            return handleError(res, err);
        }
        if (!espesorEnvolvente) {
            return res.send(404);
        }
        var updated = _.merge(espesorEnvolvente, req.body);
        updated.save(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, espesorEnvolvente);
        });
    });
};

function crearEspesoresEnvolvente(informeId, espesores) {
    for (var index = 0; index < espesores.length; ++index) {
        EspesoresEnvolvente.create({
            informe: informeId,
            virola: espesores[index].virola,
            generatriz: espesores[index].generatriz,
            medicion1: espesores[index].medicion1,
            medicion2: espesores[index].medicion2,
            medicion3: espesores[index].medicion3,
            medicion4: espesores[index].medicion4,
            medicion5: espesores[index].medicion5,
            medicion6: espesores[index].medicion6
        });
    }
}

function borrarEspesoresEnvolvente(informeId) {
    sistacLoggerInfo.info('Elimina Espesores Envolvente de ' + informeId);
    EspesoresEnvolvente.find({
        'informe': informeId
    }, function(err, espesores) {
        if (err) {
            sistacLoggerError.error('Error al buscar Espesores Envolvente de informe ' + informeId + ' ' + err);
        }
        if (!espesores) {
            sistacLoggerError.error('El informe no tiene espesores Envolvente');
        }
        for (var index = 0; index < espesores.length; ++index) {
            espesores[index].remove(function(err) {
                if (err) {
                    sistacLoggerError.error('Error al eliminar Espesor Envolvente ' + err);
                }
            });
        }
    });
}

//Espesores Accesorios
exports.getEspesoresAccesorios = function(req, res) {
    EspesoresAccesorios.find({
        'informe': req.params.informeId
    }, function(err, espesoresAccesorios) {
        if (err) {
            sistacLoggerError.error('Error al buscar los espesores de Accesorios del informe ' + req.params.informeId);
        }
        return res.json(200, espesoresAccesorios);
    });
};

exports.updateEspesoresAccesorios = function(req, res) {
    EspesoresAccesorios.findById(req.body._id, function(err, espesorAccesorios) {
        if (err) {
            return handleError(res, err);
        }
        if (!espesorAccesorios) {
            return res.send(404);
        }
        var updated = _.merge(espesorAccesorios, req.body);
        updated.save(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, espesorAccesorios);
        });
    });
};

function crearEspesoresAccesorios(informeId, espesores) {
    for (var index = 0; index < espesores.length; ++index) {
        EspesoresAccesorios.create({
            informe: informeId,
            accesorio: espesores[index].accesorio,
            diametro: espesores[index].diametro,
            medicion0: espesores[index].medicion0,
            medicion90: espesores[index].medicion90,
            medicion180: espesores[index].medicion180,
            medicion270: espesores[index].medicion270
        });
    }
}

function borrarEspesoresAccesorios(informeId) {
    sistacLoggerInfo.info('Elimina Espesores Accesorios de ' + informeId);
    EspesoresAccesorios.find({
        'informe': informeId
    }, function(err, espesores) {
        if (err) {
            sistacLoggerError.error('Error al buscar Espesores Accesorios de informe ' + informeId + ' ' + err);
        }
        if (!espesores) {
            sistacLoggerError.error('El informe no tiene espesores Accesorios');
        }
        for (var index = 0; index < espesores.length; ++index) {
            espesores[index].remove(function(err) {
                if (err) {
                    sistacLoggerError.error('Error al eliminar Espesor Accesorios ' + err);
                }
            });
        }
    });
}

//Espesores Asentamiento
exports.getEspesoresAsentamiento = function(req, res) {
    EspesoresAsentamiento.find({
        'informe': req.params.informeId
    }, function(err, espesoresAsentamiento) {
        if (err) {
            sistacLoggerError.error('Error al buscar los espesores de Asentamiento del informe ' + req.params.informeId);
        }
        return res.json(200, espesoresAsentamiento.sort(sortByProperty('estacion')));
    }); //.sort({estacion:1});
};

function sortByProperty(property) {
    return function(a, b) {
        var sortStatus = 0;
        if (a[property] < b[property]) {
            sortStatus = -1;
        } else if (a[property] > b[property]) {
            sortStatus = 1;
        }
        return sortStatus;
    };
}

function reverseSortByObjectProperty(object, property) {
    return function(a, b) {
        var sortStatus = 0;
        if (a[object][property] > b[object][property]) {
            sortStatus = -1;
        } else if (a[object][property] < b[object][property]) {
            sortStatus = 1;
        }
        return sortStatus;
    };
}

exports.updateEspesoresAsentamiento = function(req, res) {
    EspesoresAsentamiento.findById(req.body._id, function(err, espesorAsentamiento) {
        if (err) {
            return handleError(res, err);
        }
        if (!espesorAsentamiento) {
            return res.send(404);
        }
        var updated = _.merge(espesorAsentamiento, req.body);
        updated.save(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, espesorAsentamiento);
        });
    });
};

function crearEspesoresAsentamiento(informeId, espesores) {
    for (var index = 0; index < espesores.length; ++index) {
        EspesoresAsentamiento.create({
            informe: informeId,
            estacion: espesores[index].estacion,
            medicion: espesores[index].medicion,
            observaciones: espesores[index].observaciones
        });
    }
}

function borrarEspesoresAsentamiento(informeId) {
    sistacLoggerInfo.info('Elimina Espesores Asentamiento de ' + informeId);
    EspesoresAsentamiento.find({
        'informe': informeId
    }, function(err, espesores) {
        if (err) {
            sistacLoggerError.error('Error al buscar Espesores Asentamiento de informe ' + informeId + ' ' + err);
        }
        if (!espesores) {
            sistacLoggerError.error('El informe no tiene espesores Asentamiento');
        }
        for (var index = 0; index < espesores.length; ++index) {
            espesores[index].remove(function(err) {
                if (err) {
                    sistacLoggerError.error('Error al eliminar Espesor Asentamiento ' + err);
                }
            });
        }
    });
}

//Espesores Cunas
exports.getEspesoresCunas = function(req, res) {
    EspesoresCunas.find({
        'informe': req.params.informeId
    }, function(err, espesoresCunas) {
        if (err) {
            sistacLoggerError.error('Error al buscar los espesores de Cunas del informe ' + req.params.informeId);
        }
        return res.json(200, espesoresCunas.sort(sortByProperty('cuna')));
    });
};

exports.updateEspesoresCunas = function(req, res) {
    EspesoresCunas.findById(req.body._id, function(err, espesorCunas) {
        if (err) {
            return handleError(res, err);
        }
        if (!espesorCunas) {
            return res.send(404);
        }
        var updated = _.merge(espesorCunas, req.body);
        updated.save(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, espesorCunas);
        });
    });
};

function crearEspesoresCunas(informeId, espesores) {
    for (var index = 0; index < espesores.length; ++index) {
        EspesoresCunas.create({
            informe: informeId,
            cuna: espesores[index].cuna,
            punto: espesores[index].punto,
            medicion1: espesores[index].medicion1,
            medicion2: espesores[index].medicion2,
            medicion3: espesores[index].medicion3,
            medicion4: espesores[index].medicion4,
            medicion5: espesores[index].medicion5,
            medicion6: espesores[index].medicion6,
            medicion7: espesores[index].medicion7,
            medicion8: espesores[index].medicion8,
            medicion9: espesores[index].medicion9,
            medicion10: espesores[index].medicion10,
            medicion11: espesores[index].medicion11,
            medicion12: espesores[index].medicion12,
            medicion13: espesores[index].medicion13,
            medicion14: espesores[index].medicion14,
            medicion15: espesores[index].medicion15,
            medicion16: espesores[index].medicion16,
            medicion17: espesores[index].medicion17,
            medicion18: espesores[index].medicion18,
            medicion19: espesores[index].medicion19,
            medicion20: espesores[index].medicion20,
            medicion21: espesores[index].medicion21,
            medicion22: espesores[index].medicion22,
            medicion23: espesores[index].medicion23,
            medicion24: espesores[index].medicion24,
            medicion25: espesores[index].medicion25,
            medicion26: espesores[index].medicion26,
            medicion27: espesores[index].medicion27,
            medicion28: espesores[index].medicion28,
            medicion29: espesores[index].medicion29,
            medicion30: espesores[index].medicion30,
            medicion31: espesores[index].medicion31,
            medicion32: espesores[index].medicion32
        });
    }
}

function borrarEspesoresCunas(informeId) {
    sistacLoggerInfo.info('Elimina Espesores Cunas de ' + informeId);
    EspesoresCunas.find({
        'informe': informeId
    }, function(err, espesores) {
        if (err) {
            sistacLoggerError.error('Error al buscar Espesores Cunas de informe ' + informeId + ' ' + err);
        }
        if (!espesores) {
            sistacLoggerError.error('El informe no tiene espesores Cunas');
        }
        for (var index = 0; index < espesores.length; ++index) {
            espesores[index].remove(function(err) {
                if (err) {
                    sistacLoggerError.error('Error al eliminar Espesor Cunas ' + err);
                }
            });
        }
    });
}

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
    if (400 === status || 404 === status) {
        sistacLoggerError.error(content);
    }
};

exports.cabezalesInfoByInformeId = function(req, res) {
    if (!req.params.id) {
        return sendJsonResponse(res, 404, {
            'message': 'informeId not found in request params'
        });
    }

    Informe
        .findById(req.params.id)
        .select('informeCampoDetails.orientacionLadoA informeCampoDetails.orientacionLadoB informeCampoDetails.tipoTanque')
        .exec(
            function(err, informe) {
                console.log(informe);
                if (err) {
                    return sendJsonResponse(res, 400, err);
                } else if (!informe) {
                    return sendJsonResponse(res, 404, {
                        'message': 'informe not found by id: ' + req.params.id
                    });
                } else if (informe.informeCampoDetails.tipoTanque !== 'HORIZONTAL') {
                    return sendJsonResponse(res, 400, {
                        'message': 'El tanque no es horizontal'
                    });
                } else {
                    return sendJsonResponse(res, 200, {
                        'orientacionLadoA': informe.orientacionLadoA,
                        'orientacionLadoB': informe.orientacionLadoB
                    });
                }
            }
        );
};

//Espesores Cabezales
exports.getEspesoresCabezales = function(req, res) {
    EspesoresCabezales.find({
        'informe': req.params.informeId
    }, function(err, espesoresCabezales) {
        if (err) {
            sistacLoggerError.error('Error al buscar los espesores de Cabezales del informe ' + req.params.informeId);
        }
        return res.json(200, espesoresCabezales.sort(sortByProperty('lado')));
    });
};

exports.updateEspesoresCabezales = function(req, res) {
    EspesoresCabezales.findById(req.body._id, function(err, espesorCabezales) {
        if (err) {
            return handleError(res, err);
        }
        if (!espesorCabezales) {
            return res.send(404);
        }
        var updated = _.merge(espesorCabezales, req.body);
        updated.save(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, espesorCabezales);
        });
    });
};

function crearEspesoresCabezales(informeId, espesores) {
    for (var index = 0; index < espesores.length; ++index) {
        EspesoresCabezales.create({
            informe: informeId,
            lado: espesores[index].lado,
            generatriz: espesores[index].generatriz,
            medicion1: espesores[index].medicion1,
            medicion2: espesores[index].medicion2,
            medicion3: espesores[index].medicion3,
            medicion4: espesores[index].medicion4,
            medicion5: espesores[index].medicion5,
            medicion6: espesores[index].medicion6
        });
    }
}

function borrarEspesoresCabezales(informeId) {
    sistacLoggerInfo.info('Elimina Espesores Cabezales de ' + informeId);
    EspesoresCabezales.find({
        'informe': informeId
    }, function(err, espesores) {
        if (err) {
            sistacLoggerError.error('Error al buscar Espesores Cabezales de informe ' + informeId + ' ' + err);
        }
        if (!espesores) {
            sistacLoggerError.error('El informe no tiene espesores Cabezales');
        }
        for (var index = 0; index < espesores.length; ++index) {
            espesores[index].remove(function(err) {
                if (err) {
                    sistacLoggerError.error('Error al eliminar Espesor Cabezales ' + err);
                }
            });
        }
    });
}

//Observaciones MFL
exports.getObservacionesMFL = function(req, res) {
    ObservacionesMFL.find({
        'informe': req.params.informeId
    }, function(err, observacionesMFL) {
        if (err) {
            sistacLoggerError.error('Error al buscar las Observaciones MFL del informe ' + req.params.informeId);
        }
        return res.json(200, observacionesMFL);
    });
};

exports.updateObservacionesMFL = function(req, res) {
    ObservacionesMFL.findById(req.body._id, function(err, observacionMFL) {
        if (err) {
            return handleError(res, err);
        }
        if (!observacionMFL) {
            return res.send(404);
        }
        var updated = _.merge(observacionMFL, req.body);
        updated.save(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, observacionMFL);
        });
    });
};

function crearObservacionesMFL(informeId, observacion) {
    for (var index = 0; index < observacion.length; ++index) {
        ObservacionesMFL.create({
            informe: informeId,
            pasada: observacion[index].pasada,
            chapa: observacion[index].chapa,
            acceso: observacion[index].acceso,
            amolado: observacion[index].amolado,
            corrosion: observacion[index].corrosion,
            deformacion: observacion[index].deformacion,
            perforacion: observacion[index].perforacion,
            otra: observacion[index].otra,
            puntosoldadura: observacion[index].puntosoldadura,
            observaciones: observacion[index].observaciones
        });
    }
}

function borrarObservacionesMFL(informeId) {
    sistacLoggerInfo.info('Elimina Observaciones MFL de ' + informeId);
    ObservacionesMFL.find({
        'informe': informeId
    }, function(err, observacion) {
        if (err) {
            sistacLoggerError.error('Error al buscar Observaciones MFL de informe ' + informeId + ' ' + err);
        }
        if (!observacion) {
            sistacLoggerError.error('El informe no tiene observacion MFL');
        }
        for (var index = 0; index < observacion.length; ++index) {
            observacion[index].remove(function(err) {
                if (err) {
                    sistacLoggerError.error('Error al eliminar Observaciones MFL ' + err);
                }
            });
        }
    });
}

//Cálculos de Espesores
exports.getCalculosEspesores = function(req, res) {
    CalculosEspesores.find({
        'informe': req.params.informeId
    }, function(err, calculosEspesores) {
        if (err) {
            sistacLoggerError.error('Error al buscar los cálculos de espesores Envolvente del informe ' + req.params.informeId);
        }
        return res.json(200, calculosEspesores.sort(sortByProperty('unidad')));
    });
};

exports.crearCalculoEspesor = function(req, res) {
    var calculoEspesor = req.body.calculoEspesor;
    var informeId = req.body.informeId;
    CalculosEspesores.create({
        informe: informeId,
        unidad: calculoEspesor.unidad,
        h: calculoEspesor.h,
        d: calculoEspesor.d,
        g: calculoEspesor.g,
        s: calculoEspesor.s,
        e: calculoEspesor.e,
        tmin: calculoEspesor.tmin,
        tc: calculoEspesor.tc,
        tmedido: calculoEspesor.tmedido,
        tasa: calculoEspesor.tasa,
        vida: calculoEspesor.vida,
        alturaSegura: calculoEspesor.alturaSegura
    }, function(err, calculo) {
        if (err) {
            sistacLoggerError.error('Error al guardar cálculo de espesor envolvente ' + err);
            return handleError(res, err);
        }
        return res.json(201, calculo);
    });
};

exports.updateCalculosEspesores = function(req, res) {
    CalculosEspesores.findById(req.body._id, function(err, calculoEspesor) {
        if (err) {
            sistacLoggerError.error('Error al guardar cálculo de espesor envolvente ' + err);
            return handleError(res, err);
        }
        if (!calculoEspesor) {
            sistacLoggerError.error('Cálculo de espesor envolvente a guardar inexistente ' + err);
            return res.send(404);
        }
        var updated = _.merge(calculoEspesor, req.body);
        updated.save(function(err) {
            if (err) {
                sistacLoggerError.error('Error al guardar cálculo de espesor envolvente ' + err);
                return handleError(res, err);
            }
            return res.json(200, calculoEspesor);
        });
    });
};

function borrarCalculosEspesores(informeId) {
    sistacLoggerInfo.info('Elimina Calculo de Espesores Envolvente de ' + informeId);
    CalculosEspesores.find({
        'informe': informeId
    }, function(err, espesores) {
        if (err) {
            sistacLoggerError.error('Error al buscar Cálculo de Espesor Envolvente de informe ' + informeId + ' ' + err);
        }
        if (!espesores) {
            sistacLoggerError.error('El informe no tiene cálculos de espesores Envolvente');
        } else {
            for (var index = 0; index < espesores.length; ++index) {
                espesores[index].remove(function(err) {
                    if (err) {
                        sistacLoggerError.error('Error al eliminar cálculo de espesor Envolvente ' + err);
                    }
                });
            }
        }
    });
}

//Cálculos de Envolvente Horizontal
exports.crearCalculoEnvolvente = function(req, res) {
    var calculoEspesor = req.body.calculoEspesor;
    var informeId = req.body.informeId;
    CalculosEnvolvente.create({
        informe: informeId,
        alturaSegura: calculoEspesor.alturaSegura,
        promedioZC: calculoEspesor.promedioZC,
        minimoZC: calculoEspesor.minimoZC,
        maximoZC: calculoEspesor.maximoZC,
        nominalZC: calculoEspesor.nominalZC,
        perdidaZC: calculoEspesor.perdidaZC,
        corrosionZC: calculoEspesor.corrosionZC,
        vidaZC: calculoEspesor.vidaZC,
        promedioEn: calculoEspesor.promedioEn,
        minimoEn: calculoEspesor.minimoEn,
        maximoEn: calculoEspesor.maximoEn,
        nominalEn: calculoEspesor.nominalEn,
        perdidaEn: calculoEspesor.perdidaEn,
        corrosionEn: calculoEspesor.corrosionEn,
        vidaEn: calculoEspesor.vidaEn,
        promedioCa: calculoEspesor.promedioCa,
        minimoCa: calculoEspesor.minimoCa,
        maximoCa: calculoEspesor.maximoCa,
        nominalCa: calculoEspesor.nominalCa,
        perdidaCa: calculoEspesor.perdidaCa,
        corrosionCa: calculoEspesor.corrosionCa,
        vidaCa: calculoEspesor.vidaCa
    }, function(err, calculo) {
        if (err) {
            sistacLoggerError.error('Error al guardar cálculo de espesor envolvente horizontal ' + err);
            return handleError(res, err);
        }
        return res.json(201, calculo);
    });
};

exports.getCalculosEnvolvente = function(req, res) {
    CalculosEnvolvente.findOne({
        informe: req.params.informeId
    }, function(err, calculosEnvolvente) {
        if (err) {
            sistacLoggerError.error('Error al buscar los cálculos de espesores Envolvente del informe horizontal ' + req.params.informeId);
        }
        if (!calculosEnvolvente) {
            return res.send(300, 'Cálculos no encontrados');
        }
        return res.json(200, calculosEnvolvente);
    });
};

exports.updateCalculosEnvolvente = function(req, res) {
    CalculosEnvolvente.findById(req.body._id, function(err, calculoEspesor) {
        if (err) {
            sistacLoggerError.error('Error al guardar cálculo de envolvente horizontal ' + err);
            return handleError(res, err);
        }
        if (!calculoEspesor) {
            sistacLoggerError.error('Cálculo de espesor envolvente horizontal a guardar inexistente ' + err);
            return res.send(404);
        }
        var updated = _.merge(calculoEspesor, req.body);
        updated.save(function(err) {
            if (err) {
                sistacLoggerError.error('Error al guardar cálculo de espesor envolvente horizontal ' + err);
                return handleError(res, err);
            }
            return res.json(200, calculoEspesor);
        });
    });
};

function borrarCalculosEnvolvente(informeId) {
    sistacLoggerInfo.info('Elimina Calculos de Envolvente de ' + informeId);
    CalculosEnvolvente.findOne({
        'informe': informeId
    }, function(err, calculoEnvolvente) {
        if (err) {
            sistacLoggerError.error('Error al buscar Cálculo de Espesor Envolvente horizontal de informe ' + informeId + ' ' + err);
        }
        if (!calculoEnvolvente) {
            sistacLoggerInfo.info('El informe no tiene cálculos de espesores Envolvente horizontal ');
        } else {
            calculoEnvolvente.remove(function(err) {
                if (err) {
                    sistacLoggerError.error('Error al eliminar cálculo de espesor Envolvente horizontal ' + err);
                }
            });
        }
    });
}
}());
