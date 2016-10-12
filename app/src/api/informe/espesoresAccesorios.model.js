(function() { 
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
