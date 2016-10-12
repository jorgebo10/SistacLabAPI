(function() {

  'use strict';

  var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

  var ContratoinformeSchema = new Schema({
    contrato: {
      type: Schema.Types.ObjectId,
      ref: 'Contrato'
    },
    informe: {
      type: Schema.Types.ObjectId,
      ref: 'Informe'
    },
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