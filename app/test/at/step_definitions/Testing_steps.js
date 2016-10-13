function Testing_steps() {

  var A1DocApi = require('../appdriver/A1DocApi');

  var a1Data = {};

  this.Given(/^I want to create a new AUnoDoc with numeroTramite (\d+) and cit (\d+)$/, function(numeroTramite, cit, callback) {
    a1Data.numeroTramite = numeroTramite;
    a1Data.anioInstalacion = undefined;
    a1Data.cit = cit;
    a1Data.elevado = undefined;
    a1Data.especificacionChapas = undefined;
    a1Data.estado = undefined;
    a1Data.fabricante = undefined;
    a1Data.matricula = undefined;
    a1Data.nombreInstalacion = undefined;
    a1Data.normaFabricacion = undefined;
    a1Data.numeroInterno = undefined;
    a1Data.observaciones = undefined;
    a1Data.placaIdentificacion = undefined;
    a1Data.temperaturaOperacion = undefined;
    a1Data.tieneInspeccionesAnteriores = undefined;
    a1Data.volumenEndicamientoMinimo = undefined;
    callback();
  });

  this.When(/^I trigger creation$/, function(callback) {
    A1DocApi.new(a1Data, callback);
  });

  this.Then(/^AUnoDoc with numeroTramite (\d+) is created$/, function(numeroTramite, callback) {
    A1DocApi.getByNumeroTramite(numeroTramite, callback);
  });
}

module.exports = Testing_steps;