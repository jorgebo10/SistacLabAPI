(function() {

'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var EmpresaSchema = new Schema({
  nombre: { type: String, index: { unique: true }, uppercase: true}, //Código de empresa ej "AMB"
  razonSocial: String,
  direccion: String,
  telefono: String,
  email: { type: String, lowercase: true },
  password: String,
  token: String,
  contacto: String,
  imagen: String,
  active: {type: Boolean, default: true}
});
EmpresaSchema.plugin(autoIncrement.plugin, {
  model: 'Empresa',
  field: 'sequence',
  startAt: 1
});

module.exports = mongoose.model('Empresa', EmpresaSchema);
}());
