var path = require('path'),
    Promise = require('jspromise'),
    express = require('express');

module.exports = {
    host : '',

    middleware : function() {
        return express.static(__dirname + '/../..');
    },

    getPageAsset : function(pagePath, techName) {
        var promise = Promise(),
            asset = require(path.join('..', '..', pagePath, path.basename(pagePath) + '.' + techName));

        promise.fulfill(asset);

        return promise;
    }
};