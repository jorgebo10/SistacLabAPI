(function() { 
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
