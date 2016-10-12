(function() {
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UsuarioempresaSchema = new Schema({
  empresa: {type:Schema.Types.ObjectId, ref: 'Empresa'},
  usuario: {type:Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Usuarioempresa', UsuarioempresaSchema);
}());
