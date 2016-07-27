define([
    '$',
    'global/utils',
    'magnifik',
    'translator',
    'hijax',
    'bellows',
    'components/sheet/sheet-ui',
    'dust!components/scroller/scroller',
    'pages/product-details/ui/pdp-reviews',
    'dust!components/loading/loading',
    'scrollTo'

], function($, Utils, Magnifik, translator, Hijax, bellows, sheet, ScrollerTmpl, pdpReviews, LoadingTemplate) {
    var $addToCartPinny = $('.js-added-to-cart-pinny');
    var $videoBellows = $('.c-video-bellows');
    var $reviewBellow = $('.c-reviews-bellow');

    // Displaying desktop tabs
    var displayTabs = function() {
        $('#grp_1,#grp_2,#grp_3,#grp_4').show();
    };

    // Creating review section
    var reviewSection = function() {
        pdpReviews.noReviewsSection();
        pdpReviews.changeHeadingPosition();
        pdpReviews.updatePaginationButtons();
        pdpReviews.updatingRangeSection();
        pdpReviews.transformSortBy();
        pdpReviews.createPaginationDropDown();
        pdpReviews.reviewPaginationDropDownChangeFunc();

    };

    // Updating reviews section on handling pagination and sort by
    var updateReviewsSection = function() {
        pdpReviews.changeHeadingPosition();
        pdpReviews.updatePaginationButtons();
        pdpReviews.transformSortBy();
        pdpReviews.createPaginationDropDown();
        pdpReviews.reviewPaginationDropDownChangeFunc();
    };

    // Handling click functionality
    var bindEvents = function() {
        $('body').on('click', '.pr-page-next, .pr-page-prev', function() {
            setTimeout(function() {
                updateReviewsSection();
                $.scrollTo($reviewBellow);
            }, 1000);
        });

        $('body').on('change', '#pr-sort-reviews', function() {
            var $container = $('.pr-contents-wrapper');
            new LoadingTemplate(true, function(err, html) {
                $container.empty().append($(html));
            });

            setTimeout(function() {
                updateReviewsSection();
                $.scrollTo($reviewBellow);
            }, 500);
        });

        $('.c-review-page-dropdown').on('change', function() {
            pdpReviews.reviewPaginationDropDownChangeFunc();
            setTimeout(function() {
                $.scrollTo($reviewBellow);
            }, 1000);
        });

        $('body').on('click', '#videoLinkButton', function() {
            // Scroll to Video Bellows
            $.scrollTo($videoBellows);
            // Open Bellows for Video
            // This is required as SVG icon was not changing on call of Bellows open method
            if (!$videoBellows.hasClass('bellows--is-open')) {
                $videoBellows.find('.bellows__header').click();
            }
        });

        $('body').on('click', '.c-overallRating', function() {
            var $reviewsBellows = $('.c-reviews-bellow');
            // Scroll to Reviews Bellows
            $.scrollTo($reviewsBellows);
            // Open Bellows for Reviews
            // This is required as SVG icon was not changing on call of Bellows open method
            if (!$reviewsBellows.hasClass('bellows--is-open')) {
                $reviewsBellows.find('.bellows__header').click();
            }
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

        var _override  = window.updateShoppingCartSummary;
        window.updateShoppingCartSummary = function() {
            var override = _override.apply(this, arguments);
            var $desktopContainer = $('#addToCartInfo');
            var $content = $('#addToCartInfoCont');
            $content.find('#continueShoppingLink').insertAfter('#viewCartLink');
            $desktopContainer.find('#addToCartInfoTitle').addClass('c-added-to-cart-msg')
                .insertBefore($content.find('#addToCartInfoMsg'));
            $desktopContainer.addClass('u-visually-hidden');
            $addToCartPinny.find('.c-sheet__title').html(translator.translate('added_to_cart'));
            $addToCartPinny.find('.js-added-to-cart-pinny__body').html($content);
            $addToCartPinny.find('.pinny__close').addClass('container-close');
            if (!$addToCartPinny.hasClass('js-rendered')) {
                $addToCartPinny.find('#addToCartInfoTitle')
                    .html($addToCartPinny.find('#addToCartInfoTitle').html().replace('Great Choice!', '<b>Great Choice!</b>'));
                $addToCartPinny.pinny('open');
            }
            $addToCartPinny.addClass('js-rendered');
            return _override;
        };
    };

    var updateCartMessage = function updateCartMessage() {
        var hijax = new Hijax();
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

    var videoBellowState = function() {
        var $bellow = $('.js-product-bellows').find('.bellows__item.c-video-bellows');
        var $icon = $bellow.find('.c-bellows__header .c-icon');
        $icon.attr('data-fallback', 'img/png/minus.png');
        $icon.find('title').text('minus');
        $icon.find('use').attr('xlink:href', '#icon-minus');
        $bellow.addClass('bellows--is-open');
    };

    var createSwatchesSection = function() {
        var $swatches;
        $swatches.addClass('c-scroller');
        $swatches.find('div').first().addClass('c-scroller__content').removeAttr('style');
        $swatches.find('div').first().find('> div').last().addClass('c-slideshow').removeAttr('style');
        $('.c-slideshow').find('> div > div').removeAttr('style');
        $('.s7flyoutSwatch').each(function() {
            $(this).addClass('c-slideshow__slide');
        });
    };

    var interceptSwatchCreation = function interceptSwatchCreation() {

        var _override  = window.s7js.flyout.Swatch.prototype.onLoadComplete;
        window.s7js.flyout.Swatch.prototype.onLoadComplete = function() {
            var override = _override.apply(this, arguments);
            createSwatchesSection();
            return _override;
        };
    };

    var interceptCheckAddToCart = function interceptCheckAddToCart() {

        var _override  = window.checkAddToCart;
        window.checkAddToCart = function() {
            var override = _override.apply(this, arguments);
            if ($('#addToCartButton').attr('src').indexOf('_gr.gif') >= 0) {
                $('.prod_add_to_cart').addClass('c--disabled');
            } else {
                $('.prod_add_to_cart').removeClass('c--disabled');
            }
            return _override;
        };
    };

    var centerZoomImg = function() {
        var $zoomImg = $('.js-magnifik-image');
        var loaded = function() {
            var width = $('.c-magnifik').prop('offsetWidth') / 2;
            $('.c-loading').hide();
            $zoomImg.fadeIn();
            $('.c-magnifik').prop('scrollLeft', width);
        };

        if ($zoomImg[0].complete) {
            loaded();
        } else {
            $zoomImg[0].addEventListener('load', loaded);
        }
    };

    var magnifikPinny = function() {
        var $magnificPinnyEl = $('.js-magnifik');
        var magnificPinny = sheet.init($magnificPinnyEl, {
            shade: {
                opacity: 0.95,
                color: '#fff',
                zIndex: 2
            },
            open: function() {
                var imgSrc = $('.s7flyoutFlyoutView img').attr('src');
                $('.js-magnifik-image').attr('src', imgSrc);
                $('.js-magnifik-image').hide();
                $('.c-loading').show();
            },
            opened: function() {
                centerZoomImg();
            }
        });

        $('body').on('click', '.c-zoom-icon', function(e) {
            magnificPinny.open();
        });
    };

    var productDetailsUI = function() {
        displayTabs();
        reviewSection();
        youMayAlsoLike();
        bindEvents();
        updateCartMessage();
        scrollToTop();
        interceptAddToCart();
        videoBellowState();
        interceptSwatchCreation();
        interceptCheckAddToCart();
        setTimeout(function() {
            magnifikPinny();
        }, 500);

        $('body').on('click', '#continueShoppingLink', function() {
            var $closeButton = $addToCartPinny.find('.pinny__close');
            $closeButton.click();
        });
        sheet.init($addToCartPinny, {
            zIndex: 2000,
            shade: {
                zIndex: 1999,
                cssClass: 'js-wishlist-shade'
            },
            closed: function() {
                $('#addToCartInfo_mask').css('display', 'none');
                $('.js-added-to-cart-pinny').removeClass('js-rendered');
            }
        });
    };

    return productDetailsUI;
});
