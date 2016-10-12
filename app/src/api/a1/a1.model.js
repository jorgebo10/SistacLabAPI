(function() {

    'use strict';

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema;
    var autoIncrement = require('mongoose-auto-increment');

    var A1Schema = new Schema({
        numeroTramite: {
            type: Number,
            required: true,
            unique: true,
            max: 9999999
        },
        cit: {
            type: Number,
            max: 9999999,
            unique: true
        },
        elevado: {
            type: Boolean,
            default: false
        },
        tieneInspeccionesAnteriores: {
            type: Boolean,
            default: false
        },
        nombreInstalacion: {
            type: String,
            default: ''
        },
        volumenEndicamientoMinimo: {
            type: Number,
            max: 9999999,
        },
        normaFabricacion: String,
        fabricante: {
            type: String,
            default: ''
        },
        matricula: {
            type: String,
            default: ''
        },
        estado: {
            type: String,
            default: ''
        },
        observaciones: {
            type: String,
            default: ''
        },
        numeroInterno: {
            type: String,
            default: ''
        },
        anioInstalacion: {
            type: Number,
            min: 1800,
            max: 4000,
            default: 1800
        },
        placaIdentificacion: {
            type: String,
            default: ''
        },
        temperaturaOperacion: {
            type: String,
            default: 'Ambiente'
        },
        especificacionChapas: {
            type: String,
            default: ''
        }
    });

    A1Schema.static('getByCit', function(cit) {
        return this
            .findOne({
                cit: cit
            })
            .select('-sequence -__v')
            .exec();
    });

    A1Schema.static('getByNumeroTramite', function(numeroTramite) {
        return this
            .findOne({
                numeroTramite: numeroTramite
            })
            .select('-sequence -__v')
            .exec();
    });

    A1Schema.plugin(autoIncrement.plugin, {
        model: 'A1',
        field: 'sequence',
        startAt: 1
    });

    module.exports = mongoose.model('A1', A1Schema);
}());