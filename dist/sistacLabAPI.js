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

exports.findByCit = function(req, res) {
    if (_.isUndefined(req.query) || _.isUndefined(req.query.cit)) {
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
        .findByCit(req.query.cit)
				.then(
            function(a1s) {
								console.log('resolving promise: ' + a1s);
                return sendJsonResponse(res, 200, a1s);
            }
        );
};

exports.findAll = function(req, res) {
    A1
        .find()
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

exports.getByNumeroTramite = function(req, res) {
    if (!req.params || !req.params.id) {
        return sendJsonResponse(res, 404, {
            'message': 'id not found in request params'
        });
    }
    A1
        .findOne({
            numeroTramite: req.params.id
        })
        .select('-sequence -__v')
        .exec(function(err, a1) {
            if (err) {
                return sendJsonResponse(res, 400, err);
            } else if (!a1) {
                return sendJsonResponse(res, 404, {
                    'message': 'A1 not found by numeroTramite: ' + req.params.id
                });
            } else {
                return sendJsonResponse(res, 200, a1);
            }
        });
};

exports.create = function(req, res) {
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
    }, function(err, a1) {
        return err ? sendJsonResponse(res, 400, err) : sendJsonResponse(res, 201, a1);
    });
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

exports.delete = function(req, res) {
    var id = req.params.id;
    if (!id) {
        return sendJsonResponse(res, 404, {
            'message': 'A1 not found by numeroTramite: ' + id
        });
    }

    A1
        .findOneAndRemove({
            numeroTramite: id
        })
        .exec(
            function(err) {
                return err ? sendJsonResponse(res, 404, err) : sendJsonResponse(res, 204, null);
            }
        );
};
}());
;(function() {

'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var A1Schema = new Schema({
    numeroTramite: {
        type: Number,
        required: true,
        unique: true,
        max: 9999999
    },
    cit: {
        type: Number,
        max: 9999999,
        unique: true
    },
    elevado: {
        type: Boolean,
        default: false
    },
    tieneInspeccionesAnteriores: {
        type: Boolean,
        default: false
    },
    nombreInstalacion: {
        type: String,
        default: ''
    },
    normaFabricacion: String,
    fabricante: {
        type: String,
        default: ''
    },
    matricula: {
        type: String,
        default: ''
    },
    estado: {
        type: String,
        default: ''
    },
    observaciones: {
        type: String,
        default: ''
    },
    numeroInterno: {
        type: String,
        default: ''
    },
    laminasInspeccionadas: {
        type: Number,
        default: 0,
        min: 0,
        max: 500
    },
    anioFabricacion: {
        type: Number,
        min: 1800,
        max: 4000,
        default: 1800
    },
    anioInstalacion: {
        type: Number,
        min: 1800,
        max: 4000,
        default: 1800
    },
    placaIdentificacion: {
        type: String,
        default: ''
    },
    temperaturaOperacion: {
        type: String,
        default: 'Ambiente'
    },
    especificacionChapas: {
        type: String,
        default: ''
    }
});

A1Schema.static('findByCit', function(cit) {
	return this
		.find({ cit: cit })
		.select('-sequence -__v')
		.exec();
});

/*A1Schema.plugin(autoIncrement.plugin, {
    model: 'A1',
    field: 'sequence',
    startAt: 1
});
*/
module.exports = mongoose.model('A1', A1Schema);
}());
;(function() {
'use strict';

var express = require('express');
var controller = require('./a1.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', function(req, res, next) {
	if (req.query.cit) {
		controller.findByCit(req, res);
	} else {
		controller.findAll(req, res);
	}
});
router.get('/:id', auth.hasRole('admin'), controller.getByNumeroTramite);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.delete);

module.exports = router;
}());
;(function() {
'use strict';

/* jshint loopfunc: true */

var _ = require('lodash');
var Contrato = require('./contrato.model');
var ContratoInformeModel = require('../contratoinforme/contratoinforme.model');
var ContratoInformeHistoricoModel = require('../contratoinformehistorico/contratoinformehistorico.model');
var InformeModel = require('../informe/informe.model');
var winston = require('winston');
var sistacLoggerError = winston.loggers.get('sistac-error');
var sistacLoggerInfo = winston.loggers.get('sistac-info');
var PDFDocument = require('pdfkit');

// Get list of contratos
exports.index = function(req, res) {
  Contrato.find(function (err, contratos) {
    if(err) { return handleError(res, err); }
    return res.json(200, contratos.sort(sortByProperty('contrato')));
  });

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

// Get a single contrato
exports.show = function(req, res) {
  Contrato.findById(req.params.id, function (err, contrato) {
    if(err) {
      sistacLoggerError.error('ERROR AL BUSCAR CONTRATO ' + req.params.id + ' - ' + err);
      return handleError(res, err);
    }
    if(!contrato) { return res.send(404); }
    //Agrego los informes relacionados

    //return res.json(contrato);
    ContratoInformeModel.find({
      contrato: contrato._id
    }, {
      contrato: 0,
      __v: 0
    }, function(err, informes) {
      if (err) {
        sistacLoggerError.error('ERROR AL BUSCAR TANQUES DE CONTRATO ' + req.params.id + ' - ' + err);
      }
      if (!informes) {}
      contrato.informes = informes;

      if (informes.length > 0) {
        //Obtiene el último certificado
        //console.log('LLEGA '+contrato._id);
        ContratoInformeHistoricoModel.find({
          contrato: contrato._id
        }, {
          contrato: 0,
          __v: 0
        }, function(err, informesHistoricos) {
          if (err) {
            //console.log('ERR1 '+err);
            sistacLoggerError.error('ERROR AL BUSCAR CERTIFICADO - Contrato: ' + contrato._id + err);
          }
          if (!informesHistoricos) {
            //console.log('ERR2 ');
          }
          //console.log('OBTIENE HISTORICOS '+informesHistoricos+'-');

          contrato.historicos = informesHistoricos; //[];

          return res.json(contrato);

        }).sort({'certificado':1});
      }
      else {
        return res.json(contrato);
      }

    }).populate('informe');
  });
};

// Creates a new contrato in the DB.
exports.create = function(req, res) {
  Contrato.create(req.body, function(err, contrato) {
    if(err) { return handleError(res, err); }
    return res.json(201, contrato);
  });
};

// Updates an existing contrato in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Contrato.findById(req.params.id, function (err, contrato) {
    if (err) { return handleError(res, err); }
    if(!contrato) { return res.send(404); }
    var updated = _.merge(contrato, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, contrato);
    });
  });
};

// Deletes a contrato from the DB.
exports.destroy = function(req, res) {
  Contrato.findById(req.params.id, function (err, contrato) {
    if(err) { return handleError(res, err); }
    if(!contrato) { return res.send(404); }
    contrato.remove(function(err) {
      if(err) { return handleError(res, err); }
      ContratoInformeModel.find({
        contrato: req.params.id
      }, {
        contrato: 0,
        __v: 0
      }, function(err, contratoInformes) {
        if (err) {
          sistacLoggerError.error('ERROR AL BUSCAR TANQUES DE CONTRATO ' + req.params.id + ' - ' + err);
        }
        if (!contratoInformes) {}
        for (var index = 0; index < contratoInformes.length; ++index) {
          InformeModel.findById(contratoInformes[index].informe, function(err2, informe) {
            if (err2) {
              sistacLoggerError.error('Error al actualizar el contrato en el Informe(busqueda) ' + err2);
            }
            if (!informe) {}
            informe.contrato = undefined;
            informe.save(function (err3) {
              if (err3) { sistacLoggerError.error('Error al actualizar el contrato en el Informe ' + err3); }
            });
          });
          contratoInformes[index].remove(function(err) {
            if (err) {
              sistacLoggerError.error('Error al eliminar Contrato/Informe ' + err);
            }
          });
        }
        if (contratoInformes.length > 0) {
          ContratoInformeHistoricoModel.find({
            contrato: req.params.id
          }, {
            contrato: 0,
            __v: 0
          }, function(err, contratoInformesHistoricos) {
            if (err) {
              sistacLoggerError.error('ERROR AL BUSCAR CERTIFICADO - Contrato: ' + req.params.id + err);
            }
            if (!contratoInformesHistoricos) {}

            for (var indexH = 0; indexH < contratoInformesHistoricos.length; ++indexH) {
              contratoInformesHistoricos[indexH].remove(function(err) {
                if (err) {
                  sistacLoggerError.error('Error al eliminar histórico de Contrato/Informe ' + err);
                }
              });
            }
          });
        }
      });
      return res.send(204);
    });
  });
};

exports.getByName = function(req, res) {
  Contrato.findOne({
    contrato: req.params.contrato.toUpperCase()
  }, function(err, contrato) {
    if (err) {
      sistacLoggerError.error('Error al buscar Contrato ' + req.params.contrato);
      return handleError(res, err);
    }
    if (!contrato) {
      return res.send(404);
    }
    return res.json(200, contrato);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

exports.exportData = function(req, res) {
  try {
    Contrato.findById(req.params.id, function (err, contrato) {
      if(err) {
        sistacLoggerError.error('ERROR AL BUSCAR CONTRATO ' + req.params.id + ' - ' + err);
        return handleError(res, err);
      }
      if(!contrato) { return res.send(404); }
      ContratoInformeHistoricoModel.find({
        contrato: contrato._id, certificado: { $lte: req.params.certificado }
      }, {
        __v: 0
      }, function(err, informesHistorico) {
        if (err) {
          sistacLoggerError.error('ERROR AL BUSCAR CERTIFICADO DE CONTRATO ' + req.params.id + ' - ' + err);
        }
        if (!informesHistorico) {}
        //console.log(informesHistorico);
        contrato.historicos = informesHistorico;
        calcularValores(contrato);
        crearReporte(res, contrato, req.params.certificado);
      }).populate('informe').sort({'certificado':1});
    });
  }
  catch(e){
    sistacLoggerError.error('Error al generar reporte de Contrato - '+e);
    res.send(500, {message: 'Error al generar reporte de Contrato ', err: e});
}
};

function calcularValores(contrato){
  //TODO realizar cálculos de certificado
  var informesAuxiliar = [];
  for (var index = 0; index < contrato.historicos.length; ++index) {

     var contratoInforme = contrato.historicos[index];

     contratoInforme.certificadoAnterior = contratoInforme.certificado - 1;

     var indexAux = getIndex(informesAuxiliar, contratoInforme.informe._id);
     if (indexAux == -1){
       contratoInforme.valorAnterior = 0;
       contratoInforme.acumulado = 0;
     }
     else {
       contratoInforme.valorAnterior = informesAuxiliar[indexAux].valorAnterior;
       contratoInforme.acumulado = informesAuxiliar[indexAux].acumulado;
     }

     if (indexAux == -1){
       informesAuxiliar.push({informe:contratoInforme.informe._id, valorAnterior:contratoInforme.valorActual, acumulado:contratoInforme.acumulado+contratoInforme.valorActual});
     }
     else {
       informesAuxiliar[indexAux].valorAnterior = contratoInforme.valorActual;
       informesAuxiliar[indexAux].acumulado = contratoInforme.acumulado+contratoInforme.valorActual;
     }

     contratoInforme.porcentaje = (Number(contratoInforme.valorActual) * 100 / Number(contratoInforme.precioUnitario)).toFixed(2);

     /*if (contratoInforme.fechaProximaInspeccion !== null && contratoInforme.fechaProximaInspeccion !== undefined) {
        contratoInforme.fechaProximaInspeccion = new Date(contratoInforme.fechaProximaInspeccion);
     }
     else {
        contratoInforme.fechaProximaInspeccion = undefined;
     }
     if (contratoInforme.fechaSEN !== null && contratoInforme.fechaSEN !== undefined) {
        contratoInforme.fechaSEN = new Date(contratoInforme.fechaSEN);
     }
     else {
        contratoInforme.fechaSEN = undefined;
     }*/

     //Calculo la capacidad
     var diametroMT = Number(contratoInforme.informe.primeraSeccion.perimetro) / Math.PI;
        contratoInforme.informe.capacidad = (Math.PI * Math.pow((diametroMT / 2),2) * Number(contratoInforme.informe.primeraSeccion.altura)).toFixed(2);
  }
}

function getIndex(list, id){
  for(var index = 0; index < list.length; ++index){
    if (list[index].informe == id){
      return index;
    }
  }
  return -1;
}

function crearReporte(res,contrato, certificadoId){

  //# Create a document
  var doc = new PDFDocument();
  doc.info.Title = 'Certificado';
  doc.info.Author = 'SisTAC';
  var separadorColumnas = '  ';
  var separadorTab = '   ';

  //Título
  doc.font('Times-Bold').fontSize(20).text('Contrato '+contrato.contrato+' - Certificado '+certificadoId, {underline:true,align: 'center'});
  doc.lineWidth(125);
  doc.fontSize(15);
  doc.moveDown(2);

  //Registro O/C
  doc.font('Times-Bold').text('Registro O/C',{underline:true,paragraphGap:3});
  doc.fontSize(12);
  doc.font('Times-Bold').text('O/C Contrato N°: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getText(contrato.contrato));
  doc.font('Times-Bold').text('Fecha inicio: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getFecha(contrato.fechaInicio)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Fecha Fin: ',{continued: true}).font('Times-Roman').text(getFecha(contrato.fechaFin)+' ');
  doc.font('Times-Bold').text('Nombre de Operador/Cliente: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getText(contrato.operador)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('CUIT: ',{continued: true}).font('Times-Roman').text(getText(contrato.cuit)+' ');
  doc.font('Times-Bold').text('Domicilio de facturación: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getText(contrato.domicilio));
  doc.fontSize(13);
  doc.font('Times-Bold').text('Referente Comercial',{underline:true,paragraphGap:3});
  doc.fontSize(12);
  doc.font('Times-Bold').text(separadorTab+'Nombre: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getText(contrato.referenteComercial));
  doc.font('Times-Bold').text(separadorTab+'Teléfono: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getText(contrato.telefonoComercial));
  doc.font('Times-Bold').text(separadorTab+'e-mail: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getText(contrato.emailComercial));
  doc.fontSize(13);
  doc.font('Times-Bold').text('Referente Técnico',{underline:true,paragraphGap:3});
  doc.fontSize(12);
  doc.font('Times-Bold').text(separadorTab+'Nombre: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getText(contrato.referenteTecnico));
  doc.font('Times-Bold').text(separadorTab+'Teléfono: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getText(contrato.telefonoTecnico));
  doc.font('Times-Bold').text(separadorTab+'e-mail: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getText(contrato.emailTecnico));
  doc.font('Times-Bold').text('Observaciones: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getText(contrato.observaciones));

  var informesCertificado = getCertificado(contrato.historicos, certificadoId);
  doc.fontSize(15);
  doc.moveDown(2);
  doc.font('Times-Bold').text('Seguimiento general',{underline:true,paragraphGap:3});
  doc.fontSize(12);
  for (var index = 0; index < informesCertificado.length; ++index) {
    var informeCert = informesCertificado[index];
    doc.font('Times-Bold').text('TAHH - '+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(getText(informeCert.informe.informeCampoDetails.idTanque));
    doc.font('Times-Bold').text(separadorTab+'Capacidad: '+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(getText(informeCert.informe.capacidad)+' mᶾ');
    doc.font('Times-Bold').text(separadorTab+'CIT: '+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(getText(informeCert.informe.informeCampoDetails.cit));
    doc.font('Times-Bold').text(separadorTab+'Tipo de insp.: '+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(getText(getTipoInsp(informeCert.informe.informeCampoDetails.tipoInspeccion)));
    doc.font('Times-Bold').text(separadorTab+'Precio unitario: '+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(getText(informeCert.precioUnitario));
    doc.font('Times-Bold').text(separadorTab+'Certificado anterior: '+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(getText(informeCert.certificadoAnterior));
    doc.font('Times-Bold').text(separadorTab+'% cer.: '+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(getText(informeCert.porcentaje));
    doc.font('Times-Bold').text(separadorTab+'Valor anterior: '+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(getText(informeCert.valorAnterior));
    doc.font('Times-Bold').text(separadorTab+'Valor actual: '+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(getText(informeCert.valorActual));
    doc.font('Times-Bold').text(separadorTab+'Valor acumulado: '+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(getText(informeCert.acumulado));
    doc.font('Times-Bold').text(separadorTab+'Fecha insp.: '+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(getFecha(getText(informeCert.informe.informeCampoDetails.fechaHora)));
    doc.font('Times-Bold').text(separadorTab+'Fecha próxima insp.: '+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(getFecha(informeCert.fechaProximaInspeccion));
    doc.font('Times-Bold').text(separadorTab+'Instalación: '+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(getText(informeCert.instalacion));
    doc.font('Times-Bold').text(separadorTab+'Auditor/es: '+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(getText(informeCert.auditor));
    doc.font('Times-Bold').text(separadorTab+'Fecha SEN: '+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(getFecha(informeCert.fechaSEN));
    doc.font('Times-Bold').text(separadorTab+'Estado: '+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(getText(informeCert.estado));
    doc.font('Times-Bold').text(separadorTab+'Observaciones: '+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(getText(informeCert.observaciones));
    doc.moveDown(1);
  }

  doc.pipe(res);

  //# Finalize PDF file
  doc.end();

}

function getTipoInsp(tipo){
  if (tipo === 'TANQUE_ABIERTO')
    return 'Tanque abierto';
  else if (tipo === 'TANQUE_CERRADO')
    return 'Tanque cerrado/E.A.';
  else
    return text;
}

function getText(text){
  if (text === undefined || text === '' || text === 'NaN')
    return '<sin dato>';
  else
    return text;
}

function getFecha(fecha){
  if (fecha === undefined)
    return '<sin dato>';
  else
    return String(fecha.getDate()) + '/' + String(fecha.getMonth() + 1) + '/' + String(fecha.getFullYear());
}

function getCertificado(historicos, certificadoId){
  var informesCertificado = [];
  for(var index = 0; index < historicos.length; ++index){
    if (historicos[index].certificado == certificadoId){
      informesCertificado.push(historicos[index]);
    }
  }
  return informesCertificado;
}
}());
;(function() {
'use strict';

var autoIncrement = require('mongoose-auto-increment');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ContratoSchema = new Schema({
  contrato: { type: String, index: { unique: true }, uppercase: true},
  fechaInicio: Date,
  fechaFin: Date,
  operador: String,
  cuit: String,
  domicilio: String,
  referenteComercial: String,
  emailComercial: { type: String, lowercase: true },
  telefonoComercial: String,
  referenteTecnico: String,
  emailTecnico: { type: String, lowercase: true },
  telefonoTecnico: String,
  observaciones: String,
  active: {type: Boolean, default: true},
  informes: Array,
  historicos: Array,
  certificados: Array
});

ContratoSchema.plugin(autoIncrement.plugin, {
  model: 'Contrato',
  field: 'sequence',
  startAt: 1
});

module.exports = mongoose.model('Contrato', ContratoSchema);
}());
;(function(){

'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('GET /lab/contratos', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/lab/contratos')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});
}());
;(function() {
'use strict';

var express = require('express');
var controller = require('./contrato.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('comercial'), controller.index);
router.get('/:id', auth.hasRole('comercial'),controller.show);
router.post('/', auth.hasRole('comercial'),controller.create);
router.put('/:id', auth.hasRole('comercial'),controller.update);
router.patch('/:id', auth.hasRole('comercial'),controller.update);
router.delete('/:id', auth.hasRole('comercial'),controller.destroy);
router.get('/contratoByName/:contrato', auth.hasRole('comercial'), controller.getByName);
router.get('/export-data/:id/:certificado', auth.hasRole('comercial'), controller.exportData);

module.exports = router;
}());
;(function() {
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
;(function() {

'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ContratoinformeSchema = new Schema({
  contrato: {type:Schema.Types.ObjectId, ref: 'Contrato'},
  informe: {type:Schema.Types.ObjectId, ref: 'Informe'},
  precioUnitario: Number,
  fechaProximaInspeccion: Date,
  instalacion: String,
  fechaInicio: Date,
  auditor: String,
  estado: String,
  fechaSEN: Date,
  observaciones: String,
  valorAnterior: Number,
  valorActual: Number
});

module.exports = mongoose.model('Contratoinforme', ContratoinformeSchema);
}());
;(function() {
'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('GET /lab/contratoinforme', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/lab/contratoinforme')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});
}());
;(function() {
'use strict';

var express = require('express');
var controller = require('./contratoinforme.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('comercial'), controller.index);
router.get('/:id', auth.hasRole('comercial'), controller.show);
router.post('/', auth.hasRole('comercial'), controller.create);
router.put('/:id', auth.hasRole('comercial'), controller.update);
router.patch('/:id', auth.hasRole('comercial'), controller.update);
router.delete('/:id', auth.hasRole('comercial'), controller.destroy);
router.get('/contratoInforme/:informeId', auth.hasRole('comercial'), controller.getContratoInforme);
router.post('/updateContratoInforme', auth.hasRole('comercial'), controller.updateContratoInforme);

module.exports = router;
}());
;(function() {
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
;(function() {
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ContratoinformehistoricoSchema = new Schema({
  contrato: {type:Schema.Types.ObjectId, ref: 'Contrato'},
  certificado: Number,
  informe: {type:Schema.Types.ObjectId, ref: 'Informe'},
  precioUnitario: Number,
  fechaProximaInspeccion: Date,
  instalacion: String,
  fechaInicio: Date,
  auditor: String,
  estado: String,
  fechaSEN: Date,
  observaciones: String,
  valorAnterior: Number,
  valorActual: Number
});

module.exports = mongoose.model('ContratoinformeHistorico', ContratoinformehistoricoSchema);
}());
;(function() {
'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('GET /lab/contratoinformehistorico', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/lab/contratoinformehistorico')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});
}());
;(function() {

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

;(function() {

'use strict';

var _ = require('lodash');
var request = require('request');
var Informe = require('../informe/informe.model');
var nodemailer = require('nodemailer');
var config = require('../../config/environment');
var directTransport = require('nodemailer-direct-transport');
var transporter = nodemailer.createTransport(directTransport({name:"sistemaglobal.com.ar",debug:false}));
var PDFDocument = require('pdfkit');
var winston = require('winston');
var sistacLoggerError = winston.loggers.get('sistac-error');
var sistacLoggerInfo = winston.loggers.get('sistac-info');
//Colecciones del informe
var MedicionesAlturaVirolas = require('../informe/medicionesalturavirolas.model');
var MedicionesChapa = require('../informe/medicioneschapa.model');
var EspesoresPiso = require('../informe/espesoresPiso.model');
var EspesoresTecho = require('../informe/espesoresTecho.model');
var EspesoresEnvolvente = require('../informe/espesoresEnvolvente.model');
var EspesoresAccesorios = require('../informe/espesoresAccesorios.model');
var EspesoresAsentamiento = require('../informe/espesoresAsentamiento.model');
var EspesoresCunas = require('../informe/espesoresCunas.model');
var EspesoresCabezales = require('../informe/espesoresCabezales.model');
var ObservacionesMFL = require('../informe/observacionesMFL.model');
var CalculosEspesores = require('../informe/calculosEspesores.model');

//ruta para mandar formulario de contacto por mail
exports.sendMail = function(req, res) {
  var contact = req.body;

  var response = res;

  //console.log('Key: '+process.env.RECAPTCHA_PRIVATE_KEY);

  //send request to recaptcha verification server
  request.post('http://www.google.com/recaptcha/api/verify', {
      form: {privatekey: config.RECAPTCHA_PRIVATE_KEY,
        //need requestors ip address
        remoteip: req.connection.remoteAddress,
        challenge: contact.captcha.challenge,
        response: contact.captcha.response}
    },
    function (err, res, body) {
      //if the request to googles verification service returns a body which has false within it means server failed
      //validation, if it doesnt verification passed
      if (body.match(/false/) === null) {

        //Sending mail
        transporter.sendMail({
          from: 'sistac@sistemaglobal.com.ar',
          to: 'sistac@sistemaglobal.com.ar',
          subject: 'Contacto SisTAC',
          generateTextFromHTML: true,
          html: 'Nombre y apellido: <b>'+contact.nomYApe+'</b><br>' +
          'País: <b>'+contact.pais+'</b><br>' +
          'Empresa: <b>'+contact.empresa+'</b><br>' +
          'e-mail: <b>'+contact.mail+'</b><br>' +
          'Teléfono: <b>'+contact.telefono+'</b><br>' +
          'Mensaje: <b>'+contact.mensaje+'</b>'
        });
        sistacLoggerInfo.info('Enviando mail de contacto');
        response.send(200,'Ok');
      } else {
        sistacLoggerError.error('Error al completar captcha - '+err);
        response.send(500, {message: "Código verificador inválido.", err: err});
      }

    }
  );
};

exports.exportData = function(req, res) {
  try {
    Informe.findById(req.params.id, function (err, informe) {
      if(err) {
        sistacLoggerError.error('Error al obtener el informe: '+informe.informeCampoDetails.idTanque);
        return handleError(res, err);
      }
      sistacLoggerInfo.info('Generando reporte de informe ' + informe.informeCampoDetails.idTanque);
      cargarInforme(informe, function(informeCompleto, error){
        crearReporte(res, informeCompleto);
      });
    });
  }
  catch(e){
    sistacLoggerError.error('Error al generar informe - '+e);
    res.send(500, {message: "Error al generar informe", err: e});
  }

};

function cargarInforme(informe, callback){
  //Inicializo colecciones
  informe.medicionesChapas = [];
  informe.espesoresPiso = [];
  informe.espesoresEnvolvente = [];
  informe.espesoresAsentamiento = [];
  informe.espesoresCabezales = [];
  informe.espesoresAccesorios = [];
  informe.espesoresCunas = [];
  informe.espesoresTecho = [];
  informe.observacionesMFL = [];
  informe.medicionesAlturaVirolas = [];

  MedicionesChapa.find({'informe': informe._id}, function (err, medicionesChapas) {
    if (err) {sistacLoggerError.error('Error al buscar las mediciones del informe ' + informe._id);}
    informe.medicionesChapas = medicionesChapas;
    EspesoresPiso.find({'informe': informe._id}, function (err, espesoresPiso) {
      if (err) {sistacLoggerError.error('Error al buscar los espesores de Piso del informe ' + informe._id);}
      informe.espesoresPiso = espesoresPiso;
      EspesoresEnvolvente.find({'informe': informe._id}, function (err, espesoresEnvolvente) {
        if (err) {sistacLoggerError.error('Error al buscar los espesores de Envolvente del informe ' + informe._id);}
        informe.espesoresEnvolvente = espesoresEnvolvente;
        EspesoresAsentamiento.find({'informe': informe._id}, function (err, espesoresAsentamiento) {
          if (err) {sistacLoggerError.error('Error al buscar los espesores de Asentamiento del informe ' + informe._id);}
          informe.espesoresAsentamiento = espesoresAsentamiento;
          EspesoresCabezales.find({'informe': informe._id}, function (err, espesoresCabezales) {
            if (err) {sistacLoggerError.error('Error al buscar los espesores de Cabezales del informe ' + informe._id);}
            informe.espesoresCabezales = espesoresCabezales;
            EspesoresAccesorios.find({'informe': informe._id}, function (err, espesoresAccesorios) {
              if (err) {sistacLoggerError.error('Error al buscar los espesores de Accesorios del informe ' + informe._id);}
              informe.espesoresAccesorios = espesoresAccesorios;
              EspesoresCunas.find({'informe': informe._id}, function (err, espesoresCunas) {
                if (err) {sistacLoggerError.error('Error al buscar los espesores de Cunas del informe ' + informe._id);}
                informe.espesoresCunas = espesoresCunas;
                EspesoresTecho.find({'informe': informe._id}, function (err, espesoresTecho) {
                  if (err) {sistacLoggerError.error('Error al buscar los espesores de Techo del informe ' + informe._id);}
                  informe.espesoresTecho = espesoresTecho;
                  ObservacionesMFL.find({'informe': informe._id}, function (err, observacionesMFL) {
                    if (err) {sistacLoggerError.error('Error al buscar las Observaciones MFL del informe ' + informe._id);}
                    informe.observacionesMFL = observacionesMFL;
                    MedicionesAlturaVirolas.find({'informe': informe._id}, function (err, medicionesAlturaVirolas) {
                      if (err) {sistacLoggerError.error('Error al buscar las mediciones en la altura de las virolas ' + informe._id);}
                      informe.medicionesAlturaVirolas = medicionesAlturaVirolas;
                      callback(informe);
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
}


function crearReporte(res,informe){

  function getBooleanLabelValue(value){
    if (value)
      return 'Si';
    else
      return 'No';
  }

  //# Create a document
  var doc = new PDFDocument();
  doc.info.Title = 'Informe';
  doc.info.Author = 'SisTAC';
  //crea archivo en disco
  //doc.pipe(fs.createWriteStream('out.pdf')));

  // Customizaciones
  var esAbierto = informe.informeCampoDetails.tipoInspeccion == "TANQUE_ABIERTO";// || informe.informeCampoDetails.tipoInspeccion == "TANQUE_ABIERTO_ELEVADO";
  var esVolumenMenor = informe.informeCampoDetails.volumen == "VOLUMEN_TANQUE_MENOR_160";
  var esHorizontal = informe.informeCampoDetails.tipoTanque == "HORIZONTAL";
  var separadorColumnas = '  ';
  var separadorTab = '   ';
  var volumenLabel = "> 160 m3";
  if (esVolumenMenor) {
    volumenLabel = "< 160 m3";
  }
  var seccionCimientos = "Cimientos";
  var seccionDatoTecnicoAltura = "Altura";
  var seccionTecho = "Techo";
  if (esHorizontal){
    seccionCimientos = "Apoyos";
    seccionDatoTecnicoAltura = "Largo";
    seccionTecho = "Lomo";
  }

  var metodoCalefaccion = '';
  switch (informe.segundaSeccion.metodoCalefaccion) {
    case 'NO':
      metodoCalefaccion = 'No';
      break;
    case 'SERPENTINA':
      metodoCalefaccion = 'Serpentina';
      break;
    case 'TUBO_DE_FUEGO':
      metodoCalefaccion = 'Tubo de Fuego';
      break;
    case 'RE_CIRCULACION':
      metodoCalefaccion = 'Por Re-Circulación';
      break;
  }
  var barandaPerimetral = '';
  switch (informe.terceraSeccion.tieneBarandaPerimetral) {
    case 'NO':
      barandaPerimetral = 'No';
      break;
    case 'TOTAL':
      barandaPerimetral = 'Total';
      break;
    case 'PARCIAL':
      barandaPerimetral = 'Parcial';
      break;
  }
  var caracteristicaTanque = '';
  switch (informe.quintaSeccion.caracteristicaTanque) {
    case 'AISLADO':
      caracteristicaTanque = 'Aislado';
      break;
    case 'SOLDADO':
      caracteristicaTanque = 'Soldado';
      break;
    case 'ROBLONADO':
      caracteristicaTanque = 'Reblonado';
      break;
  }

  //Título
  doc.font('Times-Bold').fontSize(20).text('Informe de tanque '+informe.informeCampoDetails.idTanque, {underline:true,align: 'center'});
  doc.lineWidth(125);
  doc.fontSize(15);
  doc.moveDown(2);

  //Cabecera
  doc.font('Times-Bold').text('Datos generales',{underline:true,paragraphGap:3});
  doc.fontSize(12);
  doc.font('Times-Bold').text('ID Tanque: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.informeCampoDetails.idTanque);
  doc.font('Times-Bold').text('CIT: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.informeCampoDetails.cit);
  doc.font('Times-Bold').text('Tipo de tanque: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.informeCampoDetails.tipoTanque);
  if (!esHorizontal)
    doc.font('Times-Bold').text('Tipo de tanque: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.informeCampoDetails.tipoInspeccion);
  doc.font('Times-Bold').text('Volúmen: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(volumenLabel);
  doc.font('Times-Bold').text('Fecha y hora: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.informeCampoDetails.fechaHora);
  doc.font('Times-Bold').text('Calle: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.informeCampoDetails.calle);
  doc.font('Times-Bold').text('Localidad: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.informeCampoDetails.localidad);
  doc.font('Times-Bold').text('Provincia: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.informeCampoDetails.provincia);
  doc.font('Times-Bold').text('Entidad auditora: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.informeCampoDetails.entidadAuditora);
  doc.font('Times-Bold').text('Inspector: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.informeCampoDetails.inspector);
  doc.font('Times-Bold').text('Operador: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.informeCampoDetails.operador);


  //Checklist
  doc.fontSize(15);
  doc.moveDown(2);
  doc.font('Times-Bold').text('Checklist',{underline:true,paragraphGap:3});

  //Primera Sección
  //Identificación del tanque
  doc.fontSize(13);
  doc.font('Times-Bold').text('Identificación del tanque',{underline:true,paragraphGap:2});
  doc.fontSize(12);
  doc.font('Times-Bold').text('Placa TK: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.primeraSeccion.tienePlacaTk)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.primeraSeccion.tienePlacaTkObservaciones+' ');
  doc.font('Times-Bold').text('Número: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.primeraSeccion.tieneNumero)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.primeraSeccion.tieneNumeroObservaciones+' ');
  doc.font('Times-Bold').text('Capacidad nominal: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.primeraSeccion.tieneCapacidadNominal)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.primeraSeccion.tieneCapacidadNominalObservaciones+' ');
  doc.font('Times-Bold').text('Producto almacenado: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.primeraSeccion.tieneProductoAlmacenado)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.primeraSeccion.tieneProductoAlmacenadoObservaciones+' ');
  doc.font('Times-Bold').text('Logo operador: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.primeraSeccion.tieneLogoOperador)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.primeraSeccion.tieneLogoOperadorObservaciones+' ');
  doc.font('Times-Bold').text('Identificador de riesgo: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.primeraSeccion.tieneIdentificadorRiesgo)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.primeraSeccion.tieneIdentificadorRiesgoObservaciones+' ');
  doc.font('Times-Bold').text('Carta conversión altura/volúmen: ',{continued: true,paragraphGap:3}).font('Times-Roman').text(getBooleanLabelValue(informe.primeraSeccion.tieneCartaConversion)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.primeraSeccion.tieneCartaConversionObservaciones+' ');
  //Datos técnicos
  doc.fontSize(13);
  doc.font('Times-Bold').text('Datos técnicos',{underline:true,paragraphGap:2});
  doc.fontSize(12);
  doc.font('Times-Bold').text('Perímetro(mts.): ',{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.primeraSeccion.perimetro+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.primeraSeccion.perimetroObservaciones+' ');
  doc.font('Times-Bold').text(seccionDatoTecnicoAltura+'(mts.): ',{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.primeraSeccion.altura+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.primeraSeccion.alturaObservaciones+' ');
  doc.font('Times-Bold').text('Cantidad de virolas: ',{continued: true,paragraphGap:3}).font('Times-Roman').text(informe.segundaSeccion.cantidadVirolas+ separadorColumnas);
  //Cimientos
  doc.fontSize(13);
  doc.font('Times-Bold').text(seccionCimientos,{underline:true,paragraphGap:2});
  doc.fontSize(12);
  if (!esHorizontal){
    doc.font('Times-Bold').text('Tiene Pestaña piso: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.primeraSeccion.tienePestaniaPiso)+separadorColumnas,{continued: true})
      .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.primeraSeccion.tienePestaniaPisoObservaciones+' ');
    doc.font('Times-Bold').text('Tiene Talón Bituminoso: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.primeraSeccion.tieneTalonBituminoso)+separadorColumnas,{continued: true})
      .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.primeraSeccion.tieneTalonBituminosoObservaciones+' ');
  }
  doc.font('Times-Bold').text('Tiene Hormigón armado: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.primeraSeccion.tieneHormigonArmado)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.primeraSeccion.tieneHormigonArmadoObservaciones+' ');
  if (!esHorizontal){
    doc.font('Times-Bold').text('Tiene Anclajes: ',{continued: true,paragraphGap:3}).font('Times-Roman').text(getBooleanLabelValue(informe.primeraSeccion.tieneAnclajes)+separadorColumnas,{continued: true})
      .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.primeraSeccion.tieneAnclajesObservaciones+' ');
  }
  else {
    doc.font('Times-Bold').text('Tiene Acero/Hierro: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.primeraSeccion.tieneAceroHierro)+separadorColumnas,{continued: true})
      .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.primeraSeccion.aceroHierroObservaciones+' ');
    doc.font('Times-Bold').text('Tiene Mampostería: ',{continued: true,paragraphGap:3}).font('Times-Roman').text(getBooleanLabelValue(informe.primeraSeccion.tieneMamposteria)+separadorColumnas,{continued: true})
      .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.primeraSeccion.mamposteriaObservaciones+' ');
  }

  //Segunda Sección
  //Pared externa
  doc.fontSize(13);
  doc.font('Times-Bold').text('Pared externa',{underline:true,paragraphGap:2});
  doc.fontSize(12);
  doc.font('Times-Bold').text('Soldaduras: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.segundaSeccion.tieneSoldaduras)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.segundaSeccion.tieneSoldadurasObservaciones+' ');
  doc.font('Times-Bold').text('Globos: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.segundaSeccion.tieneGlobos)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.segundaSeccion.tieneGlobosObservaciones+' ');
  doc.font('Times-Bold').text('Hundimientos: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.segundaSeccion.tieneHundimientos)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.segundaSeccion.tieneHundimientosObservaciones+' ');
  if (!esHorizontal){
    doc.font('Times-Bold').text('Boca de limpieza: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.segundaSeccion.tieneBocaLimpieza)+separadorColumnas,{continued: true})
      .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.segundaSeccion.tieneBocaLimpiezaObservaciones+' ');
  }
  doc.font('Times-Bold').text('Boca de hombre: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.segundaSeccion.tieneBocaHombre)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.segundaSeccion.tieneBocaHombreObservaciones+' ');
  doc.font('Times-Bold').text('Medidor de nivel: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.segundaSeccion.tieneMedidorNivelPared)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.segundaSeccion.tieneMedidorNivelParedObservaciones+' ');
  doc.font('Times-Bold').text('Succión: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.segundaSeccion.tieneSuccion)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.segundaSeccion.tieneSuccionObservaciones+' ');
  doc.font('Times-Bold').text('Carga: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.segundaSeccion.tieneCarga)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.segundaSeccion.tieneCargaObservaciones+' ');
  doc.font('Times-Bold').text('Drenaje: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.segundaSeccion.tieneDrenaje)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.segundaSeccion.tieneDrenajeObservaciones+' ');
  if (!esHorizontal){
    doc.font('Times-Bold').text('Telemedición: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.segundaSeccion.tieneTelemedicion)+separadorColumnas,{continued: true})
      .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.segundaSeccion.tieneTelemedicionObservaciones+' ');
  }
  if (!esHorizontal){
    doc.font('Times-Bold').text('Pintura: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.segundaSeccion.tienePintura)+separadorColumnas,{continued: true})
      .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.segundaSeccion.tienePinturaObservaciones+' ');
    doc.font('Times-Bold').text('Calefacción: ',{continued: true,paragraphGap:3}).font('Times-Roman').text(metodoCalefaccion);
  }
  else {
    doc.font('Times-Bold').text('Pintura: ',{continued: true,paragraphGap:3}).font('Times-Roman').text(getBooleanLabelValue(informe.segundaSeccion.tienePintura)+separadorColumnas,{continued: true})
      .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.segundaSeccion.tienePinturaObservaciones+' ');
  }
  //Medidas
  doc.fontSize(13);
  doc.font('Times-Bold').text('Chapas por virola',{underline:true,paragraphGap:2});
  doc.fontSize(12);
  doc.font('Times-Bold').text(separadorTab+'Cantidad: ',{continued: true,paragraphGap:2}).font('Times-Roman').text(informe.medicionesChapas.length);
  for (var index = 0; index < informe.medicionesChapas.length; ++index) {
    doc.font('Times-Bold').text(separadorTab+'Chapa '+ informe.medicionesChapas[index].numeroChapa + separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman')
      .text('Largo: '+informe.medicionesChapas[index].largo+separadorColumnas+'Ancho: '+informe.medicionesChapas[index].ancho);
  }

  //Tercera Sección
  //Techo
  doc.fontSize(13);
  doc.font('Times-Bold').text(seccionTecho,{underline:true,paragraphGap:2});
  doc.fontSize(12);
  if (!esHorizontal){
    doc.font('Times-Bold').text('Tipo: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneTecho)+separadorColumnas,{continued: true})
      .font('Times-Roman').text(informe.terceraSeccion.tipoTecho+separadorColumnas)
      .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.terceraSeccion.tipoTechoObservaciones+' ');
    doc.font('Times-Bold').text('Chapas: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneChapasTecho)+separadorColumnas,{continued: true})
      .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.terceraSeccion.chapasTechoObservaciones+' ');
    doc.font('Times-Bold').text('Sellos: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneSellos)+separadorColumnas,{continued: true})
      .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.terceraSeccion.sellosObservaciones+' ');
    doc.font('Times-Bold').text('Respiraderos: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneRespiradores)+separadorColumnas,{continued: true})
      .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.terceraSeccion.respiradoresObservaciones+' ');
  }
  doc.font('Times-Bold').text('Boca de hombre: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneBocaHombreTecho)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.terceraSeccion.bocaHombreTechoObservaciones+' ');
  if (esHorizontal){
    doc.font('Times-Bold').text('Boca de medición: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneBocaMedicion)+separadorColumnas,{continued: true})
      .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.terceraSeccion.bocaMedicionObservaciones+' ');
  }
  doc.font('Times-Bold').text('Succión: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneSuccion)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.terceraSeccion.succionObservaciones+' ');
  doc.font('Times-Bold').text('Medidor de nivel: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneMedidorNivel)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.terceraSeccion.medidorNivelObservaciones+' ');
  if (esHorizontal){
    doc.font('Times-Bold').text('Control de nivel: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneControlNivel)+separadorColumnas,{continued: true})
      .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.terceraSeccion.controlNivelObservaciones+' ');
  }
  doc.font('Times-Bold').text('Cañería de carga: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneCanieria)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.terceraSeccion.canieriaObservaciones+' ');
  doc.font('Times-Bold').text('Poncho: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tienePoncho)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.terceraSeccion.ponchoObservaciones+' ');
  doc.font('Times-Bold').text('Venteos: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneVenteos)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.terceraSeccion.venteosObservaciones+' ');
  doc.font('Times-Bold').text('Válvulas presión/vacío: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneValvulas)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.terceraSeccion.valvulasObservaciones+' ');
  doc.font('Times-Bold').text('Pintura: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tienePintura)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.terceraSeccion.pinturaObservaciones+' ');
  if (!esHorizontal){
    doc.font('Times-Bold').text('Telemedición: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneTelemedicion)+separadorColumnas,{continued: true})
      .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.terceraSeccion.telemedicionObservaciones+' ');
    doc.font('Times-Bold').text('Baranda perimetral: ',{continued: true,paragraphGap:3}).font('Times-Roman').text(barandaPerimetral);
    //Piso
    doc.fontSize(13);
    doc.font('Times-Bold').text('Piso',{underline:true,paragraphGap:2});
    doc.fontSize(12);
    doc.font('Times-Bold').text('Chapas: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneChapasPiso)+separadorColumnas,{continued: true})
      .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.terceraSeccion.chapasPisoObservaciones+' ');
    doc.font('Times-Bold').text('Flujo magnético: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneFlujoMagnetico)+separadorColumnas,{continued: true})
      .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.terceraSeccion.flujoMagneticoObservaciones+' ');
    doc.font('Times-Bold').text('Emisión acústica: ',{continued: true,paragraphGap:3}).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneEmisionAcustica)+separadorColumnas,{continued: true})
      .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.terceraSeccion.emisionAcusticaObservaciones+' ');
  }
  else {
    doc.font('Times-Bold').text('Telemedición: ',{continued: true,paragraphGap:3}).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneTelemedicion)+separadorColumnas,{continued: true})
      .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.terceraSeccion.telemedicionObservaciones+' ');
    //Cabezales
    doc.fontSize(13);
    doc.font('Times-Bold').text('Cabezales',{underline:true,paragraphGap:2});
    doc.fontSize(12);
    doc.font('Times-Bold').text(separadorTab+'Frontal (A)',{paragraphGap:1});
    doc.font('Times-Bold').text(separadorTab+separadorTab+'Medidor de nivel: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.teneMedidorNivelA)+separadorColumnas,{continued: true})
      .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.terceraSeccion.medidorNivelAObservaciones+' ');
    doc.font('Times-Bold').text(separadorTab+separadorTab+'Succión: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneSuccionA)+separadorColumnas,{continued: true})
      .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.terceraSeccion.succionAObservaciones+' ');
    doc.font('Times-Bold').text(separadorTab+'Posterior (B)',{paragraphGap:1});
    doc.font('Times-Bold').text(separadorTab+separadorTab+'Medidor de nivel: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneMedidorNivelB)+separadorColumnas,{continued: true})
      .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.terceraSeccion.medidorNivelBObservaciones+' ');
    doc.font('Times-Bold').text(separadorTab+separadorTab+'Succión: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.teneSuccionB)+separadorColumnas,{continued: true})
      .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.terceraSeccion.succionBObservaciones+' ');
    doc.font('Times-Bold').text(separadorTab+separadorTab+'Carga: ',{continued: true,paragraphGap:3}).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneCargaB)+separadorColumnas,{continued: true})
      .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.terceraSeccion.cargaBObservaciones+' ');
  }
  //Protecciones
  doc.fontSize(13);
  doc.font('Times-Bold').text('Protecciones',{underline:true,paragraphGap:2});
  doc.fontSize(12);
  doc.font('Times-Bold').text('Protección catódica: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneProteccionCatodica)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.terceraSeccion.proteccionCatodicaObservaciones+' ');
  doc.font('Times-Bold').text('Tomas de tierra: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneTomasTierra)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.terceraSeccion.tomasTierraObservaciones+' ');
  doc.font('Times-Bold').text('Pararrayos: ',{continued: true,paragraphGap:3}).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tienePararrayos)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.terceraSeccion.pararrayosObservaciones+' ');

  //Cuarta sección
  //Escalera del tanque
  doc.fontSize(13);
  doc.font('Times-Bold').text('Escalera del tanque',{underline:true,paragraphGap:2});
  doc.fontSize(12);
  doc.font('Times-Bold').text('Plataforma: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.cuartaSeccion.tienePlataforma)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.cuartaSeccion.plataformaObservaciones+' ');
  doc.font('Times-Bold').text('Peldaños: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.cuartaSeccion.tienePeldanios)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.cuartaSeccion.peldaniosObservaciones+' ');
  doc.font('Times-Bold').text('Descansos: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.cuartaSeccion.tieneDescansos)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.cuartaSeccion.descansosObservaciones+' ');
  doc.font('Times-Bold').text('Baranda: ',{continued: true,paragraphGap:3}).font('Times-Roman').text(getBooleanLabelValue(informe.cuartaSeccion.tieneBaranda)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.cuartaSeccion.tieneBarandaObservaciones+' ');
  //Recinto del tanque
  doc.fontSize(13);
  doc.font('Times-Bold').text('Recinto del tanque',{underline:true,paragraphGap:2});
  doc.fontSize(12);
  doc.font('Times-Bold').text('Tipo recinto: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.cuartaSeccion.tieneRecintoCompartido)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.cuartaSeccion.recintoCompartidoObservaciones+' ');
  doc.font('Times-Bold').text('Largo(mts.): ',{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.cuartaSeccion.largoRecinto+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Ancho(mts.): ',{continued: true}).font('Times-Roman').text(informe.cuartaSeccion.anchoRecinto+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Alto(mts.): ',{continued: true}).font('Times-Roman').text(informe.cuartaSeccion.altoRecinto);
  doc.font('Times-Bold').text('Iluminación: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.cuartaSeccion.tieneIluminacionRecinto)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.cuartaSeccion.recintoIluminacionObservaciones+' ');
  doc.font('Times-Bold').text('Drenajes: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.cuartaSeccion.tieneDrenajesRecinto)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.cuartaSeccion.recintoDrenajesObservaciones+' ');
  doc.font('Times-Bold').text('Método de recuperación: ',{continued: true,paragraphGap:3}).font('Times-Roman').text(getBooleanLabelValue(informe.cuartaSeccion.tieneMetodoRecuperacion)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.cuartaSeccion.metodoRecuperacionObservaciones+' ');
  //Rampa de acceso
  doc.fontSize(13);
  doc.font('Times-Bold').text('Rampa de acceso',{underline:true,paragraphGap:2});
  doc.fontSize(12);
  doc.font('Times-Bold').text('Rampa: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.cuartaSeccion.tieneRampas)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Cantidad: ',{continued: true}).font('Times-Roman').text(informe.cuartaSeccion.cantidadRampas+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.cuartaSeccion.rampaCantidadObservaciones+' ');
  doc.font('Times-Bold').text('Pasarela: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.cuartaSeccion.tieneRampaPasarela)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.cuartaSeccion.rampaPasarelaObservaciones+' ');
  doc.font('Times-Bold').text('Escalones: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.cuartaSeccion.tieneRampaEscalones)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.cuartaSeccion.tieneRampaEscalonesObservaciones+' ');
  doc.font('Times-Bold').text('Iluminación: ',{continued: true,paragraphGap:3}).font('Times-Roman').text(getBooleanLabelValue(informe.cuartaSeccion.tieneRampaIluminacion)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.cuartaSeccion.tieneRampaIluminacionObservaciones+' ');

  //Quinta sección
  //Medidor de nivel
  doc.fontSize(13);
  doc.font('Times-Bold').text('Medidor de nivel',{underline:true,paragraphGap:2});
  doc.fontSize(12);
  doc.font('Times-Bold').text('Flotante: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.quintaSeccion.tieneFlotante)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.quintaSeccion.flotanteObservaciones+' ');
  doc.font('Times-Bold').text('Alambre: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.quintaSeccion.tieneAlambre)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.quintaSeccion.alambreObservaciones+' ');
  doc.font('Times-Bold').text('Guías de alambre: ',{continued: true,paragraphGap:3}).font('Times-Roman').text(getBooleanLabelValue(informe.quintaSeccion.tieneGuiasAlambre)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.quintaSeccion.tieneGuiasAlambreObservaciones+' ');
  //Mantenimiento del tanque
  doc.fontSize(13);
  doc.font('Times-Bold').text('Mantenimiento del tanque',{underline:true,paragraphGap:2});
  doc.fontSize(12);
  doc.font('Times-Bold').text('Mantenimiento del tanque: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.quintaSeccion.tieneMantenimientoTanque)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.quintaSeccion.mantenimientoTanqueObservaciones+' ');
  doc.font('Times-Bold').text('Mantenimiento del cañerías: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.quintaSeccion.tieneMantenimientoCanierias)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.quintaSeccion.mantenimientoCanieriasObservaciones+' ');
  doc.font('Times-Bold').text('Mantenimiento del recinto: ',{continued: true,paragraphGap:3}).font('Times-Roman').text(getBooleanLabelValue(informe.quintaSeccion.tieneMantenimientoRecinto)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.quintaSeccion.mantenimientoRecintoObservaciones+' ');
  //Tipo de tanque y coordenadas
  doc.fontSize(13);
  doc.font('Times-Bold').text('Tipo de tanque y coordenadas',{underline:true,paragraphGap:2});
  doc.fontSize(12);
  doc.font('Times-Bold').text('Caracteristica del tanque: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(caracteristicaTanque);
  doc.font('Times-Bold').text('Latitud: ',{continued: true,paragraphGap:3}).font('Times-Roman').text(informe.quintaSeccion.latitud+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Longitud: ',{continued: true}).font('Times-Roman').text(informe.quintaSeccion.longitud);

  //Sexta sección
  //Sistema contra incendio
  doc.fontSize(13);
  doc.font('Times-Bold').text('Sistema contra incendio',{underline:true,paragraphGap:2});
  doc.fontSize(12);
  doc.font('Times-Bold').text('Extintores hasta 10Kg.: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.sextaSeccion.tieneExtintores10K)+separadorColumnas,{continued: true})
    .font('Times-Roman').text(informe.sextaSeccion.extintores10KClase+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Cantidad: ',{continued: true}).font('Times-Roman').text(informe.sextaSeccion.extintores10KCantidad+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.sextaSeccion.extintores10KObservaciones+' ');
  doc.font('Times-Bold').text('Extintores hasta 50Kg.: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.sextaSeccion.tieneExtintores50K)+separadorColumnas,{continued: true})
    .font('Times-Roman').text(informe.sextaSeccion.extintores50KClase+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Cantidad: ',{continued: true}).font('Times-Roman').text(informe.sextaSeccion.extintores50KCantidad+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.sextaSeccion.extintores50KObservaciones+' ');
  doc.font('Times-Bold').text('Espumígeno: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.sextaSeccion.tieneEspumigeno)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Cantidad: ',{continued: true}).font('Times-Roman').text(informe.sextaSeccion.espumigenoCantidad+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.sextaSeccion.espumigenoObservaciones+' ');
  doc.font('Times-Bold').text('Rociadores: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.sextaSeccion.tieneRociadores)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Cantidad: ',{continued: true}).font('Times-Roman').text(informe.sextaSeccion.rociadoresCantidad+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.sextaSeccion.rociadoresObservaciones+' ');
  doc.font('Times-Bold').text('Hidrantes: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.sextaSeccion.tieneHidrantes)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Cantidad: ',{continued: true}).font('Times-Roman').text(informe.sextaSeccion.hidrantesCantidad+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.sextaSeccion.hidrantesObservaciones+' ');
  doc.font('Times-Bold').text('Lanzas: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.sextaSeccion.tieneLanzas)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Cantidad: ',{continued: true}).font('Times-Roman').text(informe.sextaSeccion.lanzasCantidad+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.sextaSeccion.lanzasObservaciones+' ');
  doc.font('Times-Bold').text('Servicio propio de bomberos: ',{continued: true,paragraphGap:1}).font('Times-Roman').text(getBooleanLabelValue(informe.sextaSeccion.tieneServicioPropioBomberos)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.sextaSeccion.servicioPropioBomberosObservaciones+' ');
  doc.font('Times-Bold').text('Tambor de arena, baldes: ',{continued: true,paragraphGap:3}).font('Times-Roman').text(getBooleanLabelValue(informe.sextaSeccion.tieneBaldes)+separadorColumnas,{continued: true})
    .font('Times-Bold').text('Observaciones: ',{continued: true}).font('Times-Roman').text(informe.sextaSeccion.baldesObservaciones+' ');
  //Observaciones generales
  doc.fontSize(13);
  doc.font('Times-Bold').text('Observaciones generales',{underline:true,paragraphGap:2});
  doc.fontSize(12);
  doc.font('Times-Roman').text(informe.sextaSeccion.observacionesGenerales+' ');


  //Piso
  if (!esHorizontal){
    doc.fontSize(15);
    doc.moveDown(2);
    doc.font('Times-Bold').text('Registro de espesores(Piso)',{underline:true,paragraphGap:3});
    doc.fontSize(12);
    for (index = 0; index < informe.espesoresPiso.length; ++index) {
      doc.font('Times-Bold').text(separadorTab+'Chapa N° '+informe.espesoresPiso[index].chapa,{paragraphGap:1});
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 1'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresPiso[index].medicion1+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 2'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresPiso[index].medicion2+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 3'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresPiso[index].medicion3+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 4'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresPiso[index].medicion4+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 5'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresPiso[index].medicion5+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 6'+separadorColumnas,{continued: true,paragraphGap:3}).font('Times-Roman').text(informe.espesoresPiso[index].medicion6+'mm.');
    }
  }


  //Envolvente
  doc.fontSize(15);
  doc.moveDown(2);
  doc.font('Times-Bold').text('Registro de espesores(Envolvente)',{underline:true,paragraphGap:3});
  doc.fontSize(12);
  for (index = 0; index < informe.espesoresEnvolvente.length; ++index) {
    doc.font('Times-Bold').text(separadorTab+'Virola '+informe.espesoresEnvolvente[index].virola+separadorColumnas+'Generatriz '+informe.espesoresEnvolvente[index].generatriz,{paragraphGap:1});
    doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 1'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresEnvolvente[index].medicion1+'mm.');
    doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 2'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresEnvolvente[index].medicion2+'mm.');
    doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 3'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresEnvolvente[index].medicion3+'mm.');
    doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 4'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresEnvolvente[index].medicion4+'mm.');
    doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 5'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresEnvolvente[index].medicion5+'mm.');
    doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 6'+separadorColumnas,{continued: true,paragraphGap:3}).font('Times-Roman').text(informe.espesoresEnvolvente[index].medicion6+'mm.');
  }


  //Asentamiento
  if (!esHorizontal && !esVolumenMenor) {
    doc.fontSize(15);
    doc.moveDown(2);
    doc.font('Times-Bold').text('Registro de espesores(Asentamiento)', {underline: true, paragraphGap: 3});
    doc.fontSize(12);
    for (index = 0; index < informe.espesoresAsentamiento.length; ++index) {
      doc.font('Times-Bold').text(separadorTab + 'Número de estación ' + informe.espesoresAsentamiento[index].estacion, {paragraphGap: 1});
      doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición ' + separadorColumnas, {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(informe.espesoresAsentamiento[index].medicion + 'mm.');
      doc.font('Times-Bold').text(separadorTab + separadorTab + 'Observación ' + separadorColumnas, {
        continued: true,
        paragraphGap: 3
      }).font('Times-Roman').text(informe.espesoresAsentamiento[index].observaciones);
    }
  }


  //Cabezales
  if (esHorizontal) {
    doc.fontSize(15);
    doc.moveDown(2);
    doc.font('Times-Bold').text('Cabezales', {underline: true, paragraphGap: 3});
    doc.fontSize(12);
    for (index = 0; index < informe.espesoresCabezales.length; ++index) {
      doc.font('Times-Bold').text(separadorTab+'Lado '+informe.espesoresCabezales[index].lado+separadorColumnas+'Generatriz '+informe.espesoresCabezales[index].generatriz,{paragraphGap:1});
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 1'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresCabezales[index].medicion1+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 2'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresCabezales[index].medicion2+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 3'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresCabezales[index].medicion3+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 4'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresCabezales[index].medicion4+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 5'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresCabezales[index].medicion5+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 6'+separadorColumnas,{continued: true,paragraphGap:3}).font('Times-Roman').text(informe.espesoresCabezales[index].medicion6+'mm.');
    }
  }


  //Accesorios
  doc.fontSize(15);
  doc.moveDown(2);
  doc.font('Times-Bold').text('Registro de espesores(Accesorios)', {underline: true, paragraphGap: 3});
  doc.fontSize(12);
  for (index = 0; index < informe.espesoresAccesorios.length; ++index) {
    doc.font('Times-Bold').text(separadorTab+informe.espesoresAccesorios[index].accesorio,{paragraphGap:1});
    doc.font('Times-Bold').text(separadorTab+separadorTab+'Diámetro'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresAccesorios[index].diametro+'"');
    doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 0°'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresAccesorios[index].medicion0+'mm.');
    doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 90°'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresAccesorios[index].medicion90+'mm.');
    doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 180°'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresAccesorios[index].medicion180+'mm.');
    doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 270°'+separadorColumnas,{continued: true,paragraphGap:3}).font('Times-Roman').text(informe.espesoresAccesorios[index].medicion270+'mm.');
  }


  //Zona crítica
  if (esHorizontal) {
    doc.fontSize(15);
    doc.moveDown(2);
    doc.font('Times-Bold').text('Zona crítica', {underline: true, paragraphGap: 3});
    doc.fontSize(12);
    for (index = 0; index < informe.espesoresCunas.length; ++index) {
      doc.font('Times-Bold').text(separadorTab+'Cuna '+informe.espesoresCunas[index].cuna,{paragraphGap:1});
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Punto'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresCunas[index].punto);
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 1'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresCunas[index].medicion1+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 2'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresCunas[index].medicion2+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 3'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresCunas[index].medicion3+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 4'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresCunas[index].medicion4+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 5'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresCunas[index].medicion5+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 6'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresCunas[index].medicion6+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 7'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresCunas[index].medicion7+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 8'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresCunas[index].medicion8+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 9'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresCunas[index].medicion9+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 10'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresCunas[index].medicion10+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 11'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresCunas[index].medicion11+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 12'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresCunas[index].medicion12+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 13'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresCunas[index].medicion13+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 14'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresCunas[index].medicion14+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 15'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresCunas[index].medicion15+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 16'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresCunas[index].medicion16+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 17'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresCunas[index].medicion17+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 18'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresCunas[index].medicion18+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 19'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresCunas[index].medicion19+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 20'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresCunas[index].medicion20+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 21'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresCunas[index].medicion21+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 22'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresCunas[index].medicion22+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 23'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresCunas[index].medicion23+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 24'+separadorColumnas,{continued: true,paragraphGap:3}).font('Times-Roman').text(informe.espesoresCunas[index].medicion24+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 25'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresCunas[index].medicion25+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 26'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresCunas[index].medicion26+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 27'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresCunas[index].medicion27+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 28'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresCunas[index].medicion28+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 29'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresCunas[index].medicion29+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 30'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresCunas[index].medicion30+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 31'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresCunas[index].medicion31+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 32'+separadorColumnas,{continued: true,paragraphGap:3}).font('Times-Roman').text(informe.espesoresCunas[index].medicion32+'mm.');
    }
  }


  //Techo
  if (!esHorizontal){
    doc.fontSize(15);
    doc.moveDown(2);
    doc.font('Times-Bold').text('Registro de espesores(Techo)',{underline:true,paragraphGap:3});
    doc.fontSize(12);
    for (index = 0; index < informe.espesoresTecho.length; ++index) {
      doc.font('Times-Bold').text(separadorTab+'Chapa N° '+informe.espesoresTecho[index].chapa,{paragraphGap:1});
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 1'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresTecho[index].medicion1+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 2'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresTecho[index].medicion2+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 3'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresTecho[index].medicion3+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 4'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresTecho[index].medicion4+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 5'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.espesoresTecho[index].medicion5+'mm.');
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Medición 6'+separadorColumnas,{continued: true,paragraphGap:3}).font('Times-Roman').text(informe.espesoresTecho[index].medicion6+'mm.');
    }
  }


  //MFL
  if (!esHorizontal && esAbierto){
    doc.fontSize(15);
    doc.moveDown(2);
    doc.font('Times-Bold').text('Registro de observaciones MFL',{underline:true,paragraphGap:3});
    doc.fontSize(12);
    for (index = 0; index < informe.observacionesMFL.length; ++index) {
      doc.font('Times-Bold').text(separadorTab+'Pasada '+informe.observacionesMFL[index].pasada+separadorColumnas+'Chapa '+informe.observacionesMFL[index].chapa,{paragraphGap:1});
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Acceso'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.observacionesMFL[index].acceso);
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Amolado'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.observacionesMFL[index].amolado);
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Corrosión'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.observacionesMFL[index].corrosion);
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Deformación'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.observacionesMFL[index].deformacion);
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Otra'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.observacionesMFL[index].otra);
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Perforación'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.observacionesMFL[index].perforacion);
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Punto soldadura'+separadorColumnas,{continued: true,paragraphGap:1}).font('Times-Roman').text(informe.observacionesMFL[index].puntosoldadura);
      doc.font('Times-Bold').text(separadorTab+separadorTab+'Observaciones'+separadorColumnas,{continued: true,paragraphGap:3}).font('Times-Roman').text(informe.observacionesMFL[index].observaciones);
    }
  }


  doc.pipe(res);

  //# Finalize PDF file
  doc.end();

}

function handleError(res, err) {
  return res.send(500, err);
}
}());
;(function() {

'use strict';

var express = require('express');
var controller = require('./core.controller.js');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.post('/contact-form', controller.sendMail);
router.get('/export-data/:id', auth.isAuthenticated(), controller.exportData);

module.exports = router;
}());
;(function() {
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
;(function() {

'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var EmpresaSchema = new Schema({
  nombre: { type: String, index: { unique: true }, uppercase: true}, //Código de empresa ej "AMB"
  razonSocial: String,
  direccion: String,
  telefono: String,
  email: { type: String, lowercase: true },
  password: String,
  token: String,
  contacto: String,
  imagen: String,
  active: {type: Boolean, default: true}
});
EmpresaSchema.plugin(autoIncrement.plugin, {
  model: 'Empresa',
  field: 'sequence',
  startAt: 1
});

module.exports = mongoose.model('Empresa', EmpresaSchema);
}());
;(function() {
'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('GET /lab/empresas', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/lab/empresas')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});
}());
;(function() {
'use strict';

var express = require('express');
var controller = require('./empresa.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id', auth.hasRole('admin'), controller.getById);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.delete);
router.post('/syncTokenRequest', controller.syncTokenRequest);

module.exports = router;
}());
;(function() {
'use strict';

var _ = require('underscore');
var winston = require('winston');
var sistacLoggerError = winston.loggers.get('sistac-error');
var Foto = require('./foto.model');
var im = require('imagemagick');
var crypto = require('crypto');
var fs = require('fs');

var imageFolder = 'images/';
var publicFolder = 'public/';
var thumbFolder = 'thumb/';

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
    if (400 === status || 404 === status) {
        sistacLoggerError.error(content);
    }
};

exports.getById = function(req, res) {
    if (!req.params || !req.params.id) {
        return sendJsonResponse(res, 404, {
            'message': 'id not found in request params'
        });
    }

    Foto
        .findById(req.params.id)
        .select('-sequence -__v')
        .exec(function(err, foto) {
            if (err) {
                return sendJsonResponse(res, 400, err);
            } else if (!foto) {
                return sendJsonResponse(res, 404, {
                    'message': 'Foto not found by id: ' + req.params.id
                });
            } else {
                return sendJsonResponse(res, 200, {
                    id: foto._id,
                    idInforme: foto.idInforme,
                    url: imageFolder + thumbFolder + foto.filename + '.' + foto.ext,
                    syncTime: foto.syncTime,
                    descripcion: foto.descripcion,
                    tags: foto.tags
                });
            }
        });
};

exports.findByInformeIdAndTags = function(req, res) {
    var filter = {};

    if (!req.query.idInforme) {
        return sendJsonResponse(res, 404, {
            'message': 'idInforme not found in request params'
        });
    } else {
        filter.idInforme = req.query.idInforme;
    }

    if (req.query.tag) {
        var tags = [];
        tags.push(req.query.tag);
        var inQuery = {
            $in: tags
        };
        filter.tags = inQuery;
    }

    Foto
        .find(filter)
        .select('-sequence -__v')
        .exec(
            function(err, fotos) {
                if (err) {
                    return sendJsonResponse(res, 400, err);
                }
                var fotoList = _.map(fotos, function(foto) {
                    var fotoUrl = req.query.full ?
                        getFullUrlFromFoto(foto) :
                        getBase64UrlFromFoto(foto);

                    return {
                        id: foto._id,
                        idInforme: foto.idInforme,
                        url: fotoUrl,
                        syncTime: foto.syncTime,
                        descripcion: foto.descripcion,
                        tags: foto.tags
                    };
                });
                return sendJsonResponse(res, 200, fotoList);
            }
        );
};

function getFullUrlFromFoto(foto) {
    return imageFolder + thumbFolder + foto.filename + '.' + foto.ext;
}

function getBase64UrlFromFoto(foto) {
    var base64Data = fs.readFileSync(publicFolder + imageFolder + foto.filename + '.' + foto.ext, 'base64');
    return 'data:image/' + foto.ext + ';base64,' + base64Data;
}

exports.delete = function(req, res) {
    var id = req.params.id;
    if (!id) {
        sendJsonResponse(res, 404, {
            'message': 'Foto not found by id: ' + id
        });
    }

    Foto
        .findByIdAndRemove(id)
        .select('filename ext')
        .exec(
            function(err, foto) {
                if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                fs.unlinkSync(publicFolder + imageFolder + foto.filename + '.' + foto.ext);
                fs.unlinkSync(publicFolder + imageFolder + thumbFolder + foto.filename + '.' + foto.ext);
                sendJsonResponse(res, 204, null);
            }
        );
};

exports.update = function(req, res) {
    if (!req.params || !req.params.id) {
        sendJsonResponse(res, 404, {
            'message': 'id not found in request params'
        });
        return;
    }

    Foto
        .findById(req.params.id)
        .select('-sequence -__v')
        .exec(
            function(err, foto) {
                if (err) {
                    sendJsonResponse(res, 400, err);
                    return;
                } else if (!foto) {
                    sendJsonResponse(res, 404, {
                        'message': 'Foto not found by id:' + req.params.id
                    });
                    return;
                }

                var tags = req.body.tags;
                var descripcion = req.body.descripcion;

                Foto
                    .findOne({
                        informeId: req.body.informeId,
                        tags: {
                            $in: tags
                        }
                    })
                    .select('_id')
                    .exec(
                        function(err, fotoWithDuplicateTag) {
                            if (err) {
                                sendJsonResponse(res, 400, err);
                                return;
                            }

                            if (fotoWithDuplicateTag && !fotoWithDuplicateTag._id.equals(foto._id)) {
                                sendJsonResponse(res, 400, {
                                    'message': 'Tags already assinged'
                                });
                                return;
                            }

                            foto.tags = tags;
                            foto.descripcion = descripcion;
                            foto
                                .save(
                                    function(err) {
                                        if (err) {
                                            sendJsonResponse(res, 400, err);
                                            return;
                                        }
                                        sendJsonResponse(res, 200, foto);
                                    }
                                );
                        }
                    );
            });
};

exports.deleteByInformeId = function(req, res) {
    if (!req.params || !req.params.id) {
        /*sendJsonResponse(res, 404, {
            'message': 'id not found in request params'
        });*/
        sistacLoggerError.error('id not found in request params');
        return;
    }

    Foto
        .find({
            idInforme: req.params.id
        })
        .exec(
            function(err, fotos) {
                if (err) {
                    sistacLoggerError.error(err);
                    //sendJsonResponse(res, 400, err);
                    return;
                }
                _.each(fotos, function(foto) {
                    foto.remove(
                        function(err) {
                            if (err) {
                                sistacLoggerError.error(err);
                                //sendJsonResponse(res, 400, err);
                                return;
                            }
                        }
                    );
                });
                //sendJsonResponse(res, 204, null);
            }
        );
};

exports.create = function(req, res) {
    var imagen = null;
    var filename = null;
    var ext = null;

    if (!req.body.idInforme) {
        sendJsonResponse(res, 400, {
            'message': 'missing idInforme'
        });
        return;
    }


    if (req.body.imagen || req.body.imagen.src) {
        imagen = req.body.imagen.src ? req.body.imagen.src : req.body.imagen;
    }

    if (imagen) {
        var matches = imagen.match(/^data:.+\/(.+);base64,(.*)$/);
        ext = matches && matches.length == 3 ? matches[1] : 'png';
        var data = matches && matches.length == 3 ? matches[2] : imagen;

        filename = req.body.idInforme + '-' + crypto.randomBytes(4).readUInt32LE(0);

        fs.writeFileSync(publicFolder + imageFolder + filename + '.' + ext, new Buffer(data, 'base64'));

        im.resize({
            srcPath: publicFolder + imageFolder + filename + '.' + ext,
            dstPath: publicFolder + imageFolder + thumbFolder + filename + '.' + ext,
            width: 200
        }, function(err, stdout, stderr) {
            if (err || stdout || stderr) {
                sendJsonResponse(res, 500, err);
                return;
            }
        });
    }

    Foto.create({
        idInforme: req.body.idInforme,
        filename: filename,
        ext: ext,
        descripcion: req.body.descripcion,
        tags: req.body.tags,
        syncTime: req.body.syncTime
    }, function(err, foto) {
        if (err) {
            sendJsonResponse(res, 400, err);
            return;
        } else {
            sendJsonResponse(res, 201, foto);
            return;
        }
    });
};
}());
;(function() {
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var FotoSchema = new Schema({
    idInforme: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    ext: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
        default: []
    },
    syncTime: String
});

FotoSchema.plugin(autoIncrement.plugin, {
    model: 'Foto',
    field: 'sequence',
    startAt: 1
});
module.exports = mongoose.model('Foto', FotoSchema);
}());
;(function() {
'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('GET /lab/fotos', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/lab/fotos')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});
}());
;(function() {

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
;(function() {
'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var CalculosEnvolventeSchema = new Schema({
  informe: {type:Schema.Types.ObjectId, ref: 'Informe'},
  alturaSegura: Number,
  promedioZC: Number,
  minimoZC: Number,
  maximoZC: Number,
  nominalZC: Number,
  perdidaZC: Number,
  corrosionZC: Number,
  vidaZC: Number,
  promedioEn: Number,
  minimoEn: Number,
  maximoEn: Number,
  nominalEn: Number,
  perdidaEn: Number,
  corrosionEn: Number,
  vidaEn: Number,
  promedioCa: Number,
  minimoCa: Number,
  maximoCa: Number,
  nominalCa: Number,
  perdidaCa: Number,
  corrosionCa: Number,
  vidaCa: Number
});

module.exports = mongoose.model('CalculosEnvolvente', CalculosEnvolventeSchema);}());
;(function() { 
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CalculosEspesoresSchema = new Schema({
  informe: {type:Schema.Types.ObjectId, ref: 'Informe'},
  unidad: String,
  h: String,
  d: String,
  s: String,
  e: String,
  tmin: String,
  tc: String,
  tmedido: String,
  tasa: String,
  vida: String,
  alturaSegura: String
});
//(H: Altura - D: Diámetro - G*: Densidad - S*: Tens.Fluencia - E*: Factor Junta.)
module.exports = mongoose.model('CalculosEspesores', CalculosEspesoresSchema);
}());
;(function() { 
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EspesoresAccesoriosSchema = new Schema({
  informe: {type:Schema.Types.ObjectId, ref: 'Informe'},
  accesorio: String,
  diametro: String,
  medicion0: String,
  medicion90: String,
  medicion180: String,
  medicion270: String,
  promedio: String,
  minimo: String,
  maximo: String,
  nominal: String,
  retiro: String,
  perdida: String,
  corrosion: String,
  vida: String,
  observaciones: String
});

module.exports = mongoose.model('EspesoresAccesorios', EspesoresAccesoriosSchema);
}());
;(function() {
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EspesoresAsentamientoSchema = new Schema({
  informe: {type:Schema.Types.ObjectId, ref: 'Informe'},
  estacion: Number,
  medicion: String,
  observaciones: String,
  relativo: String,
  angulo: String,
  coseno: String,
  diferencial: String,
  syy: String,
  see: String,
  syysee: String,
  k: String
});

module.exports = mongoose.model('EspesoresAsentamiento', EspesoresAsentamientoSchema);
}());
;(function() {
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EspesoresCabezalesSchema = new Schema({
  informe: {type:Schema.Types.ObjectId, ref: 'Informe'},
  lado: String,
  generatriz: String,
  medicion1: String,
  medicion2: String,
  medicion3: String,
  medicion4: String,
  medicion5: String,
  medicion6: String
});

module.exports = mongoose.model('EspesoresCabezales', EspesoresCabezalesSchema);}());
;(function() {
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EspesoresCunasSchema = new Schema({
  informe: {type:Schema.Types.ObjectId, ref: 'Informe'},
  cuna: String,
  punto: String,
  medicion1: String,
  medicion2: String,
  medicion3: String,
  medicion4: String,
  medicion5: String,
  medicion6: String,
  medicion7: String,
  medicion8: String,
  medicion9: String,
  medicion10: String,
  medicion11: String,
  medicion12: String,
  medicion13: String,
  medicion14: String,
  medicion15: String,
  medicion16: String,
  medicion17: String,
  medicion18: String,
  medicion19: String,
  medicion20: String,
  medicion21: String,
  medicion22: String,
  medicion23: String,
  medicion24: String,
  medicion25: String,
  medicion26: String,
  medicion27: String,
  medicion28: String,
  medicion29: String,
  medicion30: String,
  medicion31: String,
  medicion32: String
});

module.exports = mongoose.model('EspesoresCunas', EspesoresCunasSchema);
}());
;(function() {
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EspesoresEnvolventeSchema = new Schema({
  informe: {type:Schema.Types.ObjectId, ref: 'Informe'},
  virola: Number,
  generatriz: Number,
  medicion1: String,
  medicion2: String,
  medicion3: String,
  medicion4: String,
  medicion5: String,
  medicion6: String,
  promedio: String,
  minimo: String,
  maximo: String,
  nominal: String,
  perdida: String,
  corrosion: String,
  vida: String
});

module.exports = mongoose.model('EspesoresEnvolvente', EspesoresEnvolventeSchema);
}());
;(function() {
'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var EspesoresPisoSchema = new Schema({
  informe: {type:Schema.Types.ObjectId, ref: 'Informe'},
  chapa: Number,
  medicion1: String,
  medicion2: String,
  medicion3: String,
  medicion4: String,
  medicion5: String,
  medicion6: String,
  promedio: String,
  minimo: String,
  maximo: String,
  nominal: String,
  perdida: String,
  corrosion: String,
  vida: String
});

module.exports = mongoose.model('EspesoresPiso', EspesoresPisoSchema);
}());
;(function() {
'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var EspesoresTechoSchema = new Schema({
  informe: {type:Schema.Types.ObjectId, ref: 'Informe'},
  chapa: Number,
  medicion1: String,
  medicion2: String,
  medicion3: String,
  medicion4: String,
  medicion5: String,
  medicion6: String,
  promedio: String,
  minimo: String,
  maximo: String,
  nominal: String,
  perdida: String,
  corrosion: String,
  vida: String
});

module.exports = mongoose.model('EspesoresTecho', EspesoresTechoSchema);
}());
;(function() {
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
;(function() {
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
;(function() {
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var InformeSchema = new Schema({
    informeCampoDetails: {
        idTanque: String,
        cit: String,
        fechaHora: Date,
        syncTime: String,
        operador: String,
        inspector: String,
        calle: String,
        localidad: String,
        provincia: String,
        tipoTanque: String,
        tipoInspeccion: String,
        volumen: String,
        entidadAuditora: String,
        anoFabricacion: String,
        orientacionLadoA: String,
        orientacionLadoB: String
    },

    primeraSeccion: {
        perimetro: Number,
        altura: Number,
        tienePlacaTk: Boolean,
        tieneNumero: Boolean,
        tieneCapacidadNominal: Boolean,
        tieneProductoAlmacenado: Boolean,
        tieneLogoOperador: Boolean,
        tieneHormigonArmado: Boolean,
        tieneIdentificadorRiesgo: Boolean,
        tieneCartaConversion: Boolean,
        tienePestaniaPiso: Boolean,
        tieneTalonBituminoso: Boolean,
        tieneAnclajes: Boolean,
        tieneMamposteria: Boolean,
        tieneAceroHierro: Boolean,
        tieneNumeroObservaciones: String,
        tienePlacaTkObservaciones: String,
        tieneIdentificadorRiesgoObservaciones: String,
        tieneCartaConversionObservaciones: String,
        tieneProductoAlmacenadoObservaciones: String,
        tieneCapacidadNominalObservaciones: String,
        tieneLogoOperadorObservaciones: String,
        tienePestaniaPisoObservaciones: String,
        tieneTalonBituminosoObservaciones: String,
        tieneHormigonArmadoObservaciones: String,
        tieneAnclajesObservaciones: String,
        alturaObservaciones: String,
        perimetroObservaciones: String,
        mamposteriaObservaciones: String,
        aceroHierroObservaciones: String
    },
    segundaSeccion: {
        tieneSoldaduras: Boolean,
        tieneGlobos: Boolean,
        tieneMedidorNivelPared: Boolean,
        tieneBocaLimpieza: Boolean,
        tieneBocaHombre: Boolean,
        tieneHundimientos: Boolean,
        tieneSuccion: Boolean,
        tieneCarga: Boolean,
        tieneDrenaje: Boolean,
        tieneTelemedicion: Boolean,
        tienePintura: Boolean,
        metodoCalefaccion: String,
        tienePinturaObservaciones: String,
        tieneTelemedicionObservaciones: String,
        tieneDrenajeObservaciones: String,
        tieneCargaObservaciones: String,
        tieneSuccionObservaciones: String,
        tieneMedidorNivelParedObservaciones: String,
        tieneBocaHombreObservaciones: String,
        tieneBocaLimpiezaObservaciones: String,
        tieneHundimientosObservaciones: String,
        tieneGlobosObservaciones: String,
        tieneSoldadurasObservaciones: String,
        cantidadChapasVirola: Number,
        cantidadVirolas: Number
    },
    terceraSeccion: {
        tieneTecho: Boolean,
        tipoTecho: String,
        tieneChapasTecho: Boolean,
        tieneSellos: Boolean,
        tieneRespiradores: Boolean,
        tieneBocaHombreTecho: Boolean,
        tieneMedidorNivel: Boolean,
        tieneCanieria: Boolean,
        tieneVenteos: Boolean,
        tieneValvulas: Boolean,
        tieneSuccion: Boolean,
        tieneControlNivel: Boolean,
        tieneTelemedicion: Boolean,
        succionObservaciones: String,
        controlNivelObservaciones: String,
        tieneBarandaPerimetral: String,
        pinturaObservaciones: String,
        tipoTechoObservaciones: String,
        chapasTechoObservaciones: String,
        sellosObservaciones: String,
        respiradoresObservaciones: String,
        bocaHombreTechoObservaciones: String,
        medidorNivelObservaciones: String,
        canieriaObservaciones: String,
        venteosObservaciones: String,
        valvulasObservaciones: String,
        telemedicionObservaciones: String,
        tieneProteccionCatodica: Boolean,
        tieneTomasTierra: Boolean,
        tienePararrayos: Boolean,
        proteccionCatodicaObservaciones: String,
        tomasTierraObservaciones: String,
        pararrayosObservaciones: String,
        tieneChapasPiso: Boolean,
        tieneFlujoMagnetico: Boolean,
        tieneEmisionAcustica: Boolean,
        chapasPisoObservaciones: String,
        flujoMagneticoObservaciones: String,
        emisionAcusticaObservaciones: String,
        tienePoncho: Boolean,
        ponchoObservaciones: String,
        tienePintura: Boolean,
        tieneSuccionA: Boolean,
        tieneSuccionB: Boolean,
        tieneMedidorNivelA: Boolean,
        tieneMedidorNivelB: Boolean,
        tieneCargaB: Boolean,
        medidorNivelAObservaciones: String,
        medidorNivelBObservaciones: String,
        succionAObservaciones: String,
        succionBObservaciones: String,
        cargaBObservaciones: String,
        tieneBocaMedicion: Boolean,
        bocaMedicionObservaciones: String
    },
    cuartaSeccion: {
        tienePlataforma: Boolean,
        tienePeldanios: Boolean,
        tieneMetodoRecuperacion: Boolean,
        tieneDescansos: Boolean,
        tieneBaranda: Boolean,
        plataformaObservaciones: String,
        peldaniosObservaciones: String,
        descansosObservaciones: String,
        tieneBarandaObservaciones: String,
        tieneRecintoCompartido: Boolean,
        tieneDrenajesRecinto: Boolean,
        tieneIluminacionRecinto: Boolean,
        largoRecinto: Number,
        anchoRecinto: Number,
        altoRecinto: Number,
        recintoCompartidoObservaciones: String,
        recintoIluminacionObservaciones: String,
        recintoDrenajesObservaciones: String,
        metodoRecuperacionObservaciones: String,
        tieneRampas: Boolean,
        cantidadRampas: Number,
        tieneRampaPasarela: Boolean,
        tieneRampaEscalones: Boolean,
        tieneRampaIluminacion: Boolean,
        rampaCantidadObservaciones: String,
        rampaPasarelaObservaciones: String,
        tieneRampaEscalonesObservaciones: String,
        tieneRampaIluminacionObservaciones: String
    },
    quintaSeccion: {
        tieneFlotante: Boolean,
        tieneAlambre: Boolean,
        tieneGuiasAlambre: Boolean,
        flotanteObservaciones: String,
        alambreObservaciones: String,
        tieneGuiasAlambreObservaciones: String,
        tieneMantenimientoTanque: Boolean,
        tieneMantenimientoCanierias: Boolean,
        tieneMantenimientoRecinto: Boolean,
        tieneInpeccionesAnteriores: Boolean,
        mantenimientoTanqueObservaciones: String,
        mantenimientoCanieriasObservaciones: String,
        mantenimientoRecintoObservaciones: String,
        tieneInspeccionesAnterioresObservaciones: String,
        tipoInspeccion: String,
        caracteristicaTanque: String,
        latitud: Number,
        longitud: Number
    },
    sextaSeccion: {
        tieneExtintores10K: Boolean,
        tieneExtintores50K: Boolean,
        tieneEspumigeno: Boolean,
        tieneRociadores: Boolean,
        tieneHidrantes: Boolean,
        tieneLanzas: Boolean,
        tieneBaldes: Boolean,
        tieneServicioPropioBomberos: Boolean,
        extintores10KObservaciones: String,
        extintores50KObservaciones: String,
        espumigenoObservaciones: String,
        rociadoresObservaciones: String,
        hidrantesObservaciones: String,
        lanzasObservaciones: String,
        servicioPropioBomberosObservaciones: String,
        baldesObservaciones: String,
        extintores10KClase: String,
        extintores50KClase: String,
        extintores10KCantidad: Number,
        lanzasCantidad: Number,
        extintores50KCantidad: Number,
        rociadoresCantidad: Number,
        espumigenoCantidad: Number,
        hidrantesCantidad: Number,
        extintores10KClaseObservaciones: String,
        extintores50KClaseObservaciones: String,
        extintores10KCantidadObservaciones: String,
        extintores50KCantidadObservaciones: String,
        observacionesGenerales: String,
        lanzasCantidadObservaciones: String,
        espumigenoCantidadObservaciones: String,
        rociadoresCantidadObservaciones: String,
        hidrantesCantidadObservaciones: String
    },
    active: {
        type: Boolean,
        default: true
    },
    empresa: {
        type: Schema.Types.ObjectId,
        ref: 'Empresa'
    },
    codigoEmpresa: {
        type: String,
        uppercase: true
    },
    ordenCompra: String,
    contrato: String,
    asentamientoDetails: {
        moduloElastico: Number,
        tensionFluencia: Number,
        distanciaEntrePuntos: Number,
        defleccionPermitida: Number,
        defleccionMedida: Number,
        factorK: Number,
        defleccionPermitida2: Number,
        defleccionMedida2: Number,
        sarcCurva1: Number,
        sarcCurva2: Number,
        sarcCurva3: Number,
        defleccionMedidaCurva1: Number,
        defleccionMedidaCurva2: Number,
        defleccionMedidaCurva3: Number,
        medInicialCurva1: Number,
        medMinimoCurva1: Number,
        medFinalCurva1: Number,
        disInicialCurva1: Number,
        disMinimoCurva1: Number,
        disFinalCurva1: Number,
        medInicialCurva2: Number,
        medMinimoCurva2: Number,
        medFinalCurva2: Number,
        disInicialCurva2: Number,
        disMinimoCurva2: Number,
        disFinalCurva2: Number,
        medInicialCurva3: Number,
        medMinimoCurva3: Number,
        medFinalCurva3: Number,
        disInicialCurva3: Number,
        disMinimoCurva3: Number,
        disFinalCurva3: Number
    },
    espesoresDetails: {
        densidadProducto: Number
    }
});
InformeSchema.plugin(autoIncrement.plugin, {
    model: 'Informe',
    field: 'sequence',
    startAt: 1
});
module.exports = mongoose.model('Informe', InformeSchema);
}());
;(function() {
'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('GET /lab/informes', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/lab/informes')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});
}());
;(function() {
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MedicionesAlturaVirolasSchema = new Schema({
    informe: {type: Schema.Types.ObjectId, ref: 'Informe'},
    numeroVirola: String,
    alto: String
});

module.exports = mongoose.model('MedicionesAlturaVirolas', MedicionesAlturaVirolasSchema);
}());
;(function() {
'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var MedicionesChapaSchema = new Schema({
	informe: {
		type: Schema.Types.ObjectId,
		ref: 'Informe'
	},
	numeroChapa: {
		type: String,
		required: true
	},
	numeroVirola: {
		type: String,
		required: true
	},
	largo: {
		type: String,
		required: true
	},
	ancho: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model('MedicionesChapa', MedicionesChapaSchema);
}());
;(function() {
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ObservacionesMFLSchema = new Schema({
  informe: {type:Schema.Types.ObjectId, ref: 'Informe'},
  pasada: Number,
  chapa: Number,
  acceso: Boolean,
  amolado: Boolean,
  corrosion: Boolean,
  deformacion: Boolean,
  perforacion: Boolean,
  otra: Boolean,
  puntosoldadura: Boolean,
  observaciones: String
});

module.exports = mongoose.model('ObservacionesMFL', ObservacionesMFLSchema);
}());
;(function() {
'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.hasRole('admin'), controller.changePassword);
router.get('/:id', auth.hasRole('admin'), controller.show);
router.post('/', auth.hasRole('admin'), controller.create);
module.exports = router;
}());
;(function() {
'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var UsuarioEmpresaModel = require('../usuarioempresa/usuarioempresa.model');

var validationError = function(res, err) {
  return res.json(422, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.send(500, err);
    res.json(200, users);
  });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  //newUser.role = 'user';
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    res.json(user.profile);
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.send(500, err);

    //Borro las relaciones que hay entre usuarios/empresas
    UsuarioEmpresaModel.find({usuario:req.params.id}, function (err, empresasusuario) {
      if(err) {
        console.log('ERROR RECUPERANDO LAS RELACIONES ENTRE EMPRESAS Y USUARIO '+err);
      }
      if(!empresasusuario) {
        console.log('EL USUARIO A ELIMINAR NO TIENE RELACIONES CON EMPRESAS');
      }
      for (var index = 0; index < empresasusuario.length; ++index) {
        console.log('ELIMINO RELACION EMPRESA/USUARIO');
        removeEmpresaUsuario(empresasusuario[index]);
      }
    });

    return res.send(204);
  });
};

function removeEmpresaUsuario(empresaUsuario){
  empresaUsuario.remove(function(err) {
    if(err) {
      console.log('ERROR ELIMINANDO LA RELACION ENTRE EMPRESAS Y USUARIO '+err);
    }
  });
}

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user);
  });
};

exports.syncTokenRequest = function(req, res, next) {
  console.log(req.body);
  var email = String(req.body.email);
  var pass = String(req.body.password);

  User.findOne({
    email: email
  }, function(err, user) {
    if (err) {
      return next(err);
    }

    if (!user) {
     return res.send(404);
    }

    if (!user.authenticate(pass)) {
      res.setHeader('WWW-Authenticate', 'user:pass incorrect');
      return res.send(401);
    } else {
      var token = jwt.sign({_id: user._id }, config.secrets.mobileAuthToken, { expiresInMinutes: 1 });
      return res.json({
        email: user.email,
        name: user.name,
        token: token
      });
    }
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
}());
;(function() {
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var autoIncrement = require('mongoose-auto-increment');

var UserSchema = new Schema({
  name: String,
  direccion: String,
  telefono: String,
  contacto: String,
  image: {  type: String, default: 'assets/images/account_circle_black.png' },
  email: { type: String, lowercase: true, index: { unique: true } },
  role: {
    type: String,
    default: 'user'
  },
  hashedPassword: String,
  provider: String,
  salt: String,
  active: {type: Boolean, default: true}
});

/**
 * Virtuals
 */
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      'name': this.name,
      'direccion' : this.direccion,
      'telefono' : this.telefono,
      'contacto' : this.contacto,
      'image' : this.image,
      'email' : this.email,
      'role': this.role
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function() {
    return {
      '_id': this._id
      //,'role': this.role
    };
  });

/**
 * Validations
 */

// Validate empty email
UserSchema
  .path('email')
  .validate(function(email) {
    return email.length;
  }, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('hashedPassword')
  .validate(function(hashedPassword) {
    return hashedPassword.length;
  }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({email: value}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The specified email address is already in use.');

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function(next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.hashedPassword))
      next(new Error('Invalid password'));
    else
      next();
  });

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};

UserSchema.plugin(autoIncrement.plugin, {
  model: 'User',
  field: 'sequence',
  startAt: 1
});
module.exports = mongoose.model('User', UserSchema);
}());
;(function() {
'use strict';

var should = require('should');
var app = require('../../app');
var User = require('./user.model');

var user = new User({
  provider: 'local',
  name: 'Fake User',
  email: 'test@test.com',
  password: 'password'
});

describe('User Model', function() {
  before(function(done) {
    // Clear users before testing
    User.remove().exec().then(function() {
      done();
    });
  });

  afterEach(function(done) {
    User.remove().exec().then(function() {
      done();
    });
  });

  it('should begin with no users', function(done) {
    User.find({}, function(err, users) {
      users.should.have.length(0);
      done();
    });
  });

  it('should fail when saving a duplicate user', function(done) {
    user.save(function() {
      var userDup = new User(user);
      userDup.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  it('should fail when saving without an email', function(done) {
    user.email = '';
    user.save(function(err) {
      should.exist(err);
      done();
    });
  });

  it("should authenticate user if password is valid", function() {
    return user.authenticate('password').should.be.true;
  });

  it("should not authenticate user if password is invalid", function() {
    return user.authenticate('blah').should.not.be.true;
  });
});
}());
;(function() {
'use strict';

var express = require('express');
var controller = require('./usuarioempresa.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:idEmpresa', auth.hasRole('admin'), controller.getUsuariosEmpresa);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
}());
;(function() {
'use strict';

var _ = require('lodash');
var Usuarioempresa = require('./usuarioempresa.model');

// Get list of usuarioempresas
exports.index = function(req, res) {
  Usuarioempresa.find(function (err, usuarioempresas) {
    if(err) { return handleError(res, err); }
    return res.json(200, usuarioempresas);
  }).populate('empresa').populate('usuario');
};

exports.getUsuariosEmpresa = function(req, res) {
  Usuarioempresa.find({empresa:req.params.idEmpresa}, function (err, usuariosempresa) {
    if(err) {
      console.log('ERROR '+err+req.params.idEmpresa);
      return handleError(res, err);
    }
    if(!usuariosempresa) {
      return res.send(404);
    }
    var usuarios = [];
    for (var index = 0; index < usuariosempresa.length; ++index) {
      try {
      var usuario = { name: usuariosempresa[index].usuario.name,
                      email: usuariosempresa[index].usuario.email,
                      _id: usuariosempresa[index].usuario._id,
                      idEmpresa: usuariosempresa[index]._id,
                      image: usuariosempresa[index].usuario.image
                    };
      usuarios.push(usuario);
	}
      catch (e){
      }
    }

    return res.json(usuarios);
  }).populate('usuario');
};

// Get a single usuarioempresa
/*exports.show = function(req, res) {
  Usuarioempresa.findById(req.params.id, function (err, usuarioempresa) {
    if(err) { return handleError(res, err); }
    if(!usuarioempresa) { return res.send(404); }
    return res.json(usuarioempresa);
  }).populate('empresa').populate('usuario');
};*/

// Creates a new usuarioempresa in the DB.
exports.create = function(req, res) {
  Usuarioempresa.create(req.body, function(err, usuarioempresa) {
    if(err) { return handleError(res, err); }
    return res.json(201, usuarioempresa);
  });
};

// Updates an existing usuarioempresa in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Usuarioempresa.findById(req.params.id, function (err, usuarioempresa) {
    if (err) { return handleError(res, err); }
    if(!usuarioempresa) { return res.send(404); }
    var updated = _.merge(usuarioempresa, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, usuarioempresa);
    });
  });
};

// Deletes a usuarioempresa from the DB.
exports.destroy = function(req, res) {
  Usuarioempresa.findById(req.params.id, function (err, usuarioempresa) {
    if(err) { return handleError(res, err); }
    if(!usuarioempresa) { return res.send(404); }
    usuarioempresa.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
}());
;(function() {
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UsuarioempresaSchema = new Schema({
  empresa: {type:Schema.Types.ObjectId, ref: 'Empresa'},
  usuario: {type:Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Usuarioempresa', UsuarioempresaSchema);
}());
;(function() {
'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('GET /lab/usuariosempresas', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/lab/usuariosempresas')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});
}());
