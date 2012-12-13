var express = require('express'),
    app = express(),
    logger = require('./logger'),
    env = require('./config').get('env'),
    page = require('./page'),
    path = require('path'),
    fs = require('fs'),
    assetsCfg = require('./config').get('assets');

assetsCfg.middleware && app.use(assetsCfg.middleware());

app
    .use(express.bodyParser())
    .use(express.cookieParser())
    .use(express.methodOverride())
    .use(app.router)
    .use(handle404)
    .use(handle500);

require('./routes').forEach(function(route) {
    app[route.method? route.method.toLowerCase() : 'get'](route.request, function(req, resp, next) {
        page(route.response, req, resp, next);
    });
});

function handle404(req, res, next) {
    res.send(404);
}

function handle500(err, req, res, next) {
    logger.error(err.stack);
    res
        .status(500)
        .send(env.debug? '<pre>' + err.stack + '</pre>' : 'Internal error');
}

function startApp(portOrSocket) {
    app.listen(portOrSocket, function() {
        logger.debug('app started on %s', portOrSocket);
    });
}

exports.start = function() {
    env.socket?
        fs.unlink(socket, function(err) {
            err?
                logger.error(err.message) :
                startApp(socket);
        }) :
        startApp(env.port || 8080);
};