define(['$'], function($) {

    var _parse = function($suggestionContainer) {
        var $termSuggestions = $suggestionContainer.find('.sli_ac_suggestions li');
        var $productSuggestions = $suggestionContainer.find('.sli_ac_products li');

        return {
            termSuggestions: $termSuggestions.map(function(i, suggestion) {
                return $(suggestion).find('.sli_ac_suggestion').html();
            }),

            productHeading: $suggestionContainer.find('.sli_ac_products h2').text(),

            productSuggestions: $productSuggestions.map(function(i, product) {
                var $productContainer = $(product);

                return {
                    img: $productContainer.find('.sli_ac_image').addClass('u-margin-right-md'),
                    productName: $productContainer.find('h3').html(),
                    priceContainer: $productContainer.find('.rac_priceLine')
                };
            })
        };
    };

    return {
        parse: _parse
    };
});
