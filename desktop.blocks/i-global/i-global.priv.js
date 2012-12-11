blocks['i-global'] = function() {
    return {
        block : 'i-global',
        js : true
    };
};

blocks['i-global'].params = function(params) {
    if(arguments.length) {
        this._params = params;
    }

    return this._params;
};