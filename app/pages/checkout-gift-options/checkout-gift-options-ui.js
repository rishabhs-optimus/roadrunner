define([
    '$',
    'global/utils',
    'global/ui/cart-item-ui'
], function($, utils, cartItemUI) {

    var personalizationData = function() {
        if (event.animationName === 'personalizationData') {
            $('.js-desktop-cart-item').find('.perzdesc').map(function(_, item) {
                var $item = $(item);
                var $cartItems = $item.closest('.js-cart-item');
                if (!$item.children().length) {
                    return;
                }
                $cartItems.find('.js-gift-wrap-personalize-option').html($item)
                    .insertBefore($cartItems.find('.js-options .js-item-color-option'))
                    .removeClass('u--hide');
            });
        }
    };

    var bindEvents = function() {
        // Made entire box clickable that contains the radio button
        $('.js-gift-wrap-choice').on('click', function(e) {
            if ($(e.target).is('input[type="radio"]')) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            var radioButtonName = $(this).find('input[type="radio"]').attr('name');
            $('input[name="' + radioButtonName + '"]').prop('checked', false);
            $(this).find('input[type="radio"]').prop('checked', true);
        });

        // Design Docs: Product title in gift option should not be anchor
        $('body').on('click', '.js-product-image, .js-item-title', function(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            return false;
        });
    };

    var iosPatchImagesFix = function() {
        /*eslint-disable*/
        if (runOnLoadScript) {
            runOnLoadScript();
            /*eslint-enable*/
        } else {
            setTimeout(iosPatchImagesFix, 500);
        }
    };

    var checkoutGiftOptionsUI = function() {
        cartItemUI();
        bindEvents();
        document.addEventListener('animationStart', personalizationData);
        document.addEventListener('webkitAnimationStart', personalizationData);
        // call iOS Patch to fix images
        setTimeout(iosPatchImagesFix, 1000);
    };

    return checkoutGiftOptionsUI;
});
