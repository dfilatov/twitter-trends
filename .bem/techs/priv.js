var BEM = require('bem');

exports.baseTechPath = BEM.require.resolve('./techs/js.js');
exports.techMixin = {
    getSuffixes: function() {
        return ['priv.js'];
    },

    getBuildResult: function(prefixes, suffix, outputDir, outputName) {
        return this.__base.apply(this, arguments)
            .then(function(res) {
                res.unshift('var blocks = {}; module.exports = blocks;');
                return res;
            });
    }/*,

    getDependencies: function() {
        return ['bemhtml'];
    }*/
};