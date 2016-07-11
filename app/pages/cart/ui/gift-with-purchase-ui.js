define([
    '$',
    'global/utils/dom-operation-override',
    'sheet-bottom',
    'dust!pages/cart/partials/gift-with-purchase',
    'dust!components/stepper/stepper',
    'translator',
    'pinny'
],
function($, domOverride, sheetBottom, GiftWithPurchaseTemplate, StepperTemplate, Translator) {
    var $giftwithPurchasePinny = $('.js-gift-with-purchase-pinny');
    var $giftWithPurchaseShade = $('.js-gift-with-purchase-shade');
    var $giftWithPurchaseProductDetailPinny = $('.js-gift-with-purchase-product-detail-pinny');
    var $giftWithPurchaseProductDetailShade = $('.js-gift-with-purchase-product-detail-shade');

    var initPinny = function() {
        $giftwithPurchasePinny.pinny({
            effect: sheetBottom,
            shade: {
                cssClass: 'js-gift-with-purchase-shade'
            },
            zIndex: 1000, // Match our standard modal z-index from our CSS ($z4-depth)
            shade: {
                opacity: '0.8',
                color: '#fff'
            },
            coverage: '97%',
            structure: false,
            close: function() {
                var evt = document.createEvent('HTMLEvents');
                evt.initEvent('click', true, false);
                $giftwithPurchasePinny.find('button.secondary')[0].dispatchEvent(evt);
            }
        });
        $giftWithPurchaseProductDetailPinny.pinny({
            effect: sheetBottom,
            shade: {
                cssClass: 'js-gift-with-purchase-product-detail-shade'
            },
            zIndex: 1010, // Match our standard modal z-index from our CSS ($z4-depth)
            shade: {
                opacity: '0.8',
                color: '#fff'
            },
            coverage: '97%',
            structure: false,
            close: function() {
                var evt = document.createEvent('HTMLEvents');
                evt.initEvent('click', true, false);
                $giftWithPurchaseProductDetailPinny.find('button.secondary')[0].dispatchEvent(evt);
            }
        });
    };

    var transformQuantity = function($desktopModalContent) {
        var $quantityOptionContainer = $desktopModalContent.find('.gwt-product-detail-widget-quantity-panel').remove();

        if (!$quantityOptionContainer.length) {
            return;
        }

        var $quantityContainer = $('<div>', {
            class: 't-product-details__quantity c-box-row'
        });
        var stepperHTML;

        $quantityContainer.append($('<label class="u-padding-left-tight">Quantity</label>'));

        // parser data
        var $selectQty = $quantityOptionContainer.find('.csb-quantity-listbox').addClass('u-white').parent();
        var $optionZero = $selectQty.find('select').find('option').first();
        var data = {
            decreaseIcon: 'minus',
            decreaseTitle: 'Reduce Quantity',
            increaseIcon: 'plus',
            isMin: true,
            increaseTitle: 'Increase Quantity'
        };

        parseInt($optionZero.val()) === 0 && $optionZero.prop('disabled', 'disabled');

        if (!$optionZero.siblings().length) {
            $optionZero.prop('selected', 'true');
            data.isMax = true;
        }


        new StepperTemplate(data, function(err, html) {
            // appending to existing options
            stepperHTML = html;
        });

        $quantityContainer.append(stepperHTML);
        $quantityContainer.find('.js-stepper-decrease').after($selectQty);
        return $quantityContainer;
    };

    var transformGiftWithPurchaseContent = function($desktopModalContent) {
        var $productPrice = $desktopModalContent.find('.gwt-product-detail-widget-price-column').remove();
        var $viewMoreButtons = $desktopModalContent.find('.pdp-linkpanel');

        // Parse static content
        var templateContent = {
            message: $desktopModalContent.find('.gwt-gwp-modal-descriptive-text').addClass('u-text-gray').remove(),
            productName: $desktopModalContent.find('.gwt-product-detail-widget-title').remove(),
            productPrice: $productPrice.find('.gwt-HTML'),
        };

        new GiftWithPurchaseTemplate(templateContent, function(err, html) {
            var $content = $(html);
            $desktopModalContent.find('#error-free-gift-options').after($content);
        });

        $('.gwt-quickshop-product-detail-widget-image-column').append(transformQuantity($desktopModalContent));

        if ($viewMoreButtons.length > 1) {
            // Hide the first one which is the zoom button
            $viewMoreButtons.first().addClass('u--hide');
        }

        // Transform the content
        $viewMoreButtons.addClass('c-view-more-button');
        $viewMoreButtons.find('a').addClass('c-button c--full-width u-text-uppercase');
        $viewMoreButtons.last().addClass('u-margin-top-md');
        $desktopModalContent.find('#gwt-product-detail-widget-base-stray-image, button.secondary').addClass('u-visually-hidden');
        $desktopModalContent.find('.gwt-product-option-panel').addClass('c-swatch-selection-section');
        $desktopModalContent.find('button.primary').addClass('c-button c--full-width c--primary u-text-uppercase').text(Translator.translate('add_free_gift_to_cart'));
    };

    var _resetPinnyMarkUp = function() {
        // The wishlist pinny and shade had to be moved inside the desktop popup
        // so that events worked correctly (the desktop JS blocks all events outside their popup).
        // Now that the desktop modal is closed, move the elements back to where they should be.
        var $lockup = $('.lockup__container');
        $giftwithPurchasePinny.parent().appendTo($lockup);
        $giftWithPurchaseShade.appendTo($lockup);
    };

    var _resetGiftPurchaseProductDetailPinnyMarkUp = function() {
        // The wishlist pinny and shade had to be moved inside the desktop popup
        // so that events worked correctly (the desktop JS blocks all events outside their popup).
        // Now that the desktop modal is closed, move the elements back to where they should be.
        var $lockup = $('.lockup__container');
        $giftWithPurchaseProductDetailPinny.parent().appendTo($lockup);
        $giftWithPurchaseProductDetailShade.appendTo($lockup);
    };

    var bindStepper = function() {
        $('body').on('click', '.js-stepper-decrease, .js-stepper-increase', function(e) {
            e.preventDefault();

            var $this = $(this);
            var $stepper = $this.closest('.c-stepper');
            var $count = $stepper.find('.c-stepper__count');
            var $qtySelect = $this.closest('.t-product-details__quantity').find('select');

            var count = $qtySelect.find('option:selected').text();
            if (!count.length) {
                count = 1;
            }
            count = parseInt(count);
            var highestCount = $qtySelect.find('option:last-child').text();

            if ($this.hasClass('js-stepper-decrease')) {
                count--;
                if (count < 1) {
                    count = 1;
                }
            } else {
                count++;
                if (count > highestCount) {
                    count = highestCount;
                }
            }
            $qtySelect.val(count).change();
            var evt = document.createEvent('HTMLEvents');
            evt.initEvent('change', false, true);
            $qtySelect[0].dispatchEvent(evt);
        });
    };

    var showGiftWithPurchaseModal = function($giftWithPurchaseModal) {
        var $content = $giftWithPurchaseModal.find('.gwt-submit-cancel-dialog-content-panel');
        var title = $giftWithPurchaseModal.find('.Caption').text();

        if ($giftwithPurchasePinny.find('.js-gift-with-purchase-pinny__body').hasClass('js-rendered')) {
            return;
        }

        _resetPinnyMarkUp();

        $giftWithPurchaseModal.removeAttr('style');
        transformGiftWithPurchaseContent($content);


        $giftwithPurchasePinny.find('.c-sheet__title').html(title);
        $giftwithPurchasePinny.find('.js-gift-with-purchase-pinny__body').html($content);
        $giftwithPurchasePinny.find('.js-gift-with-purchase-pinny__body').addClass('js-rendered');

        // The pinny has to be within the outer modal container, so all elements inside it are still clickable.
        // This GWT modal has been set to block all clicks outside of the modal itself.
        // So we need all of the pinny elements within it so it can still function
        // The pinny will be added back to the correct position when it closes.
        $giftWithPurchaseModal.html($giftwithPurchasePinny.parent());
        $giftWithPurchaseModal.append($giftWithPurchaseShade);
        $giftwithPurchasePinny.pinny('open');
        bindStepper();
    };

    var showGiftWithPurchaseProductDetailModal = function($giftWithPurchaseProductDetailModal) {
        var $content = $giftWithPurchaseProductDetailModal.find('.gwt-submit-cancel-dialog-content-panel');
        var $newContainer = $('<div class="c-gift-with-purchase-product-details-section" />');
        $content.find('.pdp-single-tab-content, .gwt-submit-cancel-dialog-button-panel').appendTo($newContainer);
        $('<div class="u-padding-top u-padding-bottom u-margin-top-md">' + Translator.translate('details') + '</div>').insertAfter($newContainer.find('.pdp-single-tab-description-content'));
        $newContainer.find('br').remove();

        _resetGiftPurchaseProductDetailPinnyMarkUp();

        $giftWithPurchaseProductDetailModal.removeAttr('style');
        $newContainer.find('.gwt-submit-cancel-dialog-button-panel').addClass('u-visually-hidden');


        $giftWithPurchaseProductDetailPinny.find('.c-sheet__title').html(Translator.translate('description'));
        $giftWithPurchaseProductDetailPinny.find('.js-gift-with-purchase-product-detail-pinny__body').html($newContainer);

        // The pinny has to be within the outer modal container, so all elements inside it are still clickable.
        // This GWT modal has been set to block all clicks outside of the modal itself.
        // So we need all of the pinny elements within it so it can still function
        // The pinny will be added back to the correct position when it closes.
        $giftWithPurchaseProductDetailModal.html($giftWithPurchaseProductDetailPinny.parent());
        $giftWithPurchaseProductDetailModal.append($giftWithPurchaseProductDetailShade);
        $giftWithPurchaseProductDetailPinny.pinny('open');
    };

    var modalAddedHandler = function() {
        if (event.animationName === 'giftWithPurchaseModal') {
            showGiftWithPurchaseModal($('#gwt-gift-with-purchase-modal'));
        } else if (event.animationName === 'giftWithPurchaseProductDetailInfoModal') {
            showGiftWithPurchaseProductDetailModal($('#gwt-product-detail-info-modal'));
        }
    };

    var reTransformGiftModal = function() {
        var $content = $(this);
        if ($content.parents('.pinny__content').length) {
            transformGiftWithPurchaseContent($content);
        }
    };

    var animationHandler = function() {
        document.addEventListener('animationStart', modalAddedHandler);
        document.addEventListener('webkitAnimationStart', modalAddedHandler);

        domOverride.on('domAppend', '', reTransformGiftModal, '.gwt-gwp-modal-gift-widget-panel');
    };

    var _init = function() {
        initPinny();
        animationHandler();
    };

    return {
        init: _init
    };
});
