define([
    '$',
    'translator',
    'dust!components/category-landing-items/category-landing-items',
    'components/category-landing-items/parsers/category-landing-item-parser',
],
function($, translator, CategoryLandingItemTmp, categorylandingItemParser) {

    var $loader = $('.js-filter-loader');

    var transformCategoryItem = function($container) {
        var data = {
            categoryListItem: categorylandingItemParser.parse($container)
        };
        new CategoryLandingItemTmp(data, function(err, html) {
            $('.js-category-items').html($(html));
        });

        $loader.addClass('u--hide');
    };

    var isAllImagesLoaded = function() {
        var imgElements = $('#gwt_subcategories_dp .gwt-sub-sub-category-main-container .gwt-sub-category-image');
        var imgURLs = 0;

        for (var i = 0; i < imgElements.length; i++) {
            if ($(imgElements[i]).attr('src')) {
                imgURLs++;
            }
        }

        if (imgElements.length === imgURLs) {
            transformCategoryItem($('#gwt_subcategories_dp'));
        } else {
            setTimeout(isAllImagesLoaded, 500);
        }
    };

    var handleCategoryItems = function() {

        if (event.animationName === 'categoryItemAdded') {
            $loader.removeClass('u--hide');
            setTimeout(isAllImagesLoaded, 500);
        }
    };

    var bindAnimationStart = function() {
        document.addEventListener('animationStart', handleCategoryItems);
        document.addEventListener('webkitAnimationStart', handleCategoryItems);
    };

    var init = function(useDefault) {
        bindAnimationStart();
    };

    return {
        init: init
    };
});
