define([
    '$',
],
function($) {

    var $reviewBellow = $('.c-reviews-bellow');

    // Changing Header position in reviews container
    var changeHeadingPosition = function() {
        var $heading;
        var $container = $('#reviewsTabCon').find('.pr-review-wrap');
        if ($container === null) {
            changeHeadingPosition();
        } else {
            $container.each(function() {
                $heading = $(this).find('.pr-review-rating-headline');
                $container = $(this).find('.pr-review-rating-wrapper');
                $heading.insertBefore($container);
            });
        }
    };

    // Creating pagination Buttons
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

    // Creating no reviews section
    var noReviewsSection = function() {
        setTimeout(function() {
            if ($('.pr-snapshot-no-ratings') === null) {
                noReviewsSection();
            } else {
                $('#reviewsTabCon').append($('.pr-snapshot-no-ratings'));
            }
        }, 500);
    };

    // Range Section Styling
    var updatingRangeSection = function() {
        var $container = $('<div class="c-review-ranges"></div>');
        var $rangeContainer = $('.pr-other-attributes-histogram .pr-other-attributes-list:first-child');
        $rangeContainer.find('.pr-other-attributes-group').each(function() {
            var $itemClone = $('.c-review-range').find('.c-range-item').clone();
            $itemClone.find('.c-review-heading').append($(this).find('.pr-other-attribute-label').text());
            $(this).find('.pr-other-attribute-value-histogram-element-max td').each(function() {
                var $maxClone = $(this).clone();
                $itemClone.find('.c-max-range').append($maxClone.children());
            });
            $(this).find('.pr-other-attribute-value-histogram-element td').each(function() {
                if ($(this).hasClass('pr-other-attribute-value-histogram-label') && $(this).parent().hasClass('pr-other-attribute-value-histogram-element-max')) {
                    $(this).find('p').addClass('c-main-review-heading');
                }
                $itemClone.find('.c-max-range').append($(this).children());
            });

            $container.append($itemClone);
        });

        $container.insertAfter($('.pr-snapshot-rating-wrapper'));

    };

    // Review's Sort by styling
    var transformSortBy = function() {
        var $sortBy = $('.pr-review-sort-box');
        $sortBy.find('label').text('Sort By:');
    };

    var getCurentPage = function(paginationWrapper) {
        var $paginationWrapper = paginationWrapper.find('.pr-pagination-bottom');
        var $prev = $paginationWrapper.find('.pr-page-prev');
        var $next = $paginationWrapper.find('.pr-page-next');
        var currentPage = 1;
        if ($prev.find('a').length > 0) {
            var $text = $prev.find('a').attr('onclick');
            var $pageNo = $text.slice($text.indexOf('(') + 1, $text.indexOf(','));
            currentPage =  parseInt($pageNo) + 1;
        }
        return currentPage;
    };

    var createPaginationDropDown = function() {
        var totalReviewCount;
        var $paginationWrapper;
        var totalPages;
        var options = [];
        var currentPage;
        var $select;
        var $dropDownContainer;
        if ($('.pr-page-nav').html() === null) {
            return;
        }
        totalReviewCount = $reviewBellow.find('.pr-review-count').text();
        totalReviewCount = (/\d+/g).exec(totalReviewCount)[0];
        $paginationWrapper = $('#reviewsTabCon');
        totalPages = Math.ceil(totalReviewCount / 30);
        if (totalPages === 1) {
            return;
        }
        $select = $('<select class="c-review-page-dropdown"></select>');
        currentPage = getCurentPage($paginationWrapper);
        for (var i = 1; i <= totalPages; i++) {
            var text = 'Page ' + i + ' of ' + totalPages;
            if (currentPage === i) {
                $select.append('<option value="' + i + '"selected="selected">' + text + '</option>');
            } else {
                $select.append('<option value=' + i + '>' + text + '</option>');
            }
        }
        $dropDownContainer = $('<div class="c-review-dropdown"></div>');
        $dropDownContainer.append($select);
        $('.pr-pagination-bottom').append($dropDownContainer);
    };

    var reviewPaginationDropDownChangeFunc = function() {
        $('.c-review-page-dropdown').on('change', function() {
            var value = $(this).val();
            var $paginationWrapper = $('.pr-pagination-bottom');
            var text = $paginationWrapper.find('.pr-page-nav a').attr('onclick');
            var parts = text.split('getReviewsFromMeta(');
            var secondpart = parts[1].split(/,(.+)?/)[1];
            var newLink = parts[0] + 'getReviewsFromMeta(' + value + ',' + secondpart;
            $('.c-temp-review-pagination-anchor').attr('onclick', newLink);
            $('.c-temp-review-pagination-anchor').click();
            setTimeout(function() {
                changeHeadingPosition();
                updatePaginationButtons();
                transformSortBy();
                createPaginationDropDown();
            }, 1000);
        });
    };

    return {
        changeHeadingPosition: changeHeadingPosition,
        updatePaginationButtons: updatePaginationButtons,
        noReviewsSection: noReviewsSection,
        updatingRangeSection: updatingRangeSection,
        transformSortBy: transformSortBy,
        createPaginationDropDown: createPaginationDropDown,
        getCurentPage: getCurentPage,
        reviewPaginationDropDownChangeFunc: reviewPaginationDropDownChangeFunc
    };
});
