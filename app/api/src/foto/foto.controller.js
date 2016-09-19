(function() {
'use strict';

/* jshint node: true */

var logger = require('../../../utils/logger');
var _ = require('underscore');
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
        logger.error(content);
    }
};

exports.getById = function(req, res) {
    logger.info('Entering FotoController#getById(req.params.id={%s})', req.params.id);

    if (!req.params || !req.params.id) {
        return sendJsonResponse(res, 404, {
            'message': 'id not found in request params'
        });
    }

    Foto
        .getById(req.params.id)
        .then(
            function(foto) {
                if (null === foto) {
                    return sendJsonResponse(res, 404, {'message': 'No results found while searching by id ' + req.params.id});
                } else {
                    logger.info('Found foto with id %s while searching by id %s', foto.id, req.params.id);
                    return sendJsonResponse(res, 200, {
                        id: foto._id,
                        idInforme: foto.idInforme,
                        url: imageFolder + thumbFolder + foto.filename + '.' + foto.ext,
                        syncTime: foto.syncTime,
                        descripcion: foto.descripcion,
                        tags: foto.tags
                    });
                }
            }
        )
        .catch(
            function(err) {
                return sendJsonResponse(res, 400, err);
            }
        );

    logger.info('Leaving FotoController#getById');
};

exports.findByInformeIdAndTags = function(req, res) {
    logger.info('Entering FotoController#findByInformeIdAndTags(req.query.informeId={%s})', req.query.informeId);

    if (!req.query.informeId) {
        return sendJsonResponse(res, 404, {
            'message': 'informeId not found in query params'
        });
    }

    Foto
        .findByInformeIdAndTags(req.query.informeId, req.query.tags)
        .then(
            function(fotos) {
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
        )
        .catch(
            function(err) {
                return sendJsonResponse(res, 400, err);
            }
        );

    logger.info('Leaving FotoController#findByInformeIdAndTags');
};

function getFullUrlFromFoto(foto) {
    return imageFolder + thumbFolder + foto.filename + '.' + foto.ext;
}

function getBase64UrlFromFoto(foto) {
    var base64Data = fs.readFileSync(publicFolder + imageFolder + foto.filename + '.' + foto.ext, 'base64');
    return 'data:image/' + foto.ext + ';base64,' + base64Data;
}

exports.deleteById = function(req, res) {
    logger.info('Entering FotoController#deleteById(req.params.id={%s}', req.params.id);

    if (!req.params.id) {
        return sendJsonResponse(res, 404, {
            'message': 'id not found in request params'
        });
    }

    Foto
        .findByIdAndRemove(id)
        .select('filename ext')
        .exec()
        .then(
            function(foto) {
                fs.unlinkSync(publicFolder + imageFolder + foto.filename + '.' + foto.ext);
                fs.unlinkSync(publicFolder + imageFolder + thumbFolder + foto.filename + '.' + foto.ext);
                logger.info('Foto deleted by id %s', foto.id);
                return sendJsonResponse(res, 204, null);
            }
        )
        .catch(
            function(err) {
                return sendJsonResponse(res, 400, err);
            }
        );

    logger.info('Leaving FotoController#deleteById');
};

exports.update = function(req, res) {
    logger.info('Entering FotoController#update(req.params.id={%s}', req.params.id);

    if (!req.params || !req.params.id) {
        return sendJsonResponse(res, 404, {
            'message': 'id not found in request params'
        });
    }

    Foto
        .findById(req.params.id)
        .select('-sequence -__v')
        .exec()
        .then(
            function(foto) {
                 if (null === foto) {
                    return sendJsonResponse(res, 404, {'message': 'No results found while searching by id ' + req.params.id});
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
                    .exec()
                    .then(
                        function(fotoWithDuplicateTag) {
                            if (fotoWithDuplicateTag && !fotoWithDuplicateTag._id.equals(foto._id)) {
                                return sendJsonResponse(res, 400, {
                                    'message': 'Tags already assinged'
                                });
                            }

                            foto.tags = tags;
                            foto.descripcion = descripcion;
                            foto
                                .save()
                                .exec()
                                .then(
                                    function() {
                                        return sendJsonResponse(res, 200, foto);
                                    }
                                );
                        }
                    );
            }
        )
        .catch(
            function(err) {
                return sendJsonResponse(res, 400, err);
            }
        );
        
    logger.info('Leaving FotoController#update');
};

exports.deleteByInformeId = function(req, res) {
    logger.info('Entering FotoController#deleteByInformeId(req.query.informeId={%s}', req.query.informeId);
 
    if (!req.query.informeId || !req.query.informeId) {
        return sendJsonResponse(res, 404, {
            'message': 'id not found in request params'
        });
    }

    Foto
        .find({
            idInforme: req.query.informeId
        })
        .exec()
        .then(
            function(fotos) {
                _.each(fotos, function(foto) {
                    foto.remove(
                        function(err) {
                            if (err) {
                                return sendJsonResponse(res, 400, err);
                            }
                        }
                    );
                });
                return sendJsonResponse(res, 204, null);
            }
        )
        .catch(
            function(err) {
                return sendJsonResponse(res, 400, err);
            }
        );
    
    logger.info('Leaving FotoController#deleteByInformeId');
};

exports.create = function(req, res) {
    logger.info('Entering FotoController#create');

    var imagen = null;
    var filename = null;
    var ext = null;

    if (!req.body.idInforme) {
        return sendJsonResponse(res, 404, {
            'message': 'missing informeId'
        });
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
                return sendJsonResponse(res, 500, err);
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
    })
    .exec()
    .then(
        function(foto) {
            logger.info('Foto created with id %s', foto.id);
            return sendJsonResponse(res, 201, foto);
        }
    )
    .catch(
        function(err) {
            return sendJsonResponse(res, 400, err);
        }
    );

    logger.info('Leaving FotoController#create');
};
}());
