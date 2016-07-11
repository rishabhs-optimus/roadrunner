define([
    '$'
], function($) {

    var parse = function($termSuggestions) {
        return {
            suggestions: function() {
                return {
                    termSuggestions: $termSuggestions.map(function(i, suggestion) {
                        var $suggestion = $(suggestion).find('a');
                        return $suggestion.length ? $suggestion : null;
                    })
                };
            }
        };
    };

    return {
        parse: parse
    };
});
