(function() {

'use strict';

/* jshint node: true */

var crypto = require('crypto');
var fs = require('fs');
var im = require('imagemagick');

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
    },
    writeBase64Image: function(data, filename, ext) {
        fs.writeFileSync(publicFolder + imageFolder + filename + '.' + ext, new Buffer(data, 'base64'));
    },
    resizeImage: function(filename, ext) {
        im.resize({
            srcPath: publicFolder + imageFolder + filename + '.' + ext,
            dstPath: publicFolder + imageFolder + thumbFolder + filename + '.' + ext,
            width: 200
        }, function(err, stdout, stderr) {
            if (err || stdout || stderr) {
                throw new Exception();
            }
        });
    },
    getDataFromBase64Image: function(image) {
        var matches = image.match(/^data:.+\/(.+);base64,(.*)$/);
        return matches && matches.length == 3 ? matches[2] : image;
    },
    getExtFromBase64Image: function(image) {
        var matches = image.match(/^data:.+\/(.+);base64,(.*)$/);
        return matches && matches.length == 3 ? matches[1] : 'png';
    },
    getFilename: function(seed) {
        return seed + '-' + crypto.randomBytes(4).readUInt32LE(0);
    },
    getThumbFilename: function(filename, ext) {
        return imageFolder + thumbFolder + filename + '.' + ext;
    }
};

module.exports = imageUtils;
}());