var winston = require('winston'),
    util = require('util'),
    utils = require('./utils'),
    config = require('../lib/config').get('logger'),
    DEFAULT_CONFIG = {
        timestamp : function() {
            var now = new Date();
            return util.format(
                '%s:%s:%s.%s',
                utils.pad(now.getHours(), 2, '0'),
                utils.pad(now.getMinutes(), 2, '0'),
                utils.pad(now.getSeconds(), 2, '0'),
                utils.pad(now.getMilliseconds(), 3, '0'));
        }
    },
    logger = new winston.Logger({
        transports : Object.keys(config).map(function(key) {
            return new winston.transports[capitalize(key)](utils.merge(DEFAULT_CONFIG, config[key]));
        })
    });

function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
}

['silly', 'input', 'verbose', 'prompt', 'info', 'data', 'help', 'warn', 'debug', 'error'].forEach(function(level) {
    exports[level] = function() {
        logger.log(level, util.format.apply(util, arguments));
    };
});