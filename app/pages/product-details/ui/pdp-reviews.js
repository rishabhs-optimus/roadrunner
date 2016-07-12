define([
    '$',
],
function($) {


    var setHeadings = function setHeadings() {
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

    return {
        setHeadings: setHeadings
    };
});
