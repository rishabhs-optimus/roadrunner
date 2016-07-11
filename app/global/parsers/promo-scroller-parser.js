define([
    '$'
], function($) {
    var _parse = function($promo) {
        var $items = $promo.find('.category--image').parent();
        return {
            heading: $promo.children('img').attr('alt'),
            items: $items.map(function() {
                var $item = $(this);

                return {
                    href: $item.attr('href'),
                    imgSrc: $item.find('img').attr('data-src'),
                    cta: $item.find('img').attr('alt')
                };
            }),
        };
    };

    return {
        parse: _parse
    };
});
