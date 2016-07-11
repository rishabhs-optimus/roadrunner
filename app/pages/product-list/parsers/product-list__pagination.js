define(['$'], function($) {

    // Get pages
    var getPages = function($pages) {
        return $pages.map(function(_, pageNumber) {
            var $pageNumber = $(pageNumber);
            return {
                isCurrent:  $pageNumber.hasClass('pageactive') ? true : false,
                pageHref: $pageNumber.find('a').attr('href'),
                pageNumber: $pageNumber.text()
            };
        });
    };
    var parse = function($container) {
        var $viewAllLink = $container.find('.sli_viewall a');
        if ($viewAllLink.text() === 'VIEWALL') {
            $viewAllLink.text('View All');
        } else if ($viewAllLink.text() === 'VIEWFEWER') {
            $viewAllLink.text('View Less');
        }
        var $previous = $container.find('[class^="sli_page_prev"]').parent().parent();
        var $next = $container.find('[class^="sli_page_next"]').parent().parent();
        return {
            prev: {
                prevTag: $previous,
                prevHref: $previous.find('a').attr('href'),
                iconName: 'left'
            },
            pages: getPages($container.find('.pages > div')),
            next: {
                nextTag: $next,
                nextHref: $next.find('a').attr('href'),
                iconName: 'right'
            },
            viewAllLink: $container.find('.sli_viewall')
        };

    };

    return {
        parse: parse
    };
});
