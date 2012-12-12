var numCPUs = require('os').cpus().length;

module.exports = {
    port         : process.env.PORT || 3000,
    workersCount : numCPUs
};