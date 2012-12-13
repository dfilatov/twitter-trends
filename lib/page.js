var inherit = require('inherit'),
    jaggi = require('jaggi'),
    PageContext = require('./page-context'),
    assetsCfg = require('./config').get('assets'),
    logger = require('./logger'),
    path = require('path'),
    fs = require('fs'),
    Promise = require('jspromise');

module.exports = inherit({
    __constructor : function(path, req, resp, next) {
        this._path = path;
        this._req = req;
        this._resp = resp;
        this._next = next;
    },

    process : function() {
        logger.verbose('page "%s" is running', this._path);
        return this._getDataJSON()
            .then(this._onDataJSON.bind(this))
            .then(
                this._onPageCompleted.bind(this),
                this._onPageFailed.bind(this));
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
                    return new PageContext(params);
                },
                root : path.join(__dirname, 'blocks')
            })
                .on('block-event', this._onBlockEvent.bind(this))
                .run();
    },

    _onDataJSON : function(dataJSON) {
        var mode = this._getMode();
        if(mode === 'json') {
            return this._prettyJSON(dataJSON);
        }

        var bemJSONPromise = this._getBemJSON(dataJSON);

        if(mode === 'bemjson') {
            return bemJSONPromise.then(function(res) {
                return this._prettyJSON(res);
            }.bind(this));
        }

        return Promise.all([bemJSONPromise, this._getTemplate()]).then(function(res) {
            return this._applyTemplate(res[1], res[0]);
        }.bind(this));
    },

    _onPageCompleted : function(res) {
        this._resp.send(res);
        logger.verbose('page "%s" completed', this._path);
    },

    _onPageFailed : function(e) {
        logger.error('page "%s" failed: %s', this._path, e.message);
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

    _getTemplate : function() {
        return assetsCfg.getPageAsset(this._path, 'bemhtml');
    },

    _getBemJSON : function(data) {
        return assetsCfg.getPageAsset(this._path, 'priv').then(function(priv) {
            priv['i-global'].params(this._getGlobalParams());
            var res = priv['b-page'](data);
            return !!this._req.param('body')? res.content : res;
        }.bind(this));
    },

    _getGlobalParams : function() {
        return {
            assetsPath : [
                'host' in assetsCfg? assetsCfg.host : ('//' + this._req.host),
                assetsCfg.port? ':' + assetsCfg.port : '',
                '/' + this._path + '/_' + path.basename(this._path)
            ].join('')
        };
    },

    _applyTemplate : function(template, bemJSON) {
        return template.BEMHTML.apply(bemJSON);
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