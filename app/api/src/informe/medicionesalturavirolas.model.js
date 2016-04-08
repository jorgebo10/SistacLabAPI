(function() {
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MedicionesAlturaVirolasSchema = new Schema({
    informe: {type: Schema.Types.ObjectId, ref: 'Informe'},
    numeroVirola: String,
    alto: String
});

module.exports = mongoose.model('MedicionesAlturaVirolas', MedicionesAlturaVirolasSchema);
}());
