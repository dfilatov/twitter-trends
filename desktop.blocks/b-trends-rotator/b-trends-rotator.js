BEM.DOM.decl('b-trends-rotator', {
    onSetMod : {
        'js' : {
            'inited' : function() {
                this._loadTrends();
            }
        }
    },

    _loadTrends : function() {
        setTimeout(
            function() {
                $.get('/?body=true').done(this._onTrendsLoaded.bind(this));
            }.bind(this),
            3000);
    },

    _onTrendsLoaded : function(html) {
        BEM.DOM.update(this.domElem, $(html).children());
        this._loadTrends();
    }
});
