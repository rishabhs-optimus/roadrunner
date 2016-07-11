define(['$', 'global/utils'], function($) {

    // Get pages
    var getPages = function($pages) {
        return $pages.map(function(_, pageNumber) {
            var $pageNumber = $(pageNumber);
            return {
                isCurrent:  $pageNumber.hasClass('active') ? true : false,
                pageHref: $pageNumber.find('a').attr('href'),
                pageNumber: $pageNumber.text()
            };
        });
    };



    var _parse = function($container) {

        var $previous = $container.find('.prev');
        var $next = $container.find('.next');

        return {
            prev: {
                prevTag: $previous,
                prevHref: $previous.find('a').attr('href'),
                iconName: 'left'
            },
            pages: getPages($container.find('li:not(.prev, .next)')),
            next: {
                nextTag: $next,
                nextHref: $next.find('a').attr('href'),
                iconName: 'right'
            }
        };

    };

    return {
        parse: _parse
    };
});
