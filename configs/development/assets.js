var http = require('http'),
    path = require('path'),
    Vow = require('vow'),
    util = require('util');

module.exports = {
    port : 3001,

    getPageAsset : function(pagePath, techName) {
        var promise = Vow.promise(),
            params = {
                host : 'localhost',
                port : this.port,
                path : '/' + pagePath + '/' + path.basename(pagePath) + '.' + techName + '.js'
            },
            request = http.request(
                params,
                function(res) {
                    res.once('end', function() {
                        var modulePath = path.join('..', '..', pagePath, path.basename(pagePath) + '.' + techName + '.' + 'js');
                        delete require.cache[path.resolve(__dirname, modulePath)];
                        return promise.fulfill(require(modulePath));
                    });
                });

        request
            .once('error', function(e) {
                promise.reject(
                    new Error(
                        util.format('bem server (port: %s, path: %s): %s', params.port, params.path, e.message)));
            })
            .end();

        return promise;
    }
};