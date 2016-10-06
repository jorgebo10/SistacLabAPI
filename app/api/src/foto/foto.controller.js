(function() {
'use strict';

/* jshint node: true */

var logger = require('../../../utils/logger');
var imageUtils = require('../../../utils/image.utils');
var _ = require('underscore');
var Foto = require('./foto.model');

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
                    logger.info('Found foto with id %s while searching by id %s', foto._id, req.params.id);
                    return sendJsonResponse(res, 200, {
                        id: foto._id,
                        informeId: foto.informeId,
                        url: imageUtils.getThumbFilename(foto.filename, foto.ext),
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
                        imageUtils.getFullUrlFromFoto(foto) :
                        imageUtils.getBase64UrlFromFoto(foto);
                        return {
                            id: foto._id,
                            informeId: foto.informeId,
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

exports.deleteById = function(req, res) {
    logger.info('Entering FotoController#deleteById(req.params.id={%s}', req.params.id);

    if (!req.params.id) {
        return sendJsonResponse(res, 404, {
            'message': 'id not found in request params'
        });
    }

    Foto
        .findByIdAndRemove(req.params.id)
        .select('filename ext')
        .exec()
        .then(
            function(foto) {
                imageUtils.unlink(foto.filename, foto.ext);
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

    if (!req.body.informeId) {
        return sendJsonResponse(res, 404, {
            'message': 'informeId not found'
        });
    }

    Foto
        .findOne({
            informeId: req.body.informeId,
            tags: {
                $in: req.body.tags
            }
        })
        .select('_id')
        .exec()
        .then(
            function(fotoWithDuplicateTag) {
                if (fotoWithDuplicateTag && fotoWithDuplicateTag._id !== req.params.id) {
                    return sendJsonResponse(res, 400, {
                        'message': 'Tags already assinged'
                    });
                }

                return Foto
                    .findOneAndUpdate({id: req.params.id}, { 
                        tags: req.body.tags,
                        descripcion: req.body.descripcion
                    }, {runValidators: true})
                    .exec()
                    .then(
                        function(foto) {
                            if (null === foto) {
                                return sendJsonResponse(res, 404, {'message': 'No results found while searching by id ' + req.params.id});
                            } else {
                                logger.info('Foto updated by id %s', foto._id);
                                return sendJsonResponse(res, 200, foto._id);
                            }
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

exports.create = function(req, res) {
    logger.info('Entering FotoController#create');

    if (!req.body.informeId) {
        return sendJsonResponse(res, 404, {
            'message': 'informeId not found'
        });
    }

    if (!req.body.imagen) {
        return sendJsonResponse(res, 404, {
            'message': 'image not found'
        });
    }


    var imagen = req.body.imagen;
    var data = imageUtils.getDataFromBase64Image(imagen);
    var ext = imageUtils.getExtFromBase64Image(imagen);
    var filename = imageUtils.getFilename(req.body.informeId);

    imageUtils.writeImageBase64(data, filename, ext);
    imageUtils.resizeImage(filename, ext);

    Foto.create({
        informeId: req.body.informeId,
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
