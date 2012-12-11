var toStr = Object.prototype.toString;

module.exports = {
    merge : function() {
        var res = {};

        for(var i = 0, len = arguments.length; i < len; i++) {
            var obj = arguments[i];
            if(obj) {
                for(var name in obj) {
                    obj.hasOwnProperty(name) && (res[name] = obj[name]);
                }
            }
        }

        return res;
    },

    isFunction : function(obj) {
        return toStr.call(obj) === '[object Function]';
    },

    noOp : function() {},

    pad : function(str, len, symbol) {
        return (str = '' + str).length < len?
            new Array(len - str.length + 1).join(symbol) + str :
            str;
    }
};