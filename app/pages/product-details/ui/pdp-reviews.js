define([
    '$',
],
function($) {

    // Get current page
    var getCurentPage = function getCurentPage(paginationWrapper) {
        var $paginationWrapper = paginationWrapper.find('.pr-pagination-bottom');
        var $prev = $paginationWrapper.find('.pr-page-prev');
        var $next = $paginationWrapper.find('.pr-page-next');
        var currentPage = 1;
        if ($prev.find('a').html() !== null) {
            var text = $prev.find('a').attr('onclick');
            var pageNo = text.slice(text.indexOf('(') + 1, text.indexOf(','));
            currentPage =  parseInt(pageNo) + 1;
        }
        return currentPage;
    };

    // Creates pagination dropdown
    var createPaginationDropDown = function createPaginationDropDown() {
        if ($('.pr-page-nav').html() === null) {
            return;
        }

        var $bellows = $('.c-pdp-tabs');
        var totalReviewCount = $bellows.find('.bellows__item:nth-child(3) .x-bellowsText').text();
        totalReviewCount = totalReviewCount.slice(totalReviewCount.indexOf('(') + 1, totalReviewCount.indexOf(')'));

        var $paginationWrapper = $('#reviewsTabCon');
        var perPageCount = $paginationWrapper.find('.pr-pagination-top .pr-page-count strong').text();
        perPageCount = perPageCount.split('-')[1];

        // TODO: TBD - Why is this 30 hardcoded? This should be picked from desktop rather than hardcoded
        var totalPages = Math.ceil(totalReviewCount / 30);
        var options = [];

        // TODO: Html structures should not be created in JS but from dust
        var $select = $('<select class="c-review-page-dropdown"></select>');

        var currentPage = getCurentPage($paginationWrapper);
        for (var i = 1; i <= totalPages; i++) {

            var text = 'Page ' + i + ' of ' + totalPages;
            if (currentPage === i) {
                $select.append('<option value="' + i + '"selected="selected">' + text + '</option>');
            } else {
                $select.append('<option value=' + i + '>' + text + '</option>');
            }
        }
        var $dropDownContainer = $('<div class="c-review-dropdown"></div>');
        $dropDownContainer.append($select);
        $('.pr-pagination-bottom').append($dropDownContainer);
    };

    // Adds No Ratings section
    var addNoRatingsSection = function addNoRatingsSection() {
        // TODO: Remove setTimeout
        setTimeout(function() {
            if ($('.pr-snapshot-no-ratings') === null) {
                addNoRatingsSection();
            } else {
                $('#reviewsTabCon').append($('.pr-snapshot-no-ratings'));
            }
        }, 500);
    };

    // Sets headings
    var setHeadings = function setHeadings() {
        var $heading, $container;
        //moved heading ouside
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

    // Updates pagination buttons
    var updatePaginationButtons = function reviewSectionPagination() {
        var $paginationWrapper = $('.pr-pagination-bottom');
        // on first page
        var $previousPageLink = $paginationWrapper.find('.pr-page-prev');
        if ($previousPageLink.find('a').length === 0) {
            $previousPageLink.text('Back');
            $previousPageLink.addClass('c-prev-disabled');
        } else {
            $previousPageLink.find('a').text('Back');
        }
        var $nextPageLink = $paginationWrapper.find('.pr-page-next');
        if ($nextPageLink.find('a').length === 0) {
            $nextPageLink.text('Next');
            $nextPageLink.addClass('c-next-disabled');
        } else {
            $nextPageLink.find('a').text('Next');
        }
    };

    // Function to create range in review section
    var createRangeInReview = function createRangeInReview() {
        // TODO: Html strctures should be in dust and not in JS
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

    // Review pagination dropdown functionality
    var reviewPaginationDropDownChangeFunc = function reviewPaginationDropDownChangeFunc() {
        $('.c-review-page-dropdown').on('change', function() {
            var value = $(this).val();
            var $paginationWrapper = $('.pr-pagination-bottom');
            var text = $paginationWrapper.find('.pr-page-nav a').attr('onclick');
            var parts = text.split('getReviewsFromMeta(');
            var secondpart = parts[1].split(/,(.+)?/)[1];
            var newLink = parts[0] + 'getReviewsFromMeta(' + value + ',' + secondpart;
            $('.c-temp-review-pagination-anchor').attr('onclick', newLink);
            $('.c-temp-review-pagination-anchor').click();
        });
    };


    var sortByDropDown = function sortByDropDown() {
        var $dropDown = $('.pr-review-sort-box').find('select');
        var defaultOption = $dropDown.find('option:selected');
        var defaultText = defaultOption.text();

        defaultOption.attr('data-text', defaultOption.text());
        defaultOption.text('Sort By: ' + defaultText);

        $dropDown.change(function() {
            var option = this.options[this.selectedIndex];

            // Show a loading indicator
            $('.pr-review-engine').addClass('c--loading');

            option.setAttribute('data-text', option.text);
            option.text = 'Sort By: ' + option.text;

            // Reset texts for all other but current
            for (var i = this.options.length; i--; ) {
                if (i === this.selectedIndex) continue;
                var text = this.options[i].getAttribute('data-text');
                if (text) this.options[i].text = text;
            }
        });
    };

    return {
        addNoRatingsSection: addNoRatingsSection,
        getCurentPage: getCurentPage,
        createPaginationDropDown: createPaginationDropDown,
        setHeadings: setHeadings,
        updatePaginationButtons: updatePaginationButtons,
        createRangeInReview: createRangeInReview,
        reviewPaginationDropDownChangeFunc: reviewPaginationDropDownChangeFunc,
        sortByDropDown: sortByDropDown
    };
});
