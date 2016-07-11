define(['$'], function($) {

    var parse = function($relatedSearches) {
        return {
            productHeading: $relatedSearches.find('.br-related-heading').text(),
            productSuggestions: $relatedSearches.find('.br-related-query').map(function(i, suggestion) {
                var $suggestion = $(suggestion);
                return {
                    productName: $suggestion.find('a').html(),
                    href: $suggestion.find('a').attr('href'),
                    isSearchIconPresent: true
                };
            })
        };
    };

    return {
        parse: parse
    };
});
