var express = require('express'),
    app = express(),
    logger = require('./logger'),
    env = require('./config').get('env'),
    Page = require('./handlers/page'),
    path = require('path'),
    fs = require('fs'),
    assetsCfg = require('./config').get('assets');

assetsCfg.middleware && assetsCfg.middleware(app);

app
    .use(express.bodyParser())
    .use(express.cookieParser())
    .use(express.methodOverride())
    .use(app.router)
    .use(handle404)
    .use(handle500);

require('./routes').forEach(function(route) {
    app[route.method? route.method.toLowerCase() : 'get'](route.request, function(req, resp, next) {
        Page.create(route.response, req, resp, next).handle();
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
        logger.info('app started on %s', portOrSocket);
    });
}

exports.start = function() {
    startApp(env.socket || env.port || 8080);
};
