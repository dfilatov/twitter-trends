/*global MAKE:true */

"use strict";

MAKE.decl('Arch', {
    blocksLevelsRegexp: /^.+?\.blocks/,

    bundlesLevelsRegexp: /^.+?\.bundles$/,

    getLibraries: function() {
        return {
            'bem-bl': {
                type: 'git',
                url: 'git://github.com/bem/bem-bl.git',
                branch: '0.3'
            }
        };
    }
});


MAKE.decl('BundleNode', {
    getTechs: function() {
        return [
            'bemjson.js',
            'bemdecl.js',
            'deps.js',
            'priv.js',
            'bemhtml',
            'js',
            'css'
        ];
    },

    getOptimizerTechs: function() {
        return [
            'css',
            'js'
        ];
    }
});
