(function() {
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
