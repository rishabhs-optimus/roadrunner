define(['$', 'global/utils'], function($) {

    // Get pages
    var getPages = function($pages) {
        return $pages.map(function(_, pageNumber) {
            var $pageNumber = $(pageNumber);
            return {
                isCurrent:  $pageNumber.hasClass('BVRRSelectedPageNumber') ? true : false,
                pageHref: $pageNumber.find('a').attr('data-bvjsref'),
                pageBvcfg: $pageNumber.find('a').attr('data-bvcfg'),
                pageNumber: $pageNumber.text()
            };
        });
    };



    var _parse = function($container) {
        var $previous = $container.find('.BVRRPreviousPage');
        var $next = $container.find('.BVRRNextPage');
        return {
            pagination: $container.length ? true : false,
            prev: $previous ? {
                prevTag: $previous,
                prevHref: $previous.find('a').attr('data-bvjsref'),
                prevBvcfg: $previous.find('a').attr('data-bvcfg'),
                iconName: 'left'
            } : false,
            pages: getPages($container.find('.BVRRPageNumber')),
            next: $next ? {
                nextTag: $next,
                nextHref: $next.find('a').attr('data-bvjsref'),
                nextBvcfg: $next.find('a').attr('data-bvcfg'),
                iconName: 'right'
            } : false,
            viewAllLink: false
        };

    };

    return {
        parse: _parse
    };
});
