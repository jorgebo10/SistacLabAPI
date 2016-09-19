(function() {

'use strict';

/* jshint node: true */

var im = require('imagemagick');
var crypto = require('crypto');
var fs = require('fs');

var imageFolder = 'images/';
var publicFolder = 'public/';
var thumbFolder = 'thumb/';

var imageUtils = {
	getFullUrlFromFoto: function(foto) {
    	return imageFolder + thumbFolder + foto.filename + '.' + foto.ext;
	},
	getBase64UrlFromFoto: function(foto) {
    	var base64Data = fs.readFileSync(publicFolder + imageFolder + foto.filename + '.' + foto.ext, 'base64');
    	return 'data:image/' + foto.ext + ';base64,' + base64Data;
    },
    unlink: function(filename, ext) {
    	fs.unlinkSync(publicFolder + imageFolder + filename + '.' + ext);
        fs.unlinkSync(publicFolder + imageFolder + thumbFolder + filename + '.' + ext);
    }
};

module.exports = imageUtils;
}());