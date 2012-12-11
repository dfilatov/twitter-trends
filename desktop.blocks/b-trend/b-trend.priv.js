blocks['b-trend'] = function(trend) {
    return {
        block   : 'b-trend',
        mix     : [{ block : 'b-island' }],
        content : [
            { elem : 'name', content : trend.name },
            { elem : 'url', content : trend.url },
            {
                elem    : 'tweets',
                content : trend.tweets.map(function(tweet) {
                    return blocks['b-tweet'](tweet);
                })
            }
        ]
    };
};