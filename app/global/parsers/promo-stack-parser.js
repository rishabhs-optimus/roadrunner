define([
    '$'
], function($) {
    var _parse = function($promo) {
        return {
            headerSrc: $promo.find('*[data-header]').attr('data-header'),
            headerText: $promo.find('*[data-header]').attr('alt'),
            links: $promo.find('a').map(function() {
                var $link = $(this);

                return {
                    href: $link.attr('href'),
                    cta: $link.find('img').attr('alt')
                };
            })
        };
    };

    return {
        parse: _parse
    };
});
