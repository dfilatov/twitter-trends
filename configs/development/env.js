var numCPUs = require('os').cpus().length;

module.exports = {
//    socket       : '/tmp/node-dfilatov.socket',
    port         : 3000,
    workersCount : numCPUs > 2? 2 : numCPUs,
    debug        : true,
    hotReload    : true
};