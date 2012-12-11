BEM.DOM.decl('b-trends-rotator', {
    onSetMod : {
        'js' : {
            'inited' : function() {
                this._trendsQueue = [];
                this._loadTrends();
            }
        }
    },

    _loadTrends : function() {
        setTimeout(
            function() {
                $.get('/?body=true').done(this._onTrendsLoaded.bind(this));
            }.bind(this),
            this.params.delay);
    },

    _onTrendsLoaded : function(html) {
        var _this = this;
        $(html).children().each(function() {
            _this._trendsQueue.push($(this));
        });

        this._appendTrend();
    },

    _appendTrend : function() {
        if(!this._trendsQueue.length) {
            return;
        }

        var newTrend = this._trendsQueue.shift(),
            firstTrend = this.findElem('trend').eq(0);

        firstTrend.animate({ marginTop : -firstTrend.height(), opacity : 0 }, function() {
            BEM.DOM.destruct(firstTrend);
        });

        BEM.DOM.append(this.domElem, newTrend);
        this._trendsQueue.length?
            setTimeout(this._appendTrend.bind(this), this.params.delay) :
            this._loadTrends();
    },

    getDefaultParams : function() {
        return {
            delay : 5000
        };
    }
});
