blocks['b-page'].title = function(data) {
    return 'Top trends';
};

blocks['b-page'].content = function(data) {
    return {
        block   : 'b-trends-rotator',
        content : data['top-trends'].map(function(trend) {
            var trendBEMJSON = blocks['b-trend'](trend);
            trendBEMJSON.mix.push({ block : 'b-trends-rotator', elem : 'trend' });
            return trendBEMJSON;
        })
    };
};