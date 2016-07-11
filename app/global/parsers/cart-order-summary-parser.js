define(['$',
    'translator',
    'dust!components/cart-order-summary/partials/promo-code'
], function($, Translator, PromoCodeTemplate) {

    var _getGiftCard = function($giftCouponContainer) {
        var $giftCouponTemplate;
        var $giftCardError = $('#gwt-error-placement-div-1');
        var $input = $giftCouponContainer.find('#account');
        var $giftCardLabelContainer = $giftCouponContainer.find('#giftcard-label');
        $input.addClass('js-apply-input').attr('placeholder', $input.attr('value')).removeAttr('value');
        var giftCouponTemplateData = {
            form: $giftCouponContainer.is('form') ? $giftCouponContainer : '',
            hiddenInputs: $giftCouponContainer.find('input[type="hidden"]'),
            label: $giftCardLabelContainer,
            tooltip: $giftCouponContainer.find('.giftingInfo'),
            tooltipClass: 'js-gift-card-tooltip',
            cartPromoCode: $('<h3 class="js-tooltip-sheet-heading">' + Translator.translate('gift_card_coupon_number') + '</h3>'),
            input: $giftCouponContainer.find('#account').addClass('js-apply-input'),
            applyButton: $giftCouponContainer.find('button').addClass('c-button c--secondary c--full-width'),
            errorContainer: $giftCardError.addClass('u-margin-top-sm u-text-error'),
            promoCodeClass: 'js-gift-card-container'
        };

        new PromoCodeTemplate(giftCouponTemplateData, function(err, html) {
            $giftCouponTemplate = $(html);
        });

        return $giftCouponTemplate;
    };

    // Get promo code section
    var _getPromoCode = function($promoContainer, isPromoSelected) {
        var $promoContent;
        var $promoError = $promoContainer.find('.error');
        var $promoCodeLabel = $promoContainer.find('#promo-code-label');
        var $promoCodeLabelContainer = $promoCodeLabel.length ? $promoCodeLabel : $promoContainer.find('.showPromoCodeInfo');
        var $promoCodeInfoText = $promoContainer.find('.orderReviewPromoNote');
        $promoCodeLabelContainer = $promoCodeLabelContainer.text($promoCodeLabelContainer.text().replace(':', ''));
        var promoTemplateData = {
            form: $promoContainer.is('form') ? $promoContainer : '',
            hiddenInputs: $promoContainer.find('input[type="hidden"]'),
            label: $promoCodeLabelContainer.text(),
            tooltip: $promoContainer.find('.promoCodeInfo, #showPromoCodeInfoPopup'),
            tooltipClass: 'js-promo-tooltip',
            cartPromoCode: $('<h3 class="js-tooltip-sheet-heading">' + Translator.translate('key_code') + '</h3>'),
            input: $promoContainer.find('#promoCode'),
            applyButton: $promoContainer.find('#promoButton').addClass('c-button c--secondary c--full-width'),
            errorContainer: $promoError.addClass('u-margin-top-sm u-text-error'),
            promoCodeClass: isPromoSelected ? 'js-promo-container c--promo-selected' : 'js-promo-container',
            promoCodeInfoText: $promoCodeInfoText.length ? $promoCodeInfoText : $promoContainer.find('.note')
        };

        new PromoCodeTemplate(promoTemplateData, function(err, html) {
            $promoContent = $(html);
        });

        return $promoContent;
    };

    // Get shipping estimate section
    var _getShippingEstimate = function($shippingContainer) {
        var $shippingEstimate;
        var $input = $shippingContainer.find('#estimate_shipping');
        $input.addClass('js-apply-input').attr('placeholder', $input.attr('value')).removeAttr('value');
        var shippingEstimateTemplateData = {
            label: Translator.translate('zip_code'),
            id: $shippingContainer.attr('id'),
            input: $shippingContainer.find('#estimate_shipping_label').attr('hidden', 'hidden').add($input),
            applyButton: $shippingContainer.find('.button').addClass('u--disabled c-button c--small'),
            pleaseWait: $shippingContainer.find('#pleaseWait'),
            promoCodeClass: 'js-shipping-container u--hide'
        };

        new PromoCodeTemplate(shippingEstimateTemplateData, function(err, html) {
            $shippingEstimate = $(html);
        });

        return $shippingEstimate;
    };


    var _getAdditionalTotals = function($container, $promoCode) {
        var $estimatedShipping = $promoCode.find('.EstimateShipping');
        var $giftCardForm = $promoCode.find('#giftCardForm');
        var itemArr = [];
        var item;

        // In order review and payment page promo code section is present in promotionCodeForm
        if ($promoCode.find('#promotionCodeForm').length) {
            $promoCode = $promoCode.find('#promotionCodeForm');
        }

        if ($container.find('.promoRow').length) {
            item = {
                label: ' ',
                moreContent: _getPromoCode($promoCode, true)
            };
            itemArr.push(item);
        }

        // Display Offer code label and Add button When no promo code has been applied
        if (!$container.find('.promoRow').length) {
            item = {
                label: ' ',
                moreContent: _getPromoCode($promoCode, false)
            };
            itemArr.push(item);
        }


        // TRAV-448: Always display GC form
        item = {
            label: ' ',
            additionalTotalsClass: 'js-add-gift-card',
            moreContent: _getGiftCard($giftCardForm)
        };
        itemArr.push(item);

        // For Order Summary Heading
        var $orderSummary = $('#creditCardForm .orderSummaryDiv');
        if ($orderSummary.length) {
            var $orderSummarylabel = $orderSummary.find('.orderSummaryHeader').text();
            var $orderSummaryCountText = $orderSummary.find('.orderSummaryItemCount').text();
            item = {
                heading: $orderSummarylabel,
                itemsNumber: $orderSummaryCountText,
            };
            itemArr.push(item);
        }

        $container.find('tr').map(function(_, totalRow) {
            var $totalRow = $(totalRow);
            var $label = $totalRow.find('td').first();
            var value = $totalRow.find('td:last').text().trim();
            var $shippingEstimate = $estimatedShipping.find('#zipCodeForm');
            var additionalTotalsClass = '';
            var $moreContent;
            if (!$label.text().trim().length || $totalRow.hasClass('estimateShipping_tr')) {
                return;
            }

            if ($totalRow.hasClass('promoRow')) {
                additionalTotalsClass = 'js-applied-promo';
                var $orderSummaryDiscount = $totalRow.find('#orderPromoDescDiv_1, #orderPromoDescDiv_1_BOTTOM, #shippingPromoDescDiv_1, #shippingPromoDescDiv_1_BOTTOM');
                var $orderSummaryDiscountContent = $totalRow.find('.nodisplay');
                $orderSummaryDiscountContent.wrap('<div class="js-order-summary-discount" />');
                $orderSummaryDiscountContent.wrapInner('<div class="js-content" />');
                $orderSummaryDiscount.removeAttr('href');
                $orderSummaryDiscount.parent().addClass('js-tooltip-button');
                $orderSummaryDiscount.parent().attr('data-target', '.js-order-summary-discount');
            }

            item = {
                label: $label,
                value: value,
                additionalTotalsClass: additionalTotalsClass,
                moreContent: $moreContent
            };

            itemArr.push(item);
        });

        return itemArr;
    };

    var _parse = function($totalsContainer, $grandTotal, $promoCode) {
        return {
            grandTotal: {
                label: $grandTotal.find('.grandlabel, .grandLabel').text(),
                value: $grandTotal.find('.amount, .totals.last').text()
            },
            additionalTotals: _getAdditionalTotals($totalsContainer, $promoCode)
        };
    };

    return {
        parse: _parse
    };
});
