define(['$'], function($) {

    var parse = function($container) {
        var $carouselItems = $container.find('.tilePanel .carouselTile, .br-sf-widget')
            .map(function(_, item) {
                var $item = $(item);
                return {
                    img: $item.find('img').first(),
                    href : $item.find('a').first().attr('href'),
                    heading: $item
                        .find('.gwt-we-suggest-panel-name-anchor, .br-sf-widget-merchant-title').text()
                };
            });

        var $title = $('.title-component, .c-carousel-wrapper');
        var titleText = $title.find('h2, h3').text() ||
                    $('.gwt-salutation').find('h3').text() ||
                    $('.br-found-heading').text();

        return {
            carouselTitle: titleText,
            carouselSubTitle: $title.find('p'),
            items: $carouselItems
        };
    };

    return {
        parse: parse
    };
});
