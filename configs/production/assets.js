var path = require('path'),
    Vow = require('vow'),
    express = require('express');

module.exports = {
    host : '',

    middleware : function(app) {
        app.use('/desktop.bundles', express.static(__dirname + '/../../desktop.bundles'));
    },

    getPageAsset : function(pagePath, techName) {
        return Vow.promise(require(path.join('..', '..', pagePath, path.basename(pagePath) + '.' + techName)));
    }
};