(function() {
'use strict';

var _ = require('lodash');
var Usuarioempresa = require('./usuarioempresa.model');

// Get list of usuarioempresas
exports.index = function(req, res) {
  Usuarioempresa.find(function (err, usuarioempresas) {
    if(err) { return handleError(res, err); }
    return res.json(200, usuarioempresas);
  }).populate('empresa').populate('usuario');
};

exports.getUsuariosEmpresa = function(req, res) {
  Usuarioempresa.find({empresa:req.params.idEmpresa}, function (err, usuariosempresa) {
    if(err) {
      console.log('ERROR '+err+req.params.idEmpresa);
      return handleError(res, err);
    }
    if(!usuariosempresa) {
      return res.send(404);
    }
    var usuarios = [];
    for (var index = 0; index < usuariosempresa.length; ++index) {
      try {
      var usuario = { name: usuariosempresa[index].usuario.name,
                      email: usuariosempresa[index].usuario.email,
                      _id: usuariosempresa[index].usuario._id,
                      idEmpresa: usuariosempresa[index]._id,
                      image: usuariosempresa[index].usuario.image
                    };
      usuarios.push(usuario);
	}
      catch (e){
      }
    }

    return res.json(usuarios);
  }).populate('usuario');
};

// Get a single usuarioempresa
/*exports.show = function(req, res) {
  Usuarioempresa.findById(req.params.id, function (err, usuarioempresa) {
    if(err) { return handleError(res, err); }
    if(!usuarioempresa) { return res.send(404); }
    return res.json(usuarioempresa);
  }).populate('empresa').populate('usuario');
};*/

// Creates a new usuarioempresa in the DB.
exports.create = function(req, res) {
  Usuarioempresa.create(req.body, function(err, usuarioempresa) {
    if(err) { return handleError(res, err); }
    return res.json(201, usuarioempresa);
  });
};

// Updates an existing usuarioempresa in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Usuarioempresa.findById(req.params.id, function (err, usuarioempresa) {
    if (err) { return handleError(res, err); }
    if(!usuarioempresa) { return res.send(404); }
    var updated = _.merge(usuarioempresa, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, usuarioempresa);
    });
  });
};

// Deletes a usuarioempresa from the DB.
exports.destroy = function(req, res) {
  Usuarioempresa.findById(req.params.id, function (err, usuarioempresa) {
    if(err) { return handleError(res, err); }
    if(!usuarioempresa) { return res.send(404); }
    usuarioempresa.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
}());
