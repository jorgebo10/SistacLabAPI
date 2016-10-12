(function() {
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
