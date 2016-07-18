define([
    '$',
    'global/utils',
    'magnifik',
    'translator',
    'hijax',
    'bellows',
    'components/sheet/sheet-ui',
    'dust!components/scroller/scroller',
    'pages/product-details/ui/pdp-reviews'
    // 'global/parsers/product-tile-parser'

], function($, Utils, Magnifik, translator, Hijax, bellows, sheet, ScrollerTmpl, pdpReviews) {
    //productTileParser
    var displayTabs = function() {
        $('#grp_1,#grp_2,#grp_3,#grp_4').show();
    };
    var reviewSection = function() {
        pdpReviews.addNoRatingsSection();
        pdpReviews.changeHeadingPosition();
        pdpReviews.updatePaginationButtons();
        pdpReviews.createRangeInReview();

    };
    var bindEvents = function() {
        $('body').on('click', '.pr-page-next', function() {
            setTimeout(function() {
                pdpReviews.addNoRatingsSection();
                pdpReviews.changeHeadingPosition();
                pdpReviews.updatePaginationButtons();
            }, 1000);
        });
        $('body').on('click', '.pr-page-prev', function() {
            setTimeout(function() {
                pdpReviews.addNoRatingsSection();
                pdpReviews.changeHeadingPosition();
                pdpReviews.updatePaginationButtons();
            }, 1000);
        });
        $('body').on('change', '#pr-sort-reviews', function() {
            setTimeout(function() {
                pdpReviews.addNoRatingsSection();
                pdpReviews.changeHeadingPosition();
                pdpReviews.updatePaginationButtons();
            }, 1000);
        });
    };

    var youMayAlsoLike = function() {
        var $container = $('.js-suggested-products');
        var $parsedProducts = [];
        var $heading = $('<h2 class="c-title c--small u-margin-bottom-md">').text('You Might Also Like');
        var productTileData = [];
        setTimeout(function() {
            if ($('#PRODPG1_cm_zone').children().length === 0) {
                youMayAlsoLike();
            } else {
                var $items = $('.pdetailsSuggestionsCon');
                var $titles = $items.find('strong').each(function() {
                    var $this = $(this);
                });
                $items.map(function(_, item) {
                    var $item = $(item);
                    var $content = {
                        slideContent :$item
                    };
                    $parsedProducts.push($content);
                });
                var scrollerData = {
                    slideshow: {
                        slides: $parsedProducts
                    }
                };

                new ScrollerTmpl(scrollerData, function(err, html) {
                    $container.empty().html(html);
                });

                $container.prepend($heading);
            }
        }, 500);
        $('#pdetails_suggestions').addClass('u-visually-hidden');
    };


    var interceptAddToCart = function interceptAddToCart() {

        var _updateShoppingCartSummary = window.updateShoppingCartSummary;
        window.updateShoppingCartSummary = function() {
            var isValid = !$('.prod_errortext, .ref2Selected.refNotAvailable').length;
            var result = _updateShoppingCartSummary.apply(this, arguments);
            var html = $('.addToCartTitle').html();

            $('.c-add-to-cart').toggleClass('m--disabled', isValid);

            if (isValid) {
                /*
                TODO: Don't hardcode this. Either find the element and wrap
                it, or store this in dictionary.json if this is the only text
                we need to target (not recommended).
                */
                $('.addToCartTitle').html(
                    html.replace('Great Choice!', '<b>Great Choice!</b>')
                );

                var $container = $('.c-addToCartPinny');
                if ($container.find('.prod_detail_sale_price').length && $container.find('.prod_detail_sale_price').text().length > 0) {
                    $container.find('.prod_detail_reg_price').addClass('m--lineThrough');
                }

                $('.c-add-to-cart').removeClass('m--disabled');
                if (!$('.c-addedToCartPinnyWrapper').hasClass('pinny--is-open')) {
                    $('.c-addToCartPinny').pinny('open');
                }
            }

            return result;
        };

    };

    var updateCartMessage = function updateCartMessage() {
        var hijax = new Hijax();
        // Intercept AJAX requests
        hijax.set(
            'UpdateCartMessageHijaxProxy',
            function(url) {
                return /quickInfoAjaxAddToCart/.test(url);
            },
            {
                complete: function(data, xhr) {
                    interceptAddToCart();
                    if ($('#addToCartInfoCont').find('#addToCartInfoTitle').html() === null ) {
                        $('#addToCartInfoTitle').insertAfter($('#addToCartVIPMsg'));
                    }
                    $('#addToCartInfoTitle').append($('<span class="addToCartTitle"></span>'));
                }
            }
        );
    };

    var scrollToTop = function() {
        $('.js-back-to-top').on('click', function() {
            $('html, body').animate({ scrollTop: 0 }, 'slow');
        });
    };

    var productDetailsUI = function() {
        displayTabs();
        reviewSection();
        youMayAlsoLike();
        bindEvents();
        updateCartMessage();
        scrollToTop();
    };

    return productDetailsUI;
});
