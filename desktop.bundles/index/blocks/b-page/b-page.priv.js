blocks['b-page'].title = function(data) {
    return 'Top trends';
};

blocks['b-page'].content = function(data) {
    return {
        block   : 'b-trends-rotator',
        content : data['top-trends'].map(function(trend) {
            return blocks['b-trend'](trend);
        })
    };
};