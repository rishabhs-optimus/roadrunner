define([
    '$',
    'translator',
    'pages/product-details/ui/pdp-helpers-ui',
    'pages/product-details/ui/pdp-build-helpers-ui',
    'pages/product-details/ui/pdp-bind-events-helpers-ui',
    'pages/product-details/ui/add-to-cart-ui'
], function($, Translator, HelpersUI, BuildHelpersUI, BindEventsHelperUI, addToCartUI) {

    var getTruckDeliveryMsg = function() {
        $('.js-truck-msg').html($('.gwt-product-detail-widget-dynamic-info-panel'));
    };

    var animationListener = function() {
        if (event.animationName === 'priceUpdated') {
            var $updatedPrice = $('#gwt_productdetail_json').find('.gwt-product-detail-widget-top-total-price-amount');

            $('.js-pdp-price-total').removeClass('u--hide').text($updatedPrice.text());
            HelpersUI.updateSpecialShipping();
        } else if (event.animationName === 'addToCartPopup') {
            addToCartUI.initAddToCartSheet();
        } else if (event.animationName === 'productOptionReset') {
            // PDP #1 and PDP #2
            if ($('#gwt-bundle-det-insp-see-coll').length === 0) {
                BuildHelpersUI.buildPrice($('.js-pdp-price'), $('.gwt-product-detail-left-panel'));
                HelpersUI.updateSpecialShipping();
                HelpersUI.updateMainImageSrc(Adaptive.$('.iwc-main-img-wrapper'));
                BindEventsHelperUI.bindEvents(true);
            } else {
                BindEventsHelperUI.resetPdpBuilderOptions();
            }
            // BindEventsHelperUI.bindEvents(true);
        } else if (event.animationName === 'errorAdded') {
            var $addToCartButton = $('.js-add-to-cart');
            if (!$addToCartButton.hasClass('c--is-disabled')) {
                $(document).trigger('addToCartError');
                $addToCartButton.removeClass('c--success c-add-to c--check js-to-cart c--added-to');
                $addToCartButton.addClass('c--primary c--is-disabled');
            }

            $(document).trigger('addToCartError');
            HelpersUI.updateSpecialShipping();
        } else if (event.animationName === 'truckDeliveryMessage') {
            getTruckDeliveryMsg();
        } else if (event.animationName === 'personalizationStatic') {
            $('.js-personalization-trigger').addClass('u-visually-hidden');
            HelpersUI.buildStaticPersonalization();
        } else if (event.animationName === 'pdpNoCombinationMessage') {
            // Display no combination message when any selected option is not available
            Adaptive.notification.triggerError($('.gwt-no-combination-message-window').addClass('u-visually-hidden').find('.gwt-no-combination-message-text'));
        }
    };


    // Checks for animation to validate if price is updated
    var bindAnimationListener = function() {
        // Add event listeners for an welcome panel being added.
        document.addEventListener('animationStart', animationListener);
        document.addEventListener('webkitAnimationStart', animationListener);
    };

    return {
        bindAnimationListener: bindAnimationListener
    };
});
