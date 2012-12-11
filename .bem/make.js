/*global MAKE:true */

"use strict";

process.env.YENV = 'development';

MAKE.decl('Arch', {

    blocksLevelsRegexp: /^.+?\.blocks/,

    bundlesLevelsRegexp: /^.+?\.bundles$/,

    getLibraries: function() {

        return {
            'bem-bl': {
                type: 'git',
                url: 'git://github.com/bem/bem-bl.git',
                treeish: '0.3'
            },
            'bemhtml' : {
                type: 'git',
                url: 'git://github.com/bem/bemhtml.git'
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
    }

});
