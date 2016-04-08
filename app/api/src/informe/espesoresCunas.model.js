(function() {
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EspesoresCunasSchema = new Schema({
  informe: {type:Schema.Types.ObjectId, ref: 'Informe'},
  cuna: String,
  punto: String,
  medicion1: String,
  medicion2: String,
  medicion3: String,
  medicion4: String,
  medicion5: String,
  medicion6: String,
  medicion7: String,
  medicion8: String,
  medicion9: String,
  medicion10: String,
  medicion11: String,
  medicion12: String,
  medicion13: String,
  medicion14: String,
  medicion15: String,
  medicion16: String,
  medicion17: String,
  medicion18: String,
  medicion19: String,
  medicion20: String,
  medicion21: String,
  medicion22: String,
  medicion23: String,
  medicion24: String,
  medicion25: String,
  medicion26: String,
  medicion27: String,
  medicion28: String,
  medicion29: String,
  medicion30: String,
  medicion31: String,
  medicion32: String
});

module.exports = mongoose.model('EspesoresCunas', EspesoresCunasSchema);
}());
