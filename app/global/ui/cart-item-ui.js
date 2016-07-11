define([
    '$',
    'translator',
    'global/utils',
    'dust!components/price/partials/price-discount'
], function($, Translator, utils, DiscountPriceTemplate) {

    var addOptions = function($optionContainer, $itemPanel) {
        var $options = $itemPanel.find('.oios-option-line');
        var $personlazationDesc = $itemPanel.find('.perzdesc');
        var optionsLength = $options.length;
        $options.each(function(i, option) {
            var optionName = $(option).find('.ois-option-name').text() || '';
            var optionValue = $(option).find('.ois-option-value').text() || '';
            if (optionName.toLowerCase() === 'size') {
                $('<li>').text(optionName + ': ' + optionValue).insertBefore($optionContainer.siblings('.js-item-color-option'));
            } else if (optionName.toLowerCase() === 'color' || optionName.toLowerCase() === 'length') {
                $('<li>').text(optionName + ': ' + optionValue).insertBefore($optionContainer);
            }

        });
    };

    var transformPersonalizationInfo = function() {
        var $desktopPersContent = $(this).closest('.js-personalization');
        var $newPersContent = $desktopPersContent.closest('.js-personalization-content');
        var $personalizationInfo = $desktopPersContent.find('.personalization, .gwt-dynamic-personalization-panel').last().children().clone();

        // Add Image
        $newPersContent.find('.js-img').html($personalizationInfo.filter('.gwt-Image'));

        var $cartItem = $(this).closest('.c-cart-item');

        // Add Details
        $personalizationInfo.last().html($personalizationInfo.last().html().replace(',', '<br>'));
        $newPersContent.find('.js-details').html($personalizationInfo.last());

        if ($newPersContent.find('.js-details').text().length) {
            $cartItem.find('.js-personalize-list').removeClass('u--hide');
        }

    };

    var transformCartItem = function(itemPanel) {
        var $ = Adaptive.$;
        var $itemPanel = $(itemPanel);
        var $mainItemContainer = $(this).parents('.js-cart-item');
        // Add Image
        $mainItemContainer.find('.js-product-image').append($itemPanel.find('.gwt-shoppingcart-thumbnail-image'));
        var $giftMessageOptionContainer = $mainItemContainer.find('.js-options').find('.js-item-gift-message-option');
        var $itemNumberOptionContainer = $giftMessageOptionContainer.length ?  $giftMessageOptionContainer :
        $mainItemContainer.find('.js-options').find('.js-item-number-option');
        addOptions($itemNumberOptionContainer, $itemPanel);
    };

    var getPrices = function($priceContainer, $cartPriceContainer) {
        var regularPrice = $priceContainer.find('.gwt-HTML:first').text();
        if (regularPrice) {
            $cartPriceContainer.html(regularPrice);
        } else {
            var templateData = {
                priceNew: $priceContainer.find('.gwt-product-detail-widget-price-now').text().replace('Now', ''),
                priceOld: $priceContainer.find('.gwt-product-detail-widget-price-was').text().replace('Was', '')
            };

            new DiscountPriceTemplate(templateData, function(err, html) {
                $cartPriceContainer.html(html);
            });
        }
    };

    var transformRecommendedAccessory = function(itemPanel) {
        var $itemPanel = $(itemPanel);
        var $mainItemContainer = $(this).parents('.js-cart-item').find('.js-recommended-accessory');

        // Add Image
        $mainItemContainer.find('.js-recommended-accessory-product-image').append($itemPanel.find('.gwt-pdp-collection-thumbnail-image'));

        // Add Price
        var $recommendedPrice = $itemPanel.find('.gwt-product-detail-widget-price-holder').find('.gwt-HTML:first');
        $recommendedPrice.text('From ' + $recommendedPrice.text().split('-')[0]);
        getPrices($itemPanel.find('.gwt-product-detail-widget-price-holder'), $mainItemContainer.find('.js-price'));

        // Close Button
        $mainItemContainer.find('.js-recommended-accessory-hide')
            .append($itemPanel.find('.cart-upsell-widget-close-button').addClass('u-unstyle u-text-capitalize').text(Translator.translate('hide')));
    };

    var bindEvents = function() {
        // // Hide recommended accessory section
        $('.js-recommended-accessory-hide').on('click', function() {
            $(this).parents('.c-recommended-accessory').addClass('u--hide');
        });

        $('.js-add-promo-code, .js-enter-zip').on('click', '.c-ledger__number', function() {
            var $this = $(this);
            $this.addClass('u--hide');
            $this.parent().next().removeAttr('hidden');
        });
    };

    var cartUI = function() {
        if ($('[id*="gwt_order_item_uber_display"]').length) {
            utils.overrideDomAppend('[id*="gwt_order_item_uber_display"]', transformCartItem);
        } else {
            utils.overrideDomAppend('[id*="gwt_order_item_display"]', transformCartItem);
        }
        utils.overrideDomAppend('[id*="perzqty"]', transformPersonalizationInfo);
        utils.overrideDomAppend('[id*="manual_upsell_widget"]', transformRecommendedAccessory);

        bindEvents();
    };

    return cartUI;
});
