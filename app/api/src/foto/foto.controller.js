(function() {
'use strict';

var _ = require('underscore');
var winston = require('winston');
var sistacLoggerError = winston.loggers.get('sistac-error');
var Foto = require('./foto.model');
var im = require('imagemagick');
var crypto = require('crypto');
var fs = require('fs');

var imageFolder = 'images/';
var publicFolder = 'public/';
var thumbFolder = 'thumb/';

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
    if (400 === status || 404 === status) {
        sistacLoggerError.error(content);
    }
};

exports.getById = function(req, res) {
    if (!req.params || !req.params.id) {
        return sendJsonResponse(res, 404, {
            'message': 'id not found in request params'
        });
    }

    Foto
        .findById(req.params.id)
        .select('-sequence -__v')
        .exec(function(err, foto) {
            if (err) {
                return sendJsonResponse(res, 400, err);
            } else if (!foto) {
                return sendJsonResponse(res, 404, {
                    'message': 'Foto not found by id: ' + req.params.id
                });
            } else {
                return sendJsonResponse(res, 200, {
                    id: foto._id,
                    idInforme: foto.idInforme,
                    url: imageFolder + thumbFolder + foto.filename + '.' + foto.ext,
                    syncTime: foto.syncTime,
                    descripcion: foto.descripcion,
                    tags: foto.tags
                });
            }
        });
};

exports.findByInformeIdAndTags = function(req, res) {
    var filter = {};

    if (!req.query.idInforme) {
        return sendJsonResponse(res, 404, {
            'message': 'idInforme not found in request params'
        });
    } else {
        filter.idInforme = req.query.idInforme;
    }

    if (req.query.tag) {
        var tags = [];
        tags.push(req.query.tag);
        var inQuery = {
            $in: tags
        };
        filter.tags = inQuery;
    }

    Foto
        .find(filter)
        .select('-sequence -__v')
        .exec(
            function(err, fotos) {
                if (err) {
                    return sendJsonResponse(res, 400, err);
                }
                var fotoList = _.map(fotos, function(foto) {
                    var fotoUrl = req.query.full ?
                        getFullUrlFromFoto(foto) :
                        getBase64UrlFromFoto(foto);

                    return {
                        id: foto._id,
                        idInforme: foto.idInforme,
                        url: fotoUrl,
                        syncTime: foto.syncTime,
                        descripcion: foto.descripcion,
                        tags: foto.tags
                    };
                });
                return sendJsonResponse(res, 200, fotoList);
            }
        );
};

function getFullUrlFromFoto(foto) {
    return imageFolder + thumbFolder + foto.filename + '.' + foto.ext;
}

function getBase64UrlFromFoto(foto) {
    var base64Data = fs.readFileSync(publicFolder + imageFolder + foto.filename + '.' + foto.ext, 'base64');
    return 'data:image/' + foto.ext + ';base64,' + base64Data;
}

exports.delete = function(req, res) {
    var id = req.params.id;
    if (!id) {
        sendJsonResponse(res, 404, {
            'message': 'Foto not found by id: ' + id
        });
    }

    Foto
        .findByIdAndRemove(id)
        .select('filename ext')
        .exec(
            function(err, foto) {
                if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                fs.unlinkSync(publicFolder + imageFolder + foto.filename + '.' + foto.ext);
                fs.unlinkSync(publicFolder + imageFolder + thumbFolder + foto.filename + '.' + foto.ext);
                sendJsonResponse(res, 204, null);
            }
        );
};

exports.update = function(req, res) {
    if (!req.params || !req.params.id) {
        sendJsonResponse(res, 404, {
            'message': 'id not found in request params'
        });
        return;
    }

    Foto
        .findById(req.params.id)
        .select('-sequence -__v')
        .exec(
            function(err, foto) {
                if (err) {
                    sendJsonResponse(res, 400, err);
                    return;
                } else if (!foto) {
                    sendJsonResponse(res, 404, {
                        'message': 'Foto not found by id:' + req.params.id
                    });
                    return;
                }

                var tags = req.body.tags;
                var descripcion = req.body.descripcion;

                Foto
                    .findOne({
                        informeId: req.body.informeId,
                        tags: {
                            $in: tags
                        }
                    })
                    .select('_id')
                    .exec(
                        function(err, fotoWithDuplicateTag) {
                            if (err) {
                                sendJsonResponse(res, 400, err);
                                return;
                            }

                            if (fotoWithDuplicateTag && !fotoWithDuplicateTag._id.equals(foto._id)) {
                                sendJsonResponse(res, 400, {
                                    'message': 'Tags already assinged'
                                });
                                return;
                            }

                            foto.tags = tags;
                            foto.descripcion = descripcion;
                            foto
                                .save(
                                    function(err) {
                                        if (err) {
                                            sendJsonResponse(res, 400, err);
                                            return;
                                        }
                                        sendJsonResponse(res, 200, foto);
                                    }
                                );
                        }
                    );
            });
};

exports.deleteByInformeId = function(req, res) {
    if (!req.params || !req.params.id) {
        /*sendJsonResponse(res, 404, {
            'message': 'id not found in request params'
        });*/
        sistacLoggerError.error('id not found in request params');
        return;
    }

    Foto
        .find({
            idInforme: req.params.id
        })
        .exec(
            function(err, fotos) {
                if (err) {
                    sistacLoggerError.error(err);
                    //sendJsonResponse(res, 400, err);
                    return;
                }
                _.each(fotos, function(foto) {
                    foto.remove(
                        function(err) {
                            if (err) {
                                sistacLoggerError.error(err);
                                //sendJsonResponse(res, 400, err);
                                return;
                            }
                        }
                    );
                });
                //sendJsonResponse(res, 204, null);
            }
        );
};

exports.create = function(req, res) {
    var imagen = null;
    var filename = null;
    var ext = null;

    if (!req.body.idInforme) {
        sendJsonResponse(res, 400, {
            'message': 'missing idInforme'
        });
        return;
    }


    if (req.body.imagen || req.body.imagen.src) {
        imagen = req.body.imagen.src ? req.body.imagen.src : req.body.imagen;
    }

    if (imagen) {
        var matches = imagen.match(/^data:.+\/(.+);base64,(.*)$/);
        ext = matches && matches.length == 3 ? matches[1] : 'png';
        var data = matches && matches.length == 3 ? matches[2] : imagen;

        filename = req.body.idInforme + '-' + crypto.randomBytes(4).readUInt32LE(0);

        fs.writeFileSync(publicFolder + imageFolder + filename + '.' + ext, new Buffer(data, 'base64'));

        im.resize({
            srcPath: publicFolder + imageFolder + filename + '.' + ext,
            dstPath: publicFolder + imageFolder + thumbFolder + filename + '.' + ext,
            width: 200
        }, function(err, stdout, stderr) {
            if (err || stdout || stderr) {
                sendJsonResponse(res, 500, err);
                return;
            }
        });
    }

    Foto.create({
        idInforme: req.body.idInforme,
        filename: filename,
        ext: ext,
        descripcion: req.body.descripcion,
        tags: req.body.tags,
        syncTime: req.body.syncTime
    }, function(err, foto) {
        if (err) {
            sendJsonResponse(res, 400, err);
            return;
        } else {
            sendJsonResponse(res, 201, foto);
            return;
        }
    });
};
}());
