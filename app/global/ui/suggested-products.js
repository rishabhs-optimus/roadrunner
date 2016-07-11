define([
    '$',
    'hijax',
    'dust!components/scroller/scroller',
    'global/parsers/product-tile-parser'
], function($, Hijax, ScrollerTmpl, productTileParser) {


    var buildSuggestedProducts = function(JSONData) {
        var $container = $('.js-suggested-products');
        var $heading = $('<h2 class="c-title c--small u-margin-bottom-md">').text('You Might Also Like');
        var currencyConversion = $('#gwt_international_conversion_rate').val();
        var productTileData = [];

        if (!JSONData) {
            return;
        }
        var parsedProducts = JSONData.products.map(function(product, _) {
            return productTileParser.parseFromJSON(product, currencyConversion);
        });

        var scrollerData = {
            slideshow: {
                productTiles: parsedProducts
            }
        };

        new ScrollerTmpl(scrollerData, function(err, html) {
            $container.empty().html(html);
        });

        $container.prepend($heading);
    };

    var initHijax = function() {
        var hijax = new Hijax();

        hijax.set(
            'suggested-products-proxy',
            function(url) {
                return /RecommendationsJSONCmd/.test(url);
            },
            {
                complete: function(data, xhr) {
                    var JSONData = JSON.parse(data);
                    var suggestedProductsJSON = JSONData.requestResults[0];
                    buildSuggestedProducts(suggestedProductsJSON);
                }
            }
        );
    };


    return {
        init: initHijax
    };
});
