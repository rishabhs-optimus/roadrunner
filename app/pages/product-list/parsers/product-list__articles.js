define([
    '$'
], function($) {

    // Get Articles - used article list card component
    var parse = function($products, isUIScript) {
        return $products.map(function(_, item) {
            var $item = $(item);
            $('.t-product-list__refine-results').prop('hidden', 'hidden');
            return {
                articleLink: $item.find('.sli_travel_image a'),
                articleHeading: $item.find('.sli_h2 a').text(),
                articleDescription: $item.find('.sli_travel_content p').html(),
                articleImage: $item.find('.sli_travel_image img').removeAttr('style')
            };
        });

    };

    return {
        parse: parse
    };
});
