blocks['b-page'] = function(data) {
    var globalParams = blocks['i-global'].params();
    return {
        block : 'b-page',
        title : blocks['b-page'].title(data),
        favicon : '/favicon.ico',
        mix : [blocks['i-global']()],
        head : [
            { elem : 'css', url : globalParams.assetsPath + '.css', ie : false },
            { block : 'i-jquery', elem : 'core' },
            { elem : 'js', url : globalParams.assetsPath + '.js' },
            { elem : 'meta', attrs : { name : 'description', content : '' }},
            { elem : 'meta', attrs : { name : 'keywords', content : '' }}
        ],
        content : blocks['b-page'].content(data)
    };
};

blocks['b-page'].title = blocks['b-page'].content = function() {};