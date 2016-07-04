(function() {

'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var EmpresaSchema = new Schema({
  codigo: {
      type: String,
      unique: true,
      uppercase: true,
      required: true
  },
  nombre: { 
      type: String
  },
  razonSocial: { 
    type: String,
    unique: true
  },
  direccion: String,
  telefono: String,
  email: { 
    type: String,
    required: true,
    unique: true
 },
  password: String,
  token: String,
  contacto: String,
  imagen: String
});

/*
EmpresaSchema.plugin(autoIncrement.plugin, {
  model: 'Empresa',
  field: 'sequence',
  startAt: 1
});
*/

EmpresaSchema.static('getByCodigo', function(codigo) {
  return this
    .findOne({codigo: codigo})
    .select('-sequence -__v')
    .exec();
});

module.exports = mongoose.model('Empresa', EmpresaSchema);
}());
