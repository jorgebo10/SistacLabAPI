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


FotoSchema.static('getById', function(id) {
    return this
        .findById(id)
        .select('-sequence -__v')
        .exec();
});

FotoSchema.static('findByInformeIdAndTags', function(informeId, tags) {
    var filter = {};

    filter.idInforme = informeId;
    if (tags) {
        var queryTags = [];
        queryTags.push(tags);
        var inQuery = {
            $in: queryTags
        };
        filter.tags = inQuery;
    }

    Foto
        .find(filter)
        .select('-sequence -__v')
        .exec();
});

/*
FotoSchema.plugin(autoIncrement.plugin, {
    model: 'Foto',
    field: 'sequence',
    startAt: 1
});
*/
module.exports = mongoose.model('Foto', FotoSchema);
}());
