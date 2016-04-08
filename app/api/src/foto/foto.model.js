(function() {
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var FotoSchema = new Schema({
    idInforme: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    ext: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
        default: []
    },
    syncTime: String
});

FotoSchema.plugin(autoIncrement.plugin, {
    model: 'Foto',
    field: 'sequence',
    startAt: 1
});
module.exports = mongoose.model('Foto', FotoSchema);
}());
