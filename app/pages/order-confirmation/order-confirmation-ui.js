define([
    '$',
    'hijax',
    'global/utils',
    'translator',
    'global/ui/carousel-ui',
    'global/ui/handle-form-fields',
    'components/notification/notification-ui'
], function($, Hijax, Utils, Translator, carouselUI, handleFormFieldsUI, NotificationUI) {

    var _initDuplicateEmail = function() {
        var $duplicateInput = $('.js-duplicate input');

        // Disable the input to avoid tab errors
        $duplicateInput.attr('disabled', 'true');

        $('.js-fill-duplicate input').on('blur', function(e) {
            $duplicateInput.val($(this).val());
        });
    };

    var _transformModal = function($modal) {
        var $table = $modal.find('> div > table');
        var $newContent = $('<div>');
        var $whyRegister = $table.find('.why_register');
        var $emailSignUp = $table.find('#sendmeemails');

        $whyRegister.addClass('u-margin-bottom-md');

        $table.find('.spot').each(function(i, inputContainer) {
            var $inputContainer = $(inputContainer);
            var $fieldRow = $('<div class="c-box-row spot">');
            var $fieldContainer = $('<div class="c-box">');
            var $input = $inputContainer.find('input');
            var $labelField = $inputContainer.find('label');
            var $labelContent = $labelField.children();

            $labelField.attr('data-label', $labelField.text().replace('*', ''));

            var newLabel = Utils.updateFormLabels($labelField.text());
            // Update Form Labels to match the invision
            newLabel && $labelField.text(Translator.translate(newLabel));

            $labelField.prepend($labelContent);

            $fieldContainer.append($inputContainer.find('label').addClass('c-box__label c-arrange__item c--shrink'));
            $fieldContainer.append($('<div class="c-input">').append($input));

            $fieldRow.append($fieldContainer);
            $newContent.append($fieldRow);
        });

        $emailSignUp.addClass('c-field__checkbox-radio');
        $emailSignUp.wrap('<div class="c-box">');
        $emailSignUp.find('label').addClass('c-box__label');

        $('<div class="c-box-row u-margin-top-lg u-padding-top-lg u-border-radius">').append($emailSignUp.parent())
            .insertAfter($newContent.find('#logonIdVerify').parents('.c-box-row.spot'));
        $newContent.append($table.find('.primary').addClass('c-button c--full-width c--primary c-register-button'));
        $table.replaceWith($table.find('.gwt-guest-reg-error-panel').add($whyRegister).add($newContent));
    };

    var _modalAdded = function() {
        if (event.animationName === 'modalAddedForOrderConfirmation') {
            var $registerModal = $('.guest-checkout-reg-modal');

            if ($registerModal.length) {
                $('.c-seperator').removeClass('u--hide');
                $('.js-registration-container').removeClass('u--hide');
                $registerModal.prev('.gwt-PopupPanelGlass').removeAttr('style');
                $registerModal.removeAttr('style');
                _transformModal($registerModal);

                $('.js-registration-container').find('.bellows__content').html($registerModal);

                // Open the bellows default
                Adaptive.$('.js-registration-container').bellows('open', Adaptive.$('.js-bellows__registration-form'));
            }
        }
    };

    var _bindEvents = function() {
        document.addEventListener('animationStart', _modalAdded);
        document.addEventListener('webkitAnimationStart', _modalAdded);
    };

    var initRegistrationSuccessHijax = function() {
        var hijax = new Hijax();

        hijax.set(
            'registrationSuccess',
            function(url) {
                return url.indexOf('UserRegistrationAdd') > -1;
            }, {
                complete: function(data, xhr) {
                    if (data.success === 'true') {
                        $('.c-seperator').addClass('u--hide');
                        $('.js-registration-container').addClass('u--hide');
                    }
                }
            }
        );
    };

    var _sendTransactionData = function() {
        try {
            var Transaction = Mobify.analytics.transaction;
            var orderInfo = window.trkpix_json;
            var orderNumber = orderInfo.trkpix_merchant_order_id;
            var shippingMatch = /\d+\.\d+/.exec(orderInfo.trkpix_order_shipping_formatted);
            var taxMatch = /\d+\.\d+/.exec(orderInfo.trkpix_order_tax_formatted);
            var tax = taxMatch ? taxMatch[0] : '0';
            var shipping = shippingMatch ? shippingMatch[0] : '0';
            var orderVal = orderInfo.trkpix_order_value;
            var revenue = parseFloat(orderVal) + parseFloat(tax) + parseFloat(shipping);
            var items = [];


            $.each(orderInfo.trkpix_oItems, function(i, orderItem) {
                var item = orderItem.oitem;
                var categories = item.catPath;
                items.push({
                    name: item.name,
                    sku: item.itemsProductmfpartNo,
                    price: item.price,
                    quantity: item.qty,
                    category: categories ? categories[0].path : ''
                });
            });

            Transaction.init(Mobify.analytics.ua, 'mobifyTracker');


            if (orderNumber && items.length) {

                Transaction.send({
                    transactionID: orderNumber,
                    affiliation: 'Garnet Hill',
                    transaction: {
                        revenue: revenue.toString(),
                        shipping: shipping,
                        tax: tax,
                        currency: orderInfo.trkpix_order_currency
                    },
                    transactionItems: items
                });
            }
        } catch (e) {
            console.log('unable to send transaction data');
        }
    };

    var orderConfirmationUI = function() {
        _bindEvents();
        _sendTransactionData();
        carouselUI.init($('#gwt_recommendations_purchaseconf'));
        initRegistrationSuccessHijax();
    };

    return orderConfirmationUI;
});
