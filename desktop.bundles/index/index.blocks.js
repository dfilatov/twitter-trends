module.exports = {
    call : {
        'top-trends' : {
            call : {
                'trends' : {
                    include : 'includes/trends.js',
                    toState : { trends : '.trends[:3]' },
                    pointer : '.trends[:3]'
                },

                'tweets' : {
                    deps : 'trends',
                    guard : 'trends',
                    params : function(ctx) {
                        return { trends : ctx.state('trends') };
                    },
                    call : function(params) {
                        return params.trends.map(function(trend) {
                            return {
                                include : 'includes/tweets.js',
                                params : function() {
                                    var res = this.__base();
                                    res.data = { q : trend.query };
                                    return res;
                                },
                                pointer : '.results[:3]'
                            }
                        });
                    }
                }
            },

            done : function(res, _, promise) {
                promise.fulfill(buildTrendsWithTweets(res.trends, res.tweets));
            }
        }
    }
};

function buildTrendsWithTweets(trends, tweets) {
    return trends && !trends.error?
        trends.map(function(trend, i) {
            var trendTweets = tweets && tweets[i];
            return {
                name   : trend.name,
                url    : trend.url,
                tweets : trendTweets && !trendTweets.error?
                    trendTweets.map(function(tweet) {
                        return {
                            date : tweet.created_at,
                            user : {
                                name : tweet.from_user,
                                ava  : tweet.profile_image_url
                            },
                            text : tweet.text
                        };
                    }) :
                    []
            };
        }) :
        [];
}