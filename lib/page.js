var jaggi = require('jaggi'),
    PageContext = require('./page-context'),
    assetsCfg = require('./config').get('assets'),
    logger = require('./logger'),
    path = require('path'),
    fs = require('fs'),
    Promise = require('jspromise');

function getPageBlocks(pagePath) {
    return require(path.join(
        '..',
        pagePath,
        path.basename(pagePath) + '.blocks.js'));
}

function getPageTemplate(pagePath) {
    return assetsCfg.getPageTemplate(pagePath);
}

function getPageBEMJSON(pagePath, globalParams, data, onlyBody) {
    return assetsCfg.getPagePriv(pagePath).then(function(priv) {
        priv['i-global'].params(globalParams);
        var res = priv['b-page'](data);
        return onlyBody? res.content : res;
    });
}

function buildPageGlobalParams(pagePath, req) {
    return {
        assetsPath : [
            assetsCfg.host || (req.protocol + '://' + req.host),
            assetsCfg.port? ':' + assetsCfg.port : '',
            '/' + pagePath + '/_' + path.basename(pagePath)
        ].join('')
    };
}

function prettyJSON(json) {
    return '<link rel="stylesheet" href="http://yandex.st/highlightjs/7.3/styles/default.min.css">' +
        '<pre>' + require('highlight.js').highlight('json', JSON.stringify(json, null, 4)).value + '</pre>';
}

function applyTemplate(template, data) {
    return template.BEMHTML.apply(data);
}

module.exports = function(pagePath, req, resp, next) {
    logger.info('page "%s" is running', pagePath);
    jaggi.create(
        getPageBlocks(pagePath),
        {
            request  : req,
            response : resp
        },
        {
            contextFactory : function(params) {
                return new PageContext(params);
            },
            root : path.join(__dirname, 'blocks')
        })
            .on('block-event', function(event, data) {
                switch(event.type) {
                    case 'failed':
                        logger.error('block "%s" failed: %s', event.meta.id, data.message);
                        break;

                    case 'done':
                        logger.info('block "%s" done at %d ms', event.meta.id, event.meta.endTime - event.meta.startTime);
                        break;

                    default:
                        logger.info('block "%s" %s', event.meta.id, event.type);
                }
            })
            .run()
                .then(function(res) {
                    var mode = req.param('__mode');
                    if(mode === 'json') { // data json
                        return prettyJSON(res);
                    }

                    var BEMJSONPromise = getPageBEMJSON(
                            pagePath,
                            buildPageGlobalParams(pagePath, req),
                            res,
                            !!req.param('body'));

                    if(mode === 'bemjson') { // bemjson
                        return BEMJSONPromise.then(function(res) {
                            return prettyJSON(res);
                        });
                    }

                    return Promise.all([BEMJSONPromise, getPageTemplate(pagePath)]).then(function(res) {
                        return applyTemplate(res[1], res[0]);
                    });
                })
                .then(
                    function(res) {
                        resp.send(res);
                        logger.info('page "%s" completed', pagePath);
                    },
                    function(e) {
                        next(e);
                    });
};