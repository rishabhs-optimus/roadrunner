define([
    '$'
], function($) {
    var _parse = function($promo) {
        return {
            href: $promo.attr('href'),
            imgSrc: $promo.find('*[data-src]').attr('data-src'),
            cta: $promo.find('*[data-src]').attr('alt')
        };
    };

    return {
        parse: _parse
    };
});
