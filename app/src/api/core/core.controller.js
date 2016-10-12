(function() {

  'use strict';

  var _ = require('lodash');
  var request = require('request');
  var Informe = require('../informe/informe.model');
  var nodemailer = require('nodemailer');
  var config = require('../../config/environment');
  var directTransport = require('nodemailer-direct-transport');
  var transporter = nodemailer.createTransport(directTransport({
    name: "sistemaglobal.com.ar",
    debug: false
  }));
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
        form: {
          privatekey: config.RECAPTCHA_PRIVATE_KEY,
          //need requestors ip address
          remoteip: req.connection.remoteAddress,
          challenge: contact.captcha.challenge,
          response: contact.captcha.response
        }
      },
      function(err, res, body) {
        //if the request to googles verification service returns a body which has false within it means server failed
        //validation, if it doesnt verification passed
        if (body.match(/false/) === null) {

          //Sending mail
          transporter.sendMail({
            from: 'sistac@sistemaglobal.com.ar',
            to: 'sistac@sistemaglobal.com.ar',
            subject: 'Contacto SisTAC',
            generateTextFromHTML: true,
            html: 'Nombre y apellido: <b>' + contact.nomYApe + '</b><br>' +
              'País: <b>' + contact.pais + '</b><br>' +
              'Empresa: <b>' + contact.empresa + '</b><br>' +
              'e-mail: <b>' + contact.mail + '</b><br>' +
              'Teléfono: <b>' + contact.telefono + '</b><br>' +
              'Mensaje: <b>' + contact.mensaje + '</b>'
          });
          sistacLoggerInfo.info('Enviando mail de contacto');
          response.send(200, 'Ok');
        } else {
          sistacLoggerError.error('Error al completar captcha - ' + err);
          response.send(500, {
            message: "Código verificador inválido.",
            err: err
          });
        }

      }
    );
  };

  exports.exportData = function(req, res) {
    try {
      Informe.findById(req.params.id, function(err, informe) {
        if (err) {
          sistacLoggerError.error('Error al obtener el informe: ' + informe.informeCampoDetails.idTanque);
          return handleError(res, err);
        }
        sistacLoggerInfo.info('Generando reporte de informe ' + informe.informeCampoDetails.idTanque);
        cargarInforme(informe, function(informeCompleto, error) {
          crearReporte(res, informeCompleto);
        });
      });
    } catch (e) {
      sistacLoggerError.error('Error al generar informe - ' + e);
      res.send(500, {
        message: "Error al generar informe",
        err: e
      });
    }

  };

  function cargarInforme(informe, callback) {
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

    MedicionesChapa.find({
      'informe': informe._id
    }, function(err, medicionesChapas) {
      if (err) {
        sistacLoggerError.error('Error al buscar las mediciones del informe ' + informe._id);
      }
      informe.medicionesChapas = medicionesChapas;
      EspesoresPiso.find({
        'informe': informe._id
      }, function(err, espesoresPiso) {
        if (err) {
          sistacLoggerError.error('Error al buscar los espesores de Piso del informe ' + informe._id);
        }
        informe.espesoresPiso = espesoresPiso;
        EspesoresEnvolvente.find({
          'informe': informe._id
        }, function(err, espesoresEnvolvente) {
          if (err) {
            sistacLoggerError.error('Error al buscar los espesores de Envolvente del informe ' + informe._id);
          }
          informe.espesoresEnvolvente = espesoresEnvolvente;
          EspesoresAsentamiento.find({
            'informe': informe._id
          }, function(err, espesoresAsentamiento) {
            if (err) {
              sistacLoggerError.error('Error al buscar los espesores de Asentamiento del informe ' + informe._id);
            }
            informe.espesoresAsentamiento = espesoresAsentamiento;
            EspesoresCabezales.find({
              'informe': informe._id
            }, function(err, espesoresCabezales) {
              if (err) {
                sistacLoggerError.error('Error al buscar los espesores de Cabezales del informe ' + informe._id);
              }
              informe.espesoresCabezales = espesoresCabezales;
              EspesoresAccesorios.find({
                'informe': informe._id
              }, function(err, espesoresAccesorios) {
                if (err) {
                  sistacLoggerError.error('Error al buscar los espesores de Accesorios del informe ' + informe._id);
                }
                informe.espesoresAccesorios = espesoresAccesorios;
                EspesoresCunas.find({
                  'informe': informe._id
                }, function(err, espesoresCunas) {
                  if (err) {
                    sistacLoggerError.error('Error al buscar los espesores de Cunas del informe ' + informe._id);
                  }
                  informe.espesoresCunas = espesoresCunas;
                  EspesoresTecho.find({
                    'informe': informe._id
                  }, function(err, espesoresTecho) {
                    if (err) {
                      sistacLoggerError.error('Error al buscar los espesores de Techo del informe ' + informe._id);
                    }
                    informe.espesoresTecho = espesoresTecho;
                    ObservacionesMFL.find({
                      'informe': informe._id
                    }, function(err, observacionesMFL) {
                      if (err) {
                        sistacLoggerError.error('Error al buscar las Observaciones MFL del informe ' + informe._id);
                      }
                      informe.observacionesMFL = observacionesMFL;
                      MedicionesAlturaVirolas.find({
                        'informe': informe._id
                      }, function(err, medicionesAlturaVirolas) {
                        if (err) {
                          sistacLoggerError.error('Error al buscar las mediciones en la altura de las virolas ' + informe._id);
                        }
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


  function crearReporte(res, informe) {

    function getBooleanLabelValue(value) {
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
    var esAbierto = informe.informeCampoDetails.tipoInspeccion == "TANQUE_ABIERTO"; // || informe.informeCampoDetails.tipoInspeccion == "TANQUE_ABIERTO_ELEVADO";
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
    if (esHorizontal) {
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
    doc.font('Times-Bold').fontSize(20).text('Informe de tanque ' + informe.informeCampoDetails.idTanque, {
      underline: true,
      align: 'center'
    });
    doc.lineWidth(125);
    doc.fontSize(15);
    doc.moveDown(2);

    //Cabecera
    doc.font('Times-Bold').text('Datos generales', {
      underline: true,
      paragraphGap: 3
    });
    doc.fontSize(12);
    doc.font('Times-Bold').text('ID Tanque: ', {
      continued: true,
      paragraphGap: 1
    }).font('Times-Roman').text(informe.informeCampoDetails.idTanque);
    doc.font('Times-Bold').text('CIT: ', {
      continued: true,
      paragraphGap: 1
    }).font('Times-Roman').text(informe.informeCampoDetails.cit);
    doc.font('Times-Bold').text('Tipo de tanque: ', {
      continued: true,
      paragraphGap: 1
    }).font('Times-Roman').text(informe.informeCampoDetails.tipoTanque);
    if (!esHorizontal)
      doc.font('Times-Bold').text('Tipo de tanque: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(informe.informeCampoDetails.tipoInspeccion);
    doc.font('Times-Bold').text('Volúmen: ', {
      continued: true,
      paragraphGap: 1
    }).font('Times-Roman').text(volumenLabel);
    doc.font('Times-Bold').text('Fecha y hora: ', {
      continued: true,
      paragraphGap: 1
    }).font('Times-Roman').text(informe.informeCampoDetails.fechaHora);
    doc.font('Times-Bold').text('Calle: ', {
      continued: true,
      paragraphGap: 1
    }).font('Times-Roman').text(informe.informeCampoDetails.calle);
    doc.font('Times-Bold').text('Localidad: ', {
      continued: true,
      paragraphGap: 1
    }).font('Times-Roman').text(informe.informeCampoDetails.localidad);
    doc.font('Times-Bold').text('Provincia: ', {
      continued: true,
      paragraphGap: 1
    }).font('Times-Roman').text(informe.informeCampoDetails.provincia);
    doc.font('Times-Bold').text('Entidad auditora: ', {
      continued: true,
      paragraphGap: 1
    }).font('Times-Roman').text(informe.informeCampoDetails.entidadAuditora);
    doc.font('Times-Bold').text('Inspector: ', {
      continued: true,
      paragraphGap: 1
    }).font('Times-Roman').text(informe.informeCampoDetails.inspector);
    doc.font('Times-Bold').text('Operador: ', {
      continued: true,
      paragraphGap: 1
    }).font('Times-Roman').text(informe.informeCampoDetails.operador);


    //Checklist
    doc.fontSize(15);
    doc.moveDown(2);
    doc.font('Times-Bold').text('Checklist', {
      underline: true,
      paragraphGap: 3
    });

    //Primera Sección
    //Identificación del tanque
    doc.fontSize(13);
    doc.font('Times-Bold').text('Identificación del tanque', {
      underline: true,
      paragraphGap: 2
    });
    doc.fontSize(12);
    doc.font('Times-Bold').text('Placa TK: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.primeraSeccion.tienePlacaTk) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.primeraSeccion.tienePlacaTkObservaciones + ' ');
    doc.font('Times-Bold').text('Número: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.primeraSeccion.tieneNumero) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.primeraSeccion.tieneNumeroObservaciones + ' ');
    doc.font('Times-Bold').text('Capacidad nominal: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.primeraSeccion.tieneCapacidadNominal) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.primeraSeccion.tieneCapacidadNominalObservaciones + ' ');
    doc.font('Times-Bold').text('Producto almacenado: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.primeraSeccion.tieneProductoAlmacenado) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.primeraSeccion.tieneProductoAlmacenadoObservaciones + ' ');
    doc.font('Times-Bold').text('Logo operador: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.primeraSeccion.tieneLogoOperador) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.primeraSeccion.tieneLogoOperadorObservaciones + ' ');
    doc.font('Times-Bold').text('Identificador de riesgo: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.primeraSeccion.tieneIdentificadorRiesgo) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.primeraSeccion.tieneIdentificadorRiesgoObservaciones + ' ');
    doc.font('Times-Bold').text('Carta conversión altura/volúmen: ', {
        continued: true,
        paragraphGap: 3
      }).font('Times-Roman').text(getBooleanLabelValue(informe.primeraSeccion.tieneCartaConversion) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.primeraSeccion.tieneCartaConversionObservaciones + ' ');
    //Datos técnicos
    doc.fontSize(13);
    doc.font('Times-Bold').text('Datos técnicos', {
      underline: true,
      paragraphGap: 2
    });
    doc.fontSize(12);
    doc.font('Times-Bold').text('Perímetro(mts.): ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(informe.primeraSeccion.perimetro + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.primeraSeccion.perimetroObservaciones + ' ');
    doc.font('Times-Bold').text(seccionDatoTecnicoAltura + '(mts.): ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(informe.primeraSeccion.altura + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.primeraSeccion.alturaObservaciones + ' ');
    doc.font('Times-Bold').text('Cantidad de virolas: ', {
      continued: true,
      paragraphGap: 3
    }).font('Times-Roman').text(informe.segundaSeccion.cantidadVirolas + separadorColumnas);
    //Cimientos
    doc.fontSize(13);
    doc.font('Times-Bold').text(seccionCimientos, {
      underline: true,
      paragraphGap: 2
    });
    doc.fontSize(12);
    if (!esHorizontal) {
      doc.font('Times-Bold').text('Tiene Pestaña piso: ', {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(getBooleanLabelValue(informe.primeraSeccion.tienePestaniaPiso) + separadorColumnas, {
          continued: true
        })
        .font('Times-Bold').text('Observaciones: ', {
          continued: true
        }).font('Times-Roman').text(informe.primeraSeccion.tienePestaniaPisoObservaciones + ' ');
      doc.font('Times-Bold').text('Tiene Talón Bituminoso: ', {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(getBooleanLabelValue(informe.primeraSeccion.tieneTalonBituminoso) + separadorColumnas, {
          continued: true
        })
        .font('Times-Bold').text('Observaciones: ', {
          continued: true
        }).font('Times-Roman').text(informe.primeraSeccion.tieneTalonBituminosoObservaciones + ' ');
    }
    doc.font('Times-Bold').text('Tiene Hormigón armado: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.primeraSeccion.tieneHormigonArmado) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.primeraSeccion.tieneHormigonArmadoObservaciones + ' ');
    if (!esHorizontal) {
      doc.font('Times-Bold').text('Tiene Anclajes: ', {
          continued: true,
          paragraphGap: 3
        }).font('Times-Roman').text(getBooleanLabelValue(informe.primeraSeccion.tieneAnclajes) + separadorColumnas, {
          continued: true
        })
        .font('Times-Bold').text('Observaciones: ', {
          continued: true
        }).font('Times-Roman').text(informe.primeraSeccion.tieneAnclajesObservaciones + ' ');
    } else {
      doc.font('Times-Bold').text('Tiene Acero/Hierro: ', {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(getBooleanLabelValue(informe.primeraSeccion.tieneAceroHierro) + separadorColumnas, {
          continued: true
        })
        .font('Times-Bold').text('Observaciones: ', {
          continued: true
        }).font('Times-Roman').text(informe.primeraSeccion.aceroHierroObservaciones + ' ');
      doc.font('Times-Bold').text('Tiene Mampostería: ', {
          continued: true,
          paragraphGap: 3
        }).font('Times-Roman').text(getBooleanLabelValue(informe.primeraSeccion.tieneMamposteria) + separadorColumnas, {
          continued: true
        })
        .font('Times-Bold').text('Observaciones: ', {
          continued: true
        }).font('Times-Roman').text(informe.primeraSeccion.mamposteriaObservaciones + ' ');
    }

    //Segunda Sección
    //Pared externa
    doc.fontSize(13);
    doc.font('Times-Bold').text('Pared externa', {
      underline: true,
      paragraphGap: 2
    });
    doc.fontSize(12);
    doc.font('Times-Bold').text('Soldaduras: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.segundaSeccion.tieneSoldaduras) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.segundaSeccion.tieneSoldadurasObservaciones + ' ');
    doc.font('Times-Bold').text('Globos: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.segundaSeccion.tieneGlobos) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.segundaSeccion.tieneGlobosObservaciones + ' ');
    doc.font('Times-Bold').text('Hundimientos: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.segundaSeccion.tieneHundimientos) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.segundaSeccion.tieneHundimientosObservaciones + ' ');
    if (!esHorizontal) {
      doc.font('Times-Bold').text('Boca de limpieza: ', {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(getBooleanLabelValue(informe.segundaSeccion.tieneBocaLimpieza) + separadorColumnas, {
          continued: true
        })
        .font('Times-Bold').text('Observaciones: ', {
          continued: true
        }).font('Times-Roman').text(informe.segundaSeccion.tieneBocaLimpiezaObservaciones + ' ');
    }
    doc.font('Times-Bold').text('Boca de hombre: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.segundaSeccion.tieneBocaHombre) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.segundaSeccion.tieneBocaHombreObservaciones + ' ');
    doc.font('Times-Bold').text('Medidor de nivel: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.segundaSeccion.tieneMedidorNivelPared) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.segundaSeccion.tieneMedidorNivelParedObservaciones + ' ');
    doc.font('Times-Bold').text('Succión: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.segundaSeccion.tieneSuccion) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.segundaSeccion.tieneSuccionObservaciones + ' ');
    doc.font('Times-Bold').text('Carga: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.segundaSeccion.tieneCarga) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.segundaSeccion.tieneCargaObservaciones + ' ');
    doc.font('Times-Bold').text('Drenaje: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.segundaSeccion.tieneDrenaje) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.segundaSeccion.tieneDrenajeObservaciones + ' ');
    if (!esHorizontal) {
      doc.font('Times-Bold').text('Telemedición: ', {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(getBooleanLabelValue(informe.segundaSeccion.tieneTelemedicion) + separadorColumnas, {
          continued: true
        })
        .font('Times-Bold').text('Observaciones: ', {
          continued: true
        }).font('Times-Roman').text(informe.segundaSeccion.tieneTelemedicionObservaciones + ' ');
    }
    if (!esHorizontal) {
      doc.font('Times-Bold').text('Pintura: ', {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(getBooleanLabelValue(informe.segundaSeccion.tienePintura) + separadorColumnas, {
          continued: true
        })
        .font('Times-Bold').text('Observaciones: ', {
          continued: true
        }).font('Times-Roman').text(informe.segundaSeccion.tienePinturaObservaciones + ' ');
      doc.font('Times-Bold').text('Calefacción: ', {
        continued: true,
        paragraphGap: 3
      }).font('Times-Roman').text(metodoCalefaccion);
    } else {
      doc.font('Times-Bold').text('Pintura: ', {
          continued: true,
          paragraphGap: 3
        }).font('Times-Roman').text(getBooleanLabelValue(informe.segundaSeccion.tienePintura) + separadorColumnas, {
          continued: true
        })
        .font('Times-Bold').text('Observaciones: ', {
          continued: true
        }).font('Times-Roman').text(informe.segundaSeccion.tienePinturaObservaciones + ' ');
    }
    //Medidas
    doc.fontSize(13);
    doc.font('Times-Bold').text('Chapas por virola', {
      underline: true,
      paragraphGap: 2
    });
    doc.fontSize(12);
    doc.font('Times-Bold').text(separadorTab + 'Cantidad: ', {
      continued: true,
      paragraphGap: 2
    }).font('Times-Roman').text(informe.medicionesChapas.length);
    for (var index = 0; index < informe.medicionesChapas.length; ++index) {
      doc.font('Times-Bold').text(separadorTab + 'Chapa ' + informe.medicionesChapas[index].numeroChapa + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman')
        .text('Largo: ' + informe.medicionesChapas[index].largo + separadorColumnas + 'Ancho: ' + informe.medicionesChapas[index].ancho);
    }

    //Tercera Sección
    //Techo
    doc.fontSize(13);
    doc.font('Times-Bold').text(seccionTecho, {
      underline: true,
      paragraphGap: 2
    });
    doc.fontSize(12);
    if (!esHorizontal) {
      doc.font('Times-Bold').text('Tipo: ', {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneTecho) + separadorColumnas, {
          continued: true
        })
        .font('Times-Roman').text(informe.terceraSeccion.tipoTecho + separadorColumnas)
        .font('Times-Bold').text('Observaciones: ', {
          continued: true
        }).font('Times-Roman').text(informe.terceraSeccion.tipoTechoObservaciones + ' ');
      doc.font('Times-Bold').text('Chapas: ', {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneChapasTecho) + separadorColumnas, {
          continued: true
        })
        .font('Times-Bold').text('Observaciones: ', {
          continued: true
        }).font('Times-Roman').text(informe.terceraSeccion.chapasTechoObservaciones + ' ');
      doc.font('Times-Bold').text('Sellos: ', {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneSellos) + separadorColumnas, {
          continued: true
        })
        .font('Times-Bold').text('Observaciones: ', {
          continued: true
        }).font('Times-Roman').text(informe.terceraSeccion.sellosObservaciones + ' ');
      doc.font('Times-Bold').text('Respiraderos: ', {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneRespiradores) + separadorColumnas, {
          continued: true
        })
        .font('Times-Bold').text('Observaciones: ', {
          continued: true
        }).font('Times-Roman').text(informe.terceraSeccion.respiradoresObservaciones + ' ');
    }
    doc.font('Times-Bold').text('Boca de hombre: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneBocaHombreTecho) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.terceraSeccion.bocaHombreTechoObservaciones + ' ');
    if (esHorizontal) {
      doc.font('Times-Bold').text('Boca de medición: ', {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneBocaMedicion) + separadorColumnas, {
          continued: true
        })
        .font('Times-Bold').text('Observaciones: ', {
          continued: true
        }).font('Times-Roman').text(informe.terceraSeccion.bocaMedicionObservaciones + ' ');
    }
    doc.font('Times-Bold').text('Succión: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneSuccion) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.terceraSeccion.succionObservaciones + ' ');
    doc.font('Times-Bold').text('Medidor de nivel: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneMedidorNivel) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.terceraSeccion.medidorNivelObservaciones + ' ');
    if (esHorizontal) {
      doc.font('Times-Bold').text('Control de nivel: ', {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneControlNivel) + separadorColumnas, {
          continued: true
        })
        .font('Times-Bold').text('Observaciones: ', {
          continued: true
        }).font('Times-Roman').text(informe.terceraSeccion.controlNivelObservaciones + ' ');
    }
    doc.font('Times-Bold').text('Cañería de carga: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneCanieria) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.terceraSeccion.canieriaObservaciones + ' ');
    doc.font('Times-Bold').text('Poncho: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tienePoncho) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.terceraSeccion.ponchoObservaciones + ' ');
    doc.font('Times-Bold').text('Venteos: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneVenteos) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.terceraSeccion.venteosObservaciones + ' ');
    doc.font('Times-Bold').text('Válvulas presión/vacío: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneValvulas) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.terceraSeccion.valvulasObservaciones + ' ');
    doc.font('Times-Bold').text('Pintura: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tienePintura) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.terceraSeccion.pinturaObservaciones + ' ');
    if (!esHorizontal) {
      doc.font('Times-Bold').text('Telemedición: ', {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneTelemedicion) + separadorColumnas, {
          continued: true
        })
        .font('Times-Bold').text('Observaciones: ', {
          continued: true
        }).font('Times-Roman').text(informe.terceraSeccion.telemedicionObservaciones + ' ');
      doc.font('Times-Bold').text('Baranda perimetral: ', {
        continued: true,
        paragraphGap: 3
      }).font('Times-Roman').text(barandaPerimetral);
      //Piso
      doc.fontSize(13);
      doc.font('Times-Bold').text('Piso', {
        underline: true,
        paragraphGap: 2
      });
      doc.fontSize(12);
      doc.font('Times-Bold').text('Chapas: ', {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneChapasPiso) + separadorColumnas, {
          continued: true
        })
        .font('Times-Bold').text('Observaciones: ', {
          continued: true
        }).font('Times-Roman').text(informe.terceraSeccion.chapasPisoObservaciones + ' ');
      doc.font('Times-Bold').text('Flujo magnético: ', {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneFlujoMagnetico) + separadorColumnas, {
          continued: true
        })
        .font('Times-Bold').text('Observaciones: ', {
          continued: true
        }).font('Times-Roman').text(informe.terceraSeccion.flujoMagneticoObservaciones + ' ');
      doc.font('Times-Bold').text('Emisión acústica: ', {
          continued: true,
          paragraphGap: 3
        }).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneEmisionAcustica) + separadorColumnas, {
          continued: true
        })
        .font('Times-Bold').text('Observaciones: ', {
          continued: true
        }).font('Times-Roman').text(informe.terceraSeccion.emisionAcusticaObservaciones + ' ');
    } else {
      doc.font('Times-Bold').text('Telemedición: ', {
          continued: true,
          paragraphGap: 3
        }).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneTelemedicion) + separadorColumnas, {
          continued: true
        })
        .font('Times-Bold').text('Observaciones: ', {
          continued: true
        }).font('Times-Roman').text(informe.terceraSeccion.telemedicionObservaciones + ' ');
      //Cabezales
      doc.fontSize(13);
      doc.font('Times-Bold').text('Cabezales', {
        underline: true,
        paragraphGap: 2
      });
      doc.fontSize(12);
      doc.font('Times-Bold').text(separadorTab + 'Frontal (A)', {
        paragraphGap: 1
      });
      doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medidor de nivel: ', {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.teneMedidorNivelA) + separadorColumnas, {
          continued: true
        })
        .font('Times-Bold').text('Observaciones: ', {
          continued: true
        }).font('Times-Roman').text(informe.terceraSeccion.medidorNivelAObservaciones + ' ');
      doc.font('Times-Bold').text(separadorTab + separadorTab + 'Succión: ', {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneSuccionA) + separadorColumnas, {
          continued: true
        })
        .font('Times-Bold').text('Observaciones: ', {
          continued: true
        }).font('Times-Roman').text(informe.terceraSeccion.succionAObservaciones + ' ');
      doc.font('Times-Bold').text(separadorTab + 'Posterior (B)', {
        paragraphGap: 1
      });
      doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medidor de nivel: ', {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneMedidorNivelB) + separadorColumnas, {
          continued: true
        })
        .font('Times-Bold').text('Observaciones: ', {
          continued: true
        }).font('Times-Roman').text(informe.terceraSeccion.medidorNivelBObservaciones + ' ');
      doc.font('Times-Bold').text(separadorTab + separadorTab + 'Succión: ', {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.teneSuccionB) + separadorColumnas, {
          continued: true
        })
        .font('Times-Bold').text('Observaciones: ', {
          continued: true
        }).font('Times-Roman').text(informe.terceraSeccion.succionBObservaciones + ' ');
      doc.font('Times-Bold').text(separadorTab + separadorTab + 'Carga: ', {
          continued: true,
          paragraphGap: 3
        }).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneCargaB) + separadorColumnas, {
          continued: true
        })
        .font('Times-Bold').text('Observaciones: ', {
          continued: true
        }).font('Times-Roman').text(informe.terceraSeccion.cargaBObservaciones + ' ');
    }
    //Protecciones
    doc.fontSize(13);
    doc.font('Times-Bold').text('Protecciones', {
      underline: true,
      paragraphGap: 2
    });
    doc.fontSize(12);
    doc.font('Times-Bold').text('Protección catódica: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneProteccionCatodica) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.terceraSeccion.proteccionCatodicaObservaciones + ' ');
    doc.font('Times-Bold').text('Tomas de tierra: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tieneTomasTierra) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.terceraSeccion.tomasTierraObservaciones + ' ');
    doc.font('Times-Bold').text('Pararrayos: ', {
        continued: true,
        paragraphGap: 3
      }).font('Times-Roman').text(getBooleanLabelValue(informe.terceraSeccion.tienePararrayos) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.terceraSeccion.pararrayosObservaciones + ' ');

    //Cuarta sección
    //Escalera del tanque
    doc.fontSize(13);
    doc.font('Times-Bold').text('Escalera del tanque', {
      underline: true,
      paragraphGap: 2
    });
    doc.fontSize(12);
    doc.font('Times-Bold').text('Plataforma: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.cuartaSeccion.tienePlataforma) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.cuartaSeccion.plataformaObservaciones + ' ');
    doc.font('Times-Bold').text('Peldaños: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.cuartaSeccion.tienePeldanios) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.cuartaSeccion.peldaniosObservaciones + ' ');
    doc.font('Times-Bold').text('Descansos: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.cuartaSeccion.tieneDescansos) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.cuartaSeccion.descansosObservaciones + ' ');
    doc.font('Times-Bold').text('Baranda: ', {
        continued: true,
        paragraphGap: 3
      }).font('Times-Roman').text(getBooleanLabelValue(informe.cuartaSeccion.tieneBaranda) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.cuartaSeccion.tieneBarandaObservaciones + ' ');
    //Recinto del tanque
    doc.fontSize(13);
    doc.font('Times-Bold').text('Recinto del tanque', {
      underline: true,
      paragraphGap: 2
    });
    doc.fontSize(12);
    doc.font('Times-Bold').text('Tipo recinto: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.cuartaSeccion.tieneRecintoCompartido) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.cuartaSeccion.recintoCompartidoObservaciones + ' ');
    doc.font('Times-Bold').text('Largo(mts.): ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(informe.cuartaSeccion.largoRecinto + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Ancho(mts.): ', {
        continued: true
      }).font('Times-Roman').text(informe.cuartaSeccion.anchoRecinto + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Alto(mts.): ', {
        continued: true
      }).font('Times-Roman').text(informe.cuartaSeccion.altoRecinto);
    doc.font('Times-Bold').text('Iluminación: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.cuartaSeccion.tieneIluminacionRecinto) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.cuartaSeccion.recintoIluminacionObservaciones + ' ');
    doc.font('Times-Bold').text('Drenajes: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.cuartaSeccion.tieneDrenajesRecinto) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.cuartaSeccion.recintoDrenajesObservaciones + ' ');
    doc.font('Times-Bold').text('Método de recuperación: ', {
        continued: true,
        paragraphGap: 3
      }).font('Times-Roman').text(getBooleanLabelValue(informe.cuartaSeccion.tieneMetodoRecuperacion) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.cuartaSeccion.metodoRecuperacionObservaciones + ' ');
    //Rampa de acceso
    doc.fontSize(13);
    doc.font('Times-Bold').text('Rampa de acceso', {
      underline: true,
      paragraphGap: 2
    });
    doc.fontSize(12);
    doc.font('Times-Bold').text('Rampa: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.cuartaSeccion.tieneRampas) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Cantidad: ', {
        continued: true
      }).font('Times-Roman').text(informe.cuartaSeccion.cantidadRampas + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.cuartaSeccion.rampaCantidadObservaciones + ' ');
    doc.font('Times-Bold').text('Pasarela: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.cuartaSeccion.tieneRampaPasarela) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.cuartaSeccion.rampaPasarelaObservaciones + ' ');
    doc.font('Times-Bold').text('Escalones: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.cuartaSeccion.tieneRampaEscalones) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.cuartaSeccion.tieneRampaEscalonesObservaciones + ' ');
    doc.font('Times-Bold').text('Iluminación: ', {
        continued: true,
        paragraphGap: 3
      }).font('Times-Roman').text(getBooleanLabelValue(informe.cuartaSeccion.tieneRampaIluminacion) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.cuartaSeccion.tieneRampaIluminacionObservaciones + ' ');

    //Quinta sección
    //Medidor de nivel
    doc.fontSize(13);
    doc.font('Times-Bold').text('Medidor de nivel', {
      underline: true,
      paragraphGap: 2
    });
    doc.fontSize(12);
    doc.font('Times-Bold').text('Flotante: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.quintaSeccion.tieneFlotante) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.quintaSeccion.flotanteObservaciones + ' ');
    doc.font('Times-Bold').text('Alambre: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.quintaSeccion.tieneAlambre) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.quintaSeccion.alambreObservaciones + ' ');
    doc.font('Times-Bold').text('Guías de alambre: ', {
        continued: true,
        paragraphGap: 3
      }).font('Times-Roman').text(getBooleanLabelValue(informe.quintaSeccion.tieneGuiasAlambre) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.quintaSeccion.tieneGuiasAlambreObservaciones + ' ');
    //Mantenimiento del tanque
    doc.fontSize(13);
    doc.font('Times-Bold').text('Mantenimiento del tanque', {
      underline: true,
      paragraphGap: 2
    });
    doc.fontSize(12);
    doc.font('Times-Bold').text('Mantenimiento del tanque: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.quintaSeccion.tieneMantenimientoTanque) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.quintaSeccion.mantenimientoTanqueObservaciones + ' ');
    doc.font('Times-Bold').text('Mantenimiento del cañerías: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.quintaSeccion.tieneMantenimientoCanierias) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.quintaSeccion.mantenimientoCanieriasObservaciones + ' ');
    doc.font('Times-Bold').text('Mantenimiento del recinto: ', {
        continued: true,
        paragraphGap: 3
      }).font('Times-Roman').text(getBooleanLabelValue(informe.quintaSeccion.tieneMantenimientoRecinto) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.quintaSeccion.mantenimientoRecintoObservaciones + ' ');
    //Tipo de tanque y coordenadas
    doc.fontSize(13);
    doc.font('Times-Bold').text('Tipo de tanque y coordenadas', {
      underline: true,
      paragraphGap: 2
    });
    doc.fontSize(12);
    doc.font('Times-Bold').text('Caracteristica del tanque: ', {
      continued: true,
      paragraphGap: 1
    }).font('Times-Roman').text(caracteristicaTanque);
    doc.font('Times-Bold').text('Latitud: ', {
        continued: true,
        paragraphGap: 3
      }).font('Times-Roman').text(informe.quintaSeccion.latitud + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Longitud: ', {
        continued: true
      }).font('Times-Roman').text(informe.quintaSeccion.longitud);

    //Sexta sección
    //Sistema contra incendio
    doc.fontSize(13);
    doc.font('Times-Bold').text('Sistema contra incendio', {
      underline: true,
      paragraphGap: 2
    });
    doc.fontSize(12);
    doc.font('Times-Bold').text('Extintores hasta 10Kg.: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.sextaSeccion.tieneExtintores10K) + separadorColumnas, {
        continued: true
      })
      .font('Times-Roman').text(informe.sextaSeccion.extintores10KClase + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Cantidad: ', {
        continued: true
      }).font('Times-Roman').text(informe.sextaSeccion.extintores10KCantidad + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.sextaSeccion.extintores10KObservaciones + ' ');
    doc.font('Times-Bold').text('Extintores hasta 50Kg.: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.sextaSeccion.tieneExtintores50K) + separadorColumnas, {
        continued: true
      })
      .font('Times-Roman').text(informe.sextaSeccion.extintores50KClase + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Cantidad: ', {
        continued: true
      }).font('Times-Roman').text(informe.sextaSeccion.extintores50KCantidad + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.sextaSeccion.extintores50KObservaciones + ' ');
    doc.font('Times-Bold').text('Espumígeno: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.sextaSeccion.tieneEspumigeno) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Cantidad: ', {
        continued: true
      }).font('Times-Roman').text(informe.sextaSeccion.espumigenoCantidad + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.sextaSeccion.espumigenoObservaciones + ' ');
    doc.font('Times-Bold').text('Rociadores: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.sextaSeccion.tieneRociadores) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Cantidad: ', {
        continued: true
      }).font('Times-Roman').text(informe.sextaSeccion.rociadoresCantidad + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.sextaSeccion.rociadoresObservaciones + ' ');
    doc.font('Times-Bold').text('Hidrantes: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.sextaSeccion.tieneHidrantes) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Cantidad: ', {
        continued: true
      }).font('Times-Roman').text(informe.sextaSeccion.hidrantesCantidad + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.sextaSeccion.hidrantesObservaciones + ' ');
    doc.font('Times-Bold').text('Lanzas: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.sextaSeccion.tieneLanzas) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Cantidad: ', {
        continued: true
      }).font('Times-Roman').text(informe.sextaSeccion.lanzasCantidad + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.sextaSeccion.lanzasObservaciones + ' ');
    doc.font('Times-Bold').text('Servicio propio de bomberos: ', {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(getBooleanLabelValue(informe.sextaSeccion.tieneServicioPropioBomberos) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.sextaSeccion.servicioPropioBomberosObservaciones + ' ');
    doc.font('Times-Bold').text('Tambor de arena, baldes: ', {
        continued: true,
        paragraphGap: 3
      }).font('Times-Roman').text(getBooleanLabelValue(informe.sextaSeccion.tieneBaldes) + separadorColumnas, {
        continued: true
      })
      .font('Times-Bold').text('Observaciones: ', {
        continued: true
      }).font('Times-Roman').text(informe.sextaSeccion.baldesObservaciones + ' ');
    //Observaciones generales
    doc.fontSize(13);
    doc.font('Times-Bold').text('Observaciones generales', {
      underline: true,
      paragraphGap: 2
    });
    doc.fontSize(12);
    doc.font('Times-Roman').text(informe.sextaSeccion.observacionesGenerales + ' ');


    //Piso
    if (!esHorizontal) {
      doc.fontSize(15);
      doc.moveDown(2);
      doc.font('Times-Bold').text('Registro de espesores(Piso)', {
        underline: true,
        paragraphGap: 3
      });
      doc.fontSize(12);
      for (index = 0; index < informe.espesoresPiso.length; ++index) {
        doc.font('Times-Bold').text(separadorTab + 'Chapa N° ' + informe.espesoresPiso[index].chapa, {
          paragraphGap: 1
        });
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 1' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresPiso[index].medicion1 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 2' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresPiso[index].medicion2 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 3' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresPiso[index].medicion3 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 4' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresPiso[index].medicion4 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 5' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresPiso[index].medicion5 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 6' + separadorColumnas, {
          continued: true,
          paragraphGap: 3
        }).font('Times-Roman').text(informe.espesoresPiso[index].medicion6 + 'mm.');
      }
    }


    //Envolvente
    doc.fontSize(15);
    doc.moveDown(2);
    doc.font('Times-Bold').text('Registro de espesores(Envolvente)', {
      underline: true,
      paragraphGap: 3
    });
    doc.fontSize(12);
    for (index = 0; index < informe.espesoresEnvolvente.length; ++index) {
      doc.font('Times-Bold').text(separadorTab + 'Virola ' + informe.espesoresEnvolvente[index].virola + separadorColumnas + 'Generatriz ' + informe.espesoresEnvolvente[index].generatriz, {
        paragraphGap: 1
      });
      doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 1' + separadorColumnas, {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(informe.espesoresEnvolvente[index].medicion1 + 'mm.');
      doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 2' + separadorColumnas, {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(informe.espesoresEnvolvente[index].medicion2 + 'mm.');
      doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 3' + separadorColumnas, {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(informe.espesoresEnvolvente[index].medicion3 + 'mm.');
      doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 4' + separadorColumnas, {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(informe.espesoresEnvolvente[index].medicion4 + 'mm.');
      doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 5' + separadorColumnas, {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(informe.espesoresEnvolvente[index].medicion5 + 'mm.');
      doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 6' + separadorColumnas, {
        continued: true,
        paragraphGap: 3
      }).font('Times-Roman').text(informe.espesoresEnvolvente[index].medicion6 + 'mm.');
    }


    //Asentamiento
    if (!esHorizontal && !esVolumenMenor) {
      doc.fontSize(15);
      doc.moveDown(2);
      doc.font('Times-Bold').text('Registro de espesores(Asentamiento)', {
        underline: true,
        paragraphGap: 3
      });
      doc.fontSize(12);
      for (index = 0; index < informe.espesoresAsentamiento.length; ++index) {
        doc.font('Times-Bold').text(separadorTab + 'Número de estación ' + informe.espesoresAsentamiento[index].estacion, {
          paragraphGap: 1
        });
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
      doc.font('Times-Bold').text('Cabezales', {
        underline: true,
        paragraphGap: 3
      });
      doc.fontSize(12);
      for (index = 0; index < informe.espesoresCabezales.length; ++index) {
        doc.font('Times-Bold').text(separadorTab + 'Lado ' + informe.espesoresCabezales[index].lado + separadorColumnas + 'Generatriz ' + informe.espesoresCabezales[index].generatriz, {
          paragraphGap: 1
        });
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 1' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresCabezales[index].medicion1 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 2' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresCabezales[index].medicion2 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 3' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresCabezales[index].medicion3 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 4' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresCabezales[index].medicion4 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 5' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresCabezales[index].medicion5 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 6' + separadorColumnas, {
          continued: true,
          paragraphGap: 3
        }).font('Times-Roman').text(informe.espesoresCabezales[index].medicion6 + 'mm.');
      }
    }


    //Accesorios
    doc.fontSize(15);
    doc.moveDown(2);
    doc.font('Times-Bold').text('Registro de espesores(Accesorios)', {
      underline: true,
      paragraphGap: 3
    });
    doc.fontSize(12);
    for (index = 0; index < informe.espesoresAccesorios.length; ++index) {
      doc.font('Times-Bold').text(separadorTab + informe.espesoresAccesorios[index].accesorio, {
        paragraphGap: 1
      });
      doc.font('Times-Bold').text(separadorTab + separadorTab + 'Diámetro' + separadorColumnas, {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(informe.espesoresAccesorios[index].diametro + '"');
      doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 0°' + separadorColumnas, {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(informe.espesoresAccesorios[index].medicion0 + 'mm.');
      doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 90°' + separadorColumnas, {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(informe.espesoresAccesorios[index].medicion90 + 'mm.');
      doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 180°' + separadorColumnas, {
        continued: true,
        paragraphGap: 1
      }).font('Times-Roman').text(informe.espesoresAccesorios[index].medicion180 + 'mm.');
      doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 270°' + separadorColumnas, {
        continued: true,
        paragraphGap: 3
      }).font('Times-Roman').text(informe.espesoresAccesorios[index].medicion270 + 'mm.');
    }


    //Zona crítica
    if (esHorizontal) {
      doc.fontSize(15);
      doc.moveDown(2);
      doc.font('Times-Bold').text('Zona crítica', {
        underline: true,
        paragraphGap: 3
      });
      doc.fontSize(12);
      for (index = 0; index < informe.espesoresCunas.length; ++index) {
        doc.font('Times-Bold').text(separadorTab + 'Cuna ' + informe.espesoresCunas[index].cuna, {
          paragraphGap: 1
        });
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Punto' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresCunas[index].punto);
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 1' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresCunas[index].medicion1 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 2' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresCunas[index].medicion2 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 3' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresCunas[index].medicion3 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 4' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresCunas[index].medicion4 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 5' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresCunas[index].medicion5 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 6' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresCunas[index].medicion6 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 7' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresCunas[index].medicion7 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 8' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresCunas[index].medicion8 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 9' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresCunas[index].medicion9 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 10' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresCunas[index].medicion10 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 11' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresCunas[index].medicion11 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 12' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresCunas[index].medicion12 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 13' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresCunas[index].medicion13 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 14' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresCunas[index].medicion14 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 15' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresCunas[index].medicion15 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 16' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresCunas[index].medicion16 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 17' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresCunas[index].medicion17 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 18' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresCunas[index].medicion18 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 19' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresCunas[index].medicion19 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 20' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresCunas[index].medicion20 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 21' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresCunas[index].medicion21 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 22' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresCunas[index].medicion22 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 23' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresCunas[index].medicion23 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 24' + separadorColumnas, {
          continued: true,
          paragraphGap: 3
        }).font('Times-Roman').text(informe.espesoresCunas[index].medicion24 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 25' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresCunas[index].medicion25 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 26' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresCunas[index].medicion26 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 27' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresCunas[index].medicion27 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 28' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresCunas[index].medicion28 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 29' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresCunas[index].medicion29 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 30' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresCunas[index].medicion30 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 31' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresCunas[index].medicion31 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 32' + separadorColumnas, {
          continued: true,
          paragraphGap: 3
        }).font('Times-Roman').text(informe.espesoresCunas[index].medicion32 + 'mm.');
      }
    }


    //Techo
    if (!esHorizontal) {
      doc.fontSize(15);
      doc.moveDown(2);
      doc.font('Times-Bold').text('Registro de espesores(Techo)', {
        underline: true,
        paragraphGap: 3
      });
      doc.fontSize(12);
      for (index = 0; index < informe.espesoresTecho.length; ++index) {
        doc.font('Times-Bold').text(separadorTab + 'Chapa N° ' + informe.espesoresTecho[index].chapa, {
          paragraphGap: 1
        });
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 1' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresTecho[index].medicion1 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 2' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresTecho[index].medicion2 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 3' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresTecho[index].medicion3 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 4' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresTecho[index].medicion4 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 5' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.espesoresTecho[index].medicion5 + 'mm.');
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Medición 6' + separadorColumnas, {
          continued: true,
          paragraphGap: 3
        }).font('Times-Roman').text(informe.espesoresTecho[index].medicion6 + 'mm.');
      }
    }


    //MFL
    if (!esHorizontal && esAbierto) {
      doc.fontSize(15);
      doc.moveDown(2);
      doc.font('Times-Bold').text('Registro de observaciones MFL', {
        underline: true,
        paragraphGap: 3
      });
      doc.fontSize(12);
      for (index = 0; index < informe.observacionesMFL.length; ++index) {
        doc.font('Times-Bold').text(separadorTab + 'Pasada ' + informe.observacionesMFL[index].pasada + separadorColumnas + 'Chapa ' + informe.observacionesMFL[index].chapa, {
          paragraphGap: 1
        });
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Acceso' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.observacionesMFL[index].acceso);
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Amolado' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.observacionesMFL[index].amolado);
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Corrosión' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.observacionesMFL[index].corrosion);
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Deformación' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.observacionesMFL[index].deformacion);
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Otra' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.observacionesMFL[index].otra);
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Perforación' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.observacionesMFL[index].perforacion);
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Punto soldadura' + separadorColumnas, {
          continued: true,
          paragraphGap: 1
        }).font('Times-Roman').text(informe.observacionesMFL[index].puntosoldadura);
        doc.font('Times-Bold').text(separadorTab + separadorTab + 'Observaciones' + separadorColumnas, {
          continued: true,
          paragraphGap: 3
        }).font('Times-Roman').text(informe.observacionesMFL[index].observaciones);
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