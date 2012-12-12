var http = require('http'),
    path = require('path'),
    Promise = require('jspromise'),
    util = require('util');

module.exports = {
    port : 3001,

    getPageAsset : function(pagePath, techName) {
        var promise = Promise(),
            params = {
                host : 'localhost',
                port : this.port,
                path : '/' + pagePath + '/' + path.basename(pagePath) + '.' + techName + '.js'
            },
            request = http.request(
                params,
                function(res) {
                    var body = '';
                    res.setEncoding('utf-8');
                    res
                        .on('data', function(chunk) {
                            body += chunk;
                        })
                        .once('end', function() {
                            var _module = { exports : {}};
                            Function('module,exports', body)(_module, _module.exports);
                            promise.fulfill(_module.exports);
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