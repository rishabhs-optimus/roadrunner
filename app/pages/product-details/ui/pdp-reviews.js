define([
    '$',
],
function($) {


    var setHeadings = function() {
        var $heading, $container;
        $container = $('#reviewsTabCon').find('.pr-review-wrap');
        if ($container === null) {
            setHeadings();
        } else {
            $container.each(function() {
                $heading = $(this).find('.pr-review-rating-headline');
                $container = $(this).find('.pr-review-rating-wrapper');
                $heading.insertBefore($container);
            });
        }
    };
    var updatePaginationButtons = function() {
        var $pagination = $('.pr-pagination-bottom');
        var $next = $pagination.find('.pr-page-next');
        var $previous = $pagination.find('.pr-page-prev');
        if ($next.find('a').length === 0) {
            $next.text('Next');
            $next.addClass('c-next-disabled');
        } else {
            $next.find('a').text('Next');
        }
        if ($previous.find('a').length === 0) {
            $previous.text('Back');
            $previous.addClass('c-prev-disabled');
        } else {
            $previous.find('a').text('Back');
        }
    };

    return {
        setHeadings: setHeadings,
        updatePaginationButtons: updatePaginationButtons
    };
});
