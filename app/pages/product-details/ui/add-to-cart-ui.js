define([
    '$',
    'translator',
    'velocity',
    'dust!components/notification/partials/cart-item',
    'dust!pages/product-details/partials/modal-cart-item',
    'pages/product-details/parsers/cart-item-parser',
    'components/sheet/sheet-ui',
    'sheet-bottom'
], function($, translator, Velocity, NotificationCartItemTemplate, CartItemTemplate,
    cartItemParser, sheet, sheetBottom) {


    var $loader = $('<div class="c-loading c--small"><p class="u-visually-hidden">Loading...</p><div class="bounce1 c-loading__dot c--1"></div><div class="bounce2 c-loading__dot c--2"></div><div class="bounce3 c-loading__dot c--3"></div></div>');
    var $check = $('<svg class="c-icon-svg " title="Checks"><title>Check</title><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-check-button"></use></svg>');
    var $addToCartButton;

    var _initButtons = function($addToCartButton) {
        if (!$addToCartButton) {
            $addToCartButton = $('.js-add-to-cart');
        }
        return $addToCartButton;
    };

    var _changeButtonToLoading = function($addToCartButton) {
        $addToCartButton = _initButtons($addToCartButton);
        $addToCartButton.html($loader);
        $addToCartButton.addClass('c--primary');
    };

    var _revertButtonToDefault = function($addToCartButton) {
        $addToCartButton = _initButtons($addToCartButton);
        $addToCartButton.html(translator.translate('add_to_cart'));
        $addToCartButton.append($('<svg class="c-icon" data-fallback="img/png/arrow-right.png"><title>arrow-right</title><use xlink:href="#icon-arrow-right"></use></svg>'));
        $addToCartButton.removeClass('c--success c-add-to c--check js-to-cart c--added-to');
        $addToCartButton.addClass('c--primary c--is-disabled');
        $('.js-stepper-decrease').addClass('c--disabled');
    };

    var _changeButtonToCart = function($addToCartButton) {
        $addToCartButton = _initButtons($addToCartButton);
        $addToCartButton.html('View Cart/Checkout');
        $addToCartButton.append($('<svg class="c-icon" data-fallback="img/png/arrow-right.png"><title>arrow-right</title><use xlink:href="#icon-arrow-right"></use></svg>'));
        $addToCartButton.addClass('c--primary c--success c-add-to c--check js-to-cart c--added-to');
    };

    var _triggerNotification = function($modal) {
        // This is required to trigger the listener for data refresh happening
        // after product is added to cart
        $(document).trigger('addedToCart');
    };


    var _bindEvents = function($addToCartButton) {
        $('body').on('click', '.js-add-to-cart', function(e) {
            var $button = $(this);
            e.preventDefault();

            if ($button.hasClass('js-to-cart')) {
                // Navigate to the cart
                window.location.pathname = $('.js-mini-cart-checkout-button').attr('href');
            } else {
                _changeButtonToLoading($button);

                var evt = document.createEvent('HTMLEvents');
                evt.initEvent('click', false, true);
                $('.gwt-product-detail-buttons-right-margin, .gwt-bundle-add-to-cart-btn')
                    .find('button')[0].dispatchEvent(evt);
            }
        });

        $(document).on('addToCartError', function() {
            _revertButtonToDefault();
        });

        $('body').on('click', '.js-pinny-close', function() {
            var evt = document.createEvent('HTMLEvents');
            evt.initEvent('click', false, true);
            $('.js-continue-shopping')[0].dispatchEvent(evt);

        });
    };

    var _transformbuttons = function($buttonsContainer) {
        var $continueBtn = $buttonsContainer.find('.secondary').remove().addClass('u-unstyle c-continue-shopping pinny__close js-continue-shopping');
        $buttonsContainer.find('.primary').addClass('c--primary c-button').text('View Cart/Checkout');
        $buttonsContainer.append($continueBtn);
    };

    var _transformCartModal = function($modal) {
        var cartContent = cartItemParser.parseCartModal($modal);
        var $cartContainer = $('<div class="js-cart-modal c-cart-modal"></div>');
        var $shippingMessage = $modal.find('.gwt_addToCartDiv_shipping_message_panel').addClass('c-shipping-message-panel');
        var $okCancelButtons = $modal.find('.okCancelPanel');
        $modal.append($cartContainer);

        // Transform cart items
        new CartItemTemplate(cartContent, function(err, html) {
            var $output = $(html);

            // GH-793: Match up thumbnails to product images based on index
            var $thumbnails = $modal.find('.gwt-shoppingcart-thumbnail-image');
            $output.find('.js-cart-item__product-image').each(function(i, img) {
                $(img).append($thumbnails.eq(i));
            });

            $cartContainer.append($output);
        });

        // Transform cart buttons
        _transformbuttons($okCancelButtons);

        $cartContainer.append($shippingMessage);
        $cartContainer.append($okCancelButtons);

        // Append recommended items.
        var $suggestionItems = $('.js-suggested-products');
        $cartContainer.append($suggestionItems.clone().addClass('u-bleed u-margin-top-sm'));

        $modal.empty().append($cartContainer);

        return $modal;
    };


    var initAddToCartSheet = function() {
        var $addToCartModal = _transformCartModal($('.gwt_addtocart_div')).children();
        sheet.init($addToCartModal, {
            effect: sheetBottom,
            coverage: '97%',
            appendTo: '.gwt_addtocart_div',
            structure: {
                header: 'Added to Your Cart'
            },
            shade: {
                opacity: 0.95,
                color: '#fff'
            },
            open: function() {
                $($(this)[0].$content).prev().find('.pinny__close').addClass('js-pinny-close c-close-add-to-cart').text('').append('<svg class="c-icon" title="delete"><title>delete</title><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-delete"></use></svg></button>');
                $('.gwt_addtocart_div').find('.pinny__title').addClass('c-add-to-cart-modal');
                $('.gwt_addtocart_div').find('.pinny__header').addClass('c-add-to-cart-pinny-header');
                _triggerNotification();
            },
            opened: function() {
                _changeButtonToCart();
            }
        });
        $addToCartModal.pinny('open');

    };

    return {
        bindEvents: _bindEvents,
        triggerNotification: _triggerNotification,
        initAddToCartSheet: initAddToCartSheet
    };
});
