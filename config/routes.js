(function() {

'use strict';

module.exports = function(app) {

app.get('/', function(req, res) {
	res.json({'message': 'Welcome to Sistac API!'});
});
//  app.use('/api/contratoinformehistorico', require('../api/src/contratoinformehistorico'));
//  app.use('/api/contratoinformes', require('../api/src/contratoinforme'));
//  app.use('/api/contratos', require('../api/src/contrato'));
//  app.use('/api/usuariosempresas', require('../api/src/usuarioempresa'));
//  app.use('/api/empresas', require('../api/src/empresa'));
  app.use('/api/fotos', require('../app/api/src/foto'));
//  app.use('/api/informes', require('../api/src/informe'));
//  app.use('/api/a1s', require('../api/src/a1'));
//  app.use('/api/users', require('./api/src/user'));
};
}());
