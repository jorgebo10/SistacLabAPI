(function() {
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
    Contrato.find(function(err, contratos) {
      if (err) {
        return handleError(res, err);
      }
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
    Contrato.findById(req.params.id, function(err, contrato) {
      if (err) {
        sistacLoggerError.error('ERROR AL BUSCAR CONTRATO ' + req.params.id + ' - ' + err);
        return handleError(res, err);
      }
      if (!contrato) {
        return res.send(404);
      }
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

          }).sort({
            'certificado': 1
          });
        } else {
          return res.json(contrato);
        }

      }).populate('informe');
    });
  };

  // Creates a new contrato in the DB.
  exports.create = function(req, res) {
    Contrato.create(req.body, function(err, contrato) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(201, contrato);
    });
  };

  // Updates an existing contrato in the DB.
  exports.update = function(req, res) {
    if (req.body._id) {
      delete req.body._id;
    }
    Contrato.findById(req.params.id, function(err, contrato) {
      if (err) {
        return handleError(res, err);
      }
      if (!contrato) {
        return res.send(404);
      }
      var updated = _.merge(contrato, req.body);
      updated.save(function(err) {
        if (err) {
          return handleError(res, err);
        }
        return res.json(200, contrato);
      });
    });
  };

  // Deletes a contrato from the DB.
  exports.destroy = function(req, res) {
    Contrato.findById(req.params.id, function(err, contrato) {
      if (err) {
        return handleError(res, err);
      }
      if (!contrato) {
        return res.send(404);
      }
      contrato.remove(function(err) {
        if (err) {
          return handleError(res, err);
        }
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
              informe.save(function(err3) {
                if (err3) {
                  sistacLoggerError.error('Error al actualizar el contrato en el Informe ' + err3);
                }
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
      Contrato.findById(req.params.id, function(err, contrato) {
        if (err) {
          sistacLoggerError.error('ERROR AL BUSCAR CONTRATO ' + req.params.id + ' - ' + err);
          return handleError(res, err);
        }
        if (!contrato) {
          return res.send(404);
        }
        ContratoInformeHistoricoModel.find({
          contrato: contrato._id,
          certificado: {
            $lte: req.params.certificado
          }
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
        }).populate('informe').sort({
          'certificado': 1
        });
      });
    } catch (e) {
      sistacLoggerError.error('Error al generar reporte de Contrato - ' + e);
      res.send(500, {
        message: 'Error al generar reporte de Contrato ',
        err: e
      });
    }
  };

  function calcularValores(contrato) {
    //TODO realizar cálculos de certificado
    var informesAuxiliar = [];
    for (var index = 0; index < contrato.historicos.length; ++index) {

      var contratoInforme = contrato.historicos[index];

      contratoInforme.certificadoAnterior = contratoInforme.certificado - 1;

      var indexAux = getIndex(informesAuxiliar, contratoInforme.informe._id);
      if (indexAux == -1) {
        contratoInforme.valorAnterior = 0;
        contratoInforme.acumulado = 0;
      } else {
        contratoInforme.valorAnterior = informesAuxiliar[indexAux].valorAnterior;
        contratoInforme.acumulado = informesAuxiliar[indexAux].acumulado;
      }

      if (indexAux == -1) {
        informesAuxiliar.push({
          informe: contratoInforme.informe._id,
          valorAnterior: contratoInforme.valorActual,
          acumulado: contratoInforme.acumulado + contratoInforme.valorActual
        });
      } else {
        informesAuxiliar[indexAux].valorAnterior = contratoInforme.valorActual;
        informesAuxiliar[indexAux].acumulado = contratoInforme.acumulado + contratoInforme.valorActual;
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
      contratoInforme.informe.capacidad = (Math.PI * Math.pow((diametroMT / 2), 2) * Number(contratoInforme.informe.primeraSeccion.altura)).toFixed(2);
    }
  }

  function getIndex(list, id) {
    for (var index = 0; index < list.length; ++index) {
      if (list[index].informe == id) {
        return index;
      }
    }
    return -1;
  }

  function crearReporte(res, contrato, certificadoId) {

    //# Create a document
    var doc = new PDFDocument();
    doc.info.Title = 'Certificado';
    doc.info.Author = 'SisTAC';
    var separadorColumnas = '  ';
    var separadorTab = '   ';

    //Título
    doc.font('Times-Bold').fontSize(20).text('Contrato ' + contrato.contrato + ' - Certificado ' + certificadoId, {
      underline: true,
      align: 'center'
    });
    doc.lineWidth(125);
    doc.fontSize(15);
    doc.moveDown(2);

    //Registro O/C
    doc.font('Times-Bold').text('Registro O/C', {
      underline: true,
      paragraphGap: 3
    });
    doc.fontSize(12);
    doc.font('Times-Bold').text('O/C Contrato N°: ', {
      continued: true,
      paragraphGap: 1
    }).font('Times-Roman').text(getText(contrato.contrato));
    doc.font('Times-Bold').text('Fecha inicio: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getFecha(contrato.fechaInicio) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Fecha Fin: ', {
        continued: true
      }).font('Times-Roman').text(getFecha(contrato.fechaFin) + ' ');
    doc.font('Times-Bold').text('Nombre de Operador/Cliente: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getText(contrato.operador) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('CUIT: ', {
        continued: true
      }).font('Times-Roman').text(getText(contrato.cuit) + ' ');
    doc.font('Times-Bold').text('Domicilio de facturación: ', {
      continued: true,
      paragraphGap: 1
    }).font('Times-Roman').text(getText(contrato.domicilio));
    doc.fontSize(13);
    doc.font('Times-Bold').text('Referente Comercial', {
      underline: true,
      paragraphGap: 3
    });
    doc.fontSize(12);
    doc.font('Times-Bold').text(separadorTab + 'Nombre: ', {
      continued: true,
      paragraphGap: 1
    }).font('Times-Roman').text(getText(contrato.referenteComercial));
    doc.font('Times-Bold').text(separadorTab + 'Teléfono: ', {
      continued: true,
      paragraphGap: 1
    }).font('Times-Roman').text(getText(contrato.telefonoComercial));
    doc.font('Times-Bold').text(separadorTab + 'e-mail: ', {
      continued: true,
      paragraphGap: 1
    }).font('Times-Roman').text(getText(contrato.emailComercial));
    doc.fontSize(13);
    doc.font('Times-Bold').text('Referente Técnico', {
      underline: true,
      paragraphGap: 3
    });
    doc.fontSize(12);
    doc.font('Times-Bold').text(separadorTab + 'Nombre: ', {
      continued: true,
      paragraphGap: 1
    }).font('Times-Roman').text(getText(contrato.referenteTecnico));
    doc.font('Times-Bold').text(separadorTab + 'Teléfono: ', {
      continued: true,
      paragraphGap: 1
    }).font('Times-Roman').text(getText(contrato.telefonoTecnico));
    doc.font('Times-Bold').text(separadorTab + 'e-mail: ', {
      continued: true,
      paragraphGap: 1
    }).font('Times-Roman').text(getText(contrato.emailTecnico));
    doc.font('Times-Bold').text('Observaciones: ', {
      continued: true,
      paragraphGap: 1
    }).font('Times-Roman').text(getText(contrato.observaciones));

    var informesCertificado = getCertificado(contrato.historicos, certificadoId);
    doc.fontSize(15);
    doc.moveDown(2);
    doc.font('Times-Bold').text('Seguimiento general', {
      underline: true,
      paragraphGap: 3
    });
    doc.fontSize(12);
    for (var index = 0; index < informesCertificado.length; ++index) {
      var informeCert = informesCertificado[index];
      doc.font('Times-Bold').text('TAHH - ' + separadorColumnas, {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getText(informeCert.informe.informeCampoDetails.idTanque));
      doc.font('Times-Bold').text(separadorTab + 'Capacidad: ' + separadorColumnas, {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getText(informeCert.informe.capacidad) + ' mᶾ');
      doc.font('Times-Bold').text(separadorTab + 'CIT: ' + separadorColumnas, {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getText(informeCert.informe.informeCampoDetails.cit));
      doc.font('Times-Bold').text(separadorTab + 'Tipo de insp.: ' + separadorColumnas, {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getText(getTipoInsp(informeCert.informe.informeCampoDetails.tipoInspeccion)));
      doc.font('Times-Bold').text(separadorTab + 'Precio unitario: ' + separadorColumnas, {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getText(informeCert.precioUnitario));
      doc.font('Times-Bold').text(separadorTab + 'Certificado anterior: ' + separadorColumnas, {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getText(informeCert.certificadoAnterior));
      doc.font('Times-Bold').text(separadorTab + '% cer.: ' + separadorColumnas, {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getText(informeCert.porcentaje));
      doc.font('Times-Bold').text(separadorTab + 'Valor anterior: ' + separadorColumnas, {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getText(informeCert.valorAnterior));
      doc.font('Times-Bold').text(separadorTab + 'Valor actual: ' + separadorColumnas, {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getText(informeCert.valorActual));
      doc.font('Times-Bold').text(separadorTab + 'Valor acumulado: ' + separadorColumnas, {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getText(informeCert.acumulado));
      doc.font('Times-Bold').text(separadorTab + 'Fecha insp.: ' + separadorColumnas, {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getFecha(getText(informeCert.informe.informeCampoDetails.fechaHora)));
      doc.font('Times-Bold').text(separadorTab + 'Fecha próxima insp.: ' + separadorColumnas, {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getFecha(informeCert.fechaProximaInspeccion));
      doc.font('Times-Bold').text(separadorTab + 'Instalación: ' + separadorColumnas, {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getText(informeCert.instalacion));
      doc.font('Times-Bold').text(separadorTab + 'Auditor/es: ' + separadorColumnas, {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getText(informeCert.auditor));
      doc.font('Times-Bold').text(separadorTab + 'Fecha SEN: ' + separadorColumnas, {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getFecha(informeCert.fechaSEN));
      doc.font('Times-Bold').text(separadorTab + 'Estado: ' + separadorColumnas, {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getText(informeCert.estado));
      doc.font('Times-Bold').text(separadorTab + 'Observaciones: ' + separadorColumnas, {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getText(informeCert.observaciones));
      doc.moveDown(1);
    }

    doc.pipe(res);

    //# Finalize PDF file
    doc.end();

  }

  function getTipoInsp(tipo) {
    if (tipo === 'TANQUE_ABIERTO')
      return 'Tanque abierto';
    else if (tipo === 'TANQUE_CERRADO')
      return 'Tanque cerrado/E.A.';
    else
      return text;
  }

  function getText(text) {
    if (text === undefined || text === '' || text === 'NaN')
      return '<sin dato>';
    else
      return text;
  }

  function getFecha(fecha) {
    if (fecha === undefined)
      return '<sin dato>';
    else
      return String(fecha.getDate()) + '/' + String(fecha.getMonth() + 1) + '/' + String(fecha.getFullYear());
  }

  function getCertificado(historicos, certificadoId) {
    var informesCertificado = [];
    for (var index = 0; index < historicos.length; ++index) {
      if (historicos[index].certificado == certificadoId) {
        informesCertificado.push(historicos[index]);
      }
    }
    return informesCertificado;
  }
}());