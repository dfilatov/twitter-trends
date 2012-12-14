var inherit = require('inherit'),
    jaggi = require('jaggi'),
    HandlerContext = require('./handler-context'),
    logger = require('./logger'),
    path = require('path');

module.exports = inherit({
    __constructor : function(path, req, resp, next) {
        this._path = path;
        this._req = req;
        this._resp = resp;
        this._next = next;
    },

    handle : function() {
        logger.verbose('handler "%s" is running', this._path);
        return this._getDataJSON()
            .then(this._onDataJSON.bind(this))
            .then(
                this._onCompleted.bind(this),
                this._onFailed.bind(this));
    },

    _getDataJSON : function() {
        return jaggi.create(
            this._getBlocksDesc(),
            {
                request  : this._req,
                response : this._resp
            },
            {
                contextFactory : function(params) {
                    return new HandlerContext(params);
                },
                root : path.join(__dirname, 'blocks')
            })
            .on('block-event', this._onBlockEvent.bind(this))
            .run();
    },

    _onDataJSON : function(dataJSON) {
        return this._getMode() === 'json'?
            this._prettyJSON(dataJSON) :
            JSON.stringify(dataJSON);
    },

    _onCompleted : function(res) {
        this._resp.send(res);
        logger.verbose('handler "%s" completed', this._path);
    },

    _onFailed : function(e) {
        logger.error('handler "%s" failed: %s', this._path, e.message);
        this._next(e);
    },

    _getBlocksDesc : function() {
        return require(path.join(
            '..',
            this._path,
            path.basename(this._path) + '.blocks.js'));
    },

    _onBlockEvent : function(event, data) {
        switch(event.type) {
            case 'failed':
                logger.error('block "%s" failed: %s', event.meta.id, data.message);
                break;

            case 'done':
                logger.verbose('block "%s" done at %d ms', event.meta.id, event.meta.endTime - event.meta.startTime);
                break;

            default:
                logger.verbose('block "%s" %s', event.meta.id, event.type);
        }
    },

    _getMode : function() {
        return this._req.param('__mode');
    },

    _prettyJSON : function(json) {
        return '<link rel="stylesheet" href="http://yandex.st/highlightjs/7.3/styles/default.min.css">' +
            '<pre>' + require('highlight.js').highlight('json', JSON.stringify(json, null, 4)).value + '</pre>';
    }
}, {
    create : function(path, req, resp, next) {
        return new this(path, req, resp, next);
    }
});