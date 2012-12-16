var path = require('path'),
    Promise = require('jspromise'),
    express = require('express');

module.exports = {
    host : '',

    middleware : function(app) {
        app.use('/desktop.bundles', express.static(__dirname + '/../../desktop.bundles'));
    },

    getPageAsset : function(pagePath, techName) {
        var promise = Promise(),
            asset = require(path.join('..', '..', pagePath, path.basename(pagePath) + '.' + techName));

        promise.fulfill(asset);

        return promise;
    }
};