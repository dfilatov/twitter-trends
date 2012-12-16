var inherit = require('inherit'),
    assetsCfg = require('../config').get('assets'),
    logger = require('../logger'),
    path = require('path'),
    Promise = require('jspromise');

module.exports = inherit(require('../handler'), {
    _onDataJSON : function(dataJSON) {
        var mode = this._getMode();
        if(mode === 'json') {
            return this.__base(dataJSON);
        }

        var bemJSONPromise = this._getBemJSON(dataJSON);

        if(mode === 'bemjson') {
            return bemJSONPromise.then(function(res) {
                return this._prettyJSON(res);
            }.bind(this));
        }

        return Promise.all([bemJSONPromise, this._getTemplate()]).spread(function(bemJSON, template) {
            return this._applyTemplate(template, bemJSON);
        }.bind(this));
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
        var startTime = Date.now();
        logger.verbose('BEMHTML running');
        var res = template.BEMHTML.apply(bemJSON);
        logger.verbose('BEMHTML completed at %d ms', Date.now() - startTime);
        return res;
    }
});