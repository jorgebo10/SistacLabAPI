(function() {
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
