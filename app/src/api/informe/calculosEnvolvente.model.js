(function() {
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
