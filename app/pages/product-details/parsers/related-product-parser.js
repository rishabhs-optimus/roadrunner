define([
    '$'
], function($) {


    var parse = function($product) {
        var $item = $($product);
        return {
            productTitle: $item.find('.br-sf-widget-merchant-popup-title').text(),
            productHref: $item.find('.br-sf-widget-merchant-popup-img a').attr('href'),
            productImage: $item.find('.br-sf-widget-merchant-popup-img img').attr('x-src'),
        };
    };

    return {
        parse: parse
    };
});
