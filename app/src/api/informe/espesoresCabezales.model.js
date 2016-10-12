(function() {
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EspesoresCabezalesSchema = new Schema({
  informe: {type:Schema.Types.ObjectId, ref: 'Informe'},
  lado: String,
  generatriz: String,
  medicion1: String,
  medicion2: String,
  medicion3: String,
  medicion4: String,
  medicion5: String,
  medicion6: String
});

module.exports = mongoose.model('EspesoresCabezales', EspesoresCabezalesSchema);}());
