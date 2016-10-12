(function() {
'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var MedicionesChapaSchema = new Schema({
	informe: {
		type: Schema.Types.ObjectId,
		ref: 'Informe'
	},
	numeroChapa: {
		type: String,
		required: true
	},
	numeroVirola: {
		type: String,
		required: true
	},
	largo: {
		type: String,
		required: true
	},
	ancho: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model('MedicionesChapa', MedicionesChapaSchema);
}());
