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
    var addNoRatingsSection = function() {
        setTimeout(function() {
            if ($('.pr-snapshot-no-ratings') === null) {
                addNoRatingsSection();
            } else {
                $('#reviewsTabCon').append($('.pr-snapshot-no-ratings'));
            }
        }, 500);
    };
    var createRangeInReview = function() {
        var $container = $('<div class="c-review-ranges"></div>');

        var $rangeContainer = $('.pr-other-attributes-histogram .pr-other-attributes-list:first-child');
        $rangeContainer.find('.pr-other-attributes-group').each(function() {
            // clone template
            var $itemClone = $('.c-review-range').find('.c-range-item').clone();

            // title
            $itemClone.find('.c-review-heading').append($(this).find('.pr-other-attribute-label').text());

            // max range
            $(this).find('.pr-other-attribute-value-histogram-element-max td').each(function() {
                var $maxClone = $(this).clone();
                $itemClone.find('.c-max-range').append($maxClone.children());
            });

            // all ranges
            $(this).find('.pr-other-attribute-value-histogram-element td').each(function() {
                if ($(this).hasClass('pr-other-attribute-value-histogram-label') && $(this).parent().hasClass('pr-other-attribute-value-histogram-element-max')) {
                    $(this).find('p').addClass('c-main-review-heading');
                }
                $itemClone.find('.c-all-range').append($(this).children());
            });

            $container.append($itemClone);
        });

        $container.insertAfter($('.pr-snapshot-rating-wrapper'));

        $('.c-range-see-all, .c-range-see-less').on('click', function() {
            var $parent = $(this).parent();
            $parent.find('.c-all-range, .c-max-range, .c-range-see-all, .c-range-see-less').toggle();
        });
    };

    return {
        setHeadings: setHeadings,
        updatePaginationButtons: updatePaginationButtons,
        addNoRatingsSection: addNoRatingsSection,
        createRangeInReview: createRangeInReview
    };
});
