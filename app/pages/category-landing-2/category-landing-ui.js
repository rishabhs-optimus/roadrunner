define([
    '$',
    'components/pagination/pagination-ui',
    'dust!components/product-tile/product-tile',
    'pages/category-landing-2/parsers/product-tile-parser',
],
function($, paginationUI, ProductTileTmpl, ProductTileParser) {

    var $loader = $('.js-filter-loader');

    var transformCategoryItem = function($container) {
        var data = {
            products: ProductTileParser.parse($container)
        };
        new ProductTileTmpl(data, function(err, html) {
            $('.js-category-items').html($(html));

            if ($('.js-category-items').find('.c-product-tile').length <= 12) {
                $('.c-view-less').hide();
            }
        });

        $loader.addClass('u--hide');
        $('.js-clp-pagination, .c-sorting-filter').removeClass('u--hide');
    };

    var isAllImagesLoaded = function() {
        var imgElements = $('#gwt_products_display .gwt-Anchor .gwt-browse-product-image');
        var imgURLs = 0;
        for (var i = 0; i < imgElements.length; i++) {
            if ($(imgElements[i]).attr('src')) {
                imgURLs++;
            }
        }

        if (imgElements.length === imgURLs) {
            transformCategoryItem($('#gwt_products_display'));
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

    var bindEventHandler = function() {

        $('.c-pagination .c-view-all').on('click', function() {
            $('#topItemsPerPage').val(Number($('#topItemsPerPage option:last').attr('value')));
            $('#topItemsPerPage').trigger('change');
        });

        $('.js-view-less').on('click', function() {
            $('#topItemsPerPage').val(Number($('#topItemsPerPage option:first').attr('value')));
            $('#topItemsPerPage').trigger('change');
        });
    };

    var productTileInit = function(useDefault) {
        bindAnimationStart();
    };

    var categoryLandingUI = function() {
        productTileInit();
        bindEventHandler();
        paginationUI.init();
    };

    return categoryLandingUI;
});
