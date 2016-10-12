(function() {
  'use strict';

  var autoIncrement = require('mongoose-auto-increment');
  var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

  var ContratoSchema = new Schema({
    contrato: {
      type: String,
      index: {
        unique: true
      },
      uppercase: true
    },
    fechaInicio: Date,
    fechaFin: Date,
    operador: String,
    cuit: String,
    domicilio: String,
    referenteComercial: String,
    emailComercial: {
      type: String,
      lowercase: true
    },
    telefonoComercial: String,
    referenteTecnico: String,
    emailTecnico: {
      type: String,
      lowercase: true
    },
    telefonoTecnico: String,
    observaciones: String,
    active: {
      type: Boolean,
      default: true
    },
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