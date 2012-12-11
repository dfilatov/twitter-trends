blocks['b-tweet'] = function(tweet) {
    return {
        block : 'b-tweet',
        content : [
            {
                elem : 'ava',
                content : { elem : 'ava-img', src : tweet.user.ava }
            },
            { elem : 'user', content : tweet.user.name },
            { elem : 'date', content : tweet.date },
            { elem : 'text', content : tweet.text }
        ]
    };
};