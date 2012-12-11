blocks['b-page'].title = function(data) {
    return 'Top trends';
};

blocks['b-page'].content = function(data) {
    return data['top-trends'].map(function(trend) {
        return blocks['b-trend'](trend);
    });
};