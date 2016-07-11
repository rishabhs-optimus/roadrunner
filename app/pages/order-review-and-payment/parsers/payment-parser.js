define([
    '$',
    'translator',
    'dust!pages/order-review-and-payment/partials/payment-tooltip'
], function($, translator, toolTipTmpl) {

    var $infoSvgIcon = $('<svg class="c-icon " data-fallback="img/png/info.png"><title>info</title><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-info"></use></svg>');

    var _decorateCardID = function($tooltip) {
        $tooltip.find('[style]').removeAttr('style');

        $tooltip.find('> div > div').each(function(i, cardContainer) {
            var $cardContainer = $(cardContainer);
            var cardType = $cardContainer.find('strong').text();

            if (!cardType) {
                cardType = $cardContainer.children('p').first().text();
            }

            $cardContainer.addClass('js-card-id-block');

            if (cardType.indexOf('American Express') > -1) {
                $cardContainer.addClass('js-amex');
            } else {
                $cardContainer.addClass('js-' + cardType.toLowerCase().replace(' ', '-'));
            }
        });
    };

    var _parseRow = function($label, $tooltip, labelText) {

        if ($tooltip && $tooltip.hasClass('showCardId')) {
            _decorateCardID($tooltip);
        }

        if (labelText) {
            $label.html($label.html().replace('Card Identification Number', labelText));
        }

        return {
            input: $label.siblings('input'),
            label: $label.addClass('c-box__label'),
            select: $label.siblings('select'),
            inputScript: $label.siblings('script'),
            tooltip: $tooltip
        };
    };

    var cardTypes = {
        'American Express': 'amex',
        'amex': '',
        'Visa': 'visa',
        'Discover': 'discover',
        'Master Card': 'mastercard',
        'JCB': 'jcb'
    };

    var _getPaymentType = function($paymentType) {
        return {
            input: $paymentType.find('input'),
            label: $paymentType.find('label')
        };
    };

    var _transformCVVField = function($container) {
        var $cvvContainer = $container.find('#cvv-container').closest('.spot').addClass('c-arrange__item');
        var $ccContainer = $container.find('#account_label').closest('.spot').addClass('c-arrange__item');
        var $cArrangeContainer = $('<div class="c-arrange c--gutters c-credit-card-number-field"></div>');
        $ccContainer.find('#account_label').prepend('<svg class="c-icon" data-fallback="img/png/CardIconBlue.png"><title>CardIconBlue</title><use xlink:href="#icon-CardIconBlue"></use></svg>');

        $ccContainer.wrap($cArrangeContainer);
        $ccContainer.after($cvvContainer);
    };

    // Get credit card content
    var _getCreditCardPaymentOptionDetails = function($container) {
        // return $container;
        var $expiryRow = $container.find('#exp-date-row');
        var $paymentMethodLabel = $container.find('#pay_method_id_label');
        var $creditCardPaymentType = $container.find('#payment-type-holder');
        $paymentMethodLabel.parent().addClass('u-visually-hidden');
        if ($creditCardPaymentType.find('input').is(':checked')) {
            $creditCardPaymentType.addClass('c-payment-active');
        }
        var $creditCardOption = $container.find('.creditCardOptions');

        $creditCardOption.find('#payMethodCCID').wrap('<div class="c-select js-card-type c-arrange__item"></div>');
        $creditCardOption.find('#expire_month')
            .wrap('<div class="c-select"></div>')
            .wrap('<div class="c-arrange__item"></div>');
        $creditCardOption.find('#expire_year')
            .wrap('<div class="c-select"></div>')
            .wrap('<div class="c-arrange__item"></div>');
        $creditCardOption.find('#showCardIdInfoLink').removeAttr('href').addClass('js-tooltip-button');
        $creditCardOption.find('#showCardIdInfoLink').attr('data-target', '.js-ccID-tooltip');
        $creditCardOption.find('#showCardIdInfoLink').html($infoSvgIcon);
        $creditCardOption.find('#showCardIdInfoLink').insertAfter($creditCardOption.find('#card_id_number_label'));
        $creditCardOption.find('#showCardId').insertAfter($creditCardOption.find('#showCardIdInfoLink'));
        $creditCardOption.find('#showCardId').prepend('<div hidden><h3 class="js-tooltip-sheet-heading">Card ID Numer</h3></div>');
        $creditCardOption.find('#showCardId').wrap('<div class="js-ccID-tooltip" />');
        $creditCardOption.wrapInner('<div class="c-credit-card-options-inner" />');
        $creditCardOption.find('#ccsave-holder').wrapInner('<div class="c-ccsave-holder" />');
        $('#accountcc').wrap('<div class="js-cc-input-container"></div>');

        _transformCVVField($creditCardOption);

        return {
            paymentType: $creditCardPaymentType,
            creditCardLogoOptions: $container.find('.creditCardOptionLogos'),
            creditCardOption: $creditCardOption,
            cardID: _parseRow($container.find('#card_id_number_label'), $container.find('#showCardId'), translator.translate('card_id')),
        };
    };

    // TODO: Get Grandin Road Gift Card content
    var _paypalPaymentOptionDetails = function($container) {
        var $grPaymentType = $container.find('#payment-type-holder');
        if ($grPaymentType.find('input').is(':checked')) {
            $grPaymentType.addClass('c-payment-active');
        }
        return {
            paypalInputContainer: $container.find('.payPalLabel input').length ? true : false,
            paypalInput: $container.find('.payPalLabel input'),
            paypalAccountInfo: $container.find('#paypalAccountInfo')
        };
    };

    var _parse = function($form) {
        var $ctaContainer = $form.find('#processOrderContainer');
        var $cancelBtn = $ctaContainer.find('#processOrderCancelButton');
        var $finalTotal = $('#order_total_table').find('tr').last();

        $cancelBtn.addClass('c-button c--outline c-secondary-button c-payment-cancel-button');
        $cancelBtn.find('span').text(translator.translate('payment_back_button'));

        return {
            form: $form,
            sectionTitle: $form.find('h3').text(),
            hiddenInputs: $form.find('> input[type="hidden"],> .nodisplay'),
            paymentOptions: $form.find('#paymentoptions'),
            otherHiddenFieldInCreditCardForm: $form.find('#paypalDisplay, #billMeLaterDisplay'),
            creditCardPaymentOption: _getCreditCardPaymentOptionDetails($form.find('.paymentOption.creditCard')),
            paypalPaymentOption: _paypalPaymentOptionDetails($form.find('.paymentOption.payPal')),
            saveCC: $form.find('#ccsave-holder'),
            ctas: {
                container: $ctaContainer,
                cancel: $cancelBtn,
                placeOrder: $ctaContainer.find('.primary'),
            },
            finalTotal: {
                label: $finalTotal.find('.grandLabel').text(),
                price: $finalTotal.find('td').last().find('strong').text()
            }
        };
    };

    return {
        parse: _parse
    };
});
