define([
    '$',
    'translator',
    'global/utils',
    'global/ui/handle-form-fields'
],
function($, Translator, Utils, handleFormFieldsUI) {

    var createFieldContainer = function($inputContainer) {
        var $input = $inputContainer.find('input');
        var $select = $inputContainer.find('select');
        var $fieldLabel = $inputContainer.find('label');
        var $labelContent = $fieldLabel.children();
        var $fieldRow = $('<div class="c-box c-arrange c--align-middle">');

        var newLabel = Utils.updateFormLabels($fieldLabel.text());
        // Update Form Labels to match the invision
        newLabel && $fieldLabel.text(Translator.translate(newLabel));

        $fieldLabel.prepend($labelContent);

        $fieldRow.append($inputContainer.find('label').addClass('c-box__label c-arrange__item c--shrink'));

        if ($input.length) {
            $fieldRow.append($('<div class="c-input c-arrange__item">').append($input));
        }

        if ($select.length) {
            $fieldRow.append($('<div class="c-select c-arrange__item">').append($select));
        }


        return $fieldRow;
    };

    var transformSplitFieldRow = function($fieldRow, $inputContainer) {
        var $nextContainer = $inputContainer.next();
        var $labelField = $nextContainer.find('label');
        $labelField.attr('data-label', $labelField.text().replace('*', ''));
        var $fieldContainer = createFieldContainer($nextContainer);
        $fieldRow.append($fieldContainer);
    };

    var transformForm = function($form) {
        var $container = $(this);
        var $form = $(arguments[0]);
        var $fields = $();
        var fieldsRowClass = 'c-box-row';
        if ($container.is('#gwt_password_panel')) {
            fieldsRowClass = 'c-box-row spot';
        }

        if ($container.is('#gwt_shipaddr_panel')) {
            $container.addClass('u-margin-top-md js-shipping-form');
        }

        $form.find('.spot').not('.AddrMNameSpot, #bill_reqdlabel, #ship_reqdlabel').map(function(i, inputContainer) {
            var $inputContainer = $(inputContainer);
            var $labelField = $inputContainer.find('label');
            var $inputField = $inputContainer.find('input');
            var $labelRequired = $labelField.find('.required');
            var $fieldRow = $('<div class="' + fieldsRowClass + '">');
            $labelField.attr('data-label', $labelField.text().replace('*', ''));
            var $fieldContainer = createFieldContainer($inputContainer);
            $('#bill_phone1box').attr('type', 'tel');
            $('#bill_phone2box').attr('type', 'tel');
            $('#emailbox').attr('type', 'email');
            $('#confirmEmailBox').attr('type', 'email');

            // changing or removing label
            if ($inputContainer.is('.addrConfEmailSpot')) {
                $labelField.html(Translator.translate('re_enter_email_address')).prepend($labelRequired);
            } else if ($inputContainer.is('.addrStreet1Spot')) {
                $labelField.html(Translator.translate('street_address')).prepend($labelRequired);
            } else if ($inputContainer.is('.addrStreet2Spot')) {
                $inputField.attr('placeholder', $labelField.text());
                $labelField.remove();
            }

            // hiding inputs to enable them on user click
            var anchorToEnableHiddenInputs = function(linkName) {
                var plusIconSvg = '<svg class="c-icon " data-fallback="img/png/plus.png"><title>plus</title><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-plus"></use></svg>';
                $fieldRow.attr('hidden', 'true');
                if (linkName !== undefined) {
                    $fields = $fields.add('<a class="js-enable-hidden-fields">' + linkName + plusIconSvg + '</a>');
                }
            };

            if ($inputContainer.is('.AddrCompanySpot')) {
                anchorToEnableHiddenInputs(Translator.translate('add_company_name'));
            } else if ($inputContainer.is('.addrStreet2Spot')) {
                anchorToEnableHiddenInputs(Translator.translate('add_another_line'));
            } else if ($inputContainer.is('.addrPhone2Spot')) {
                anchorToEnableHiddenInputs(Translator.translate('add_another_number'));
            }


            if ($labelRequired.length) {
                $labelRequired.closest('label').prepend($labelRequired);
            }

            $fieldRow.append($fieldContainer);

            if ($inputContainer.hasClass('AddrFNameSpot')) {
                transformSplitFieldRow($fieldRow, $inputContainer);
                var $firstNameAndMiddleNameFieldBox = $fieldRow.find('.c-box');
                $fieldRow.addClass('c--3-4');
                $firstNameAndMiddleNameFieldBox.removeClass('c-arrange c--align-middle');
                $firstNameAndMiddleNameFieldBox.first().addClass('c-first-name');
                $firstNameAndMiddleNameFieldBox.last().addClass('c--shrink c-middle-name');
            } else if ($inputContainer.is('[style*="none"]')) {
                $fieldRow.attr('hidden', 'true');
            }

            $fields = $fields.add($fieldRow);
        });


        $form.html($fields);

    };

    var transformShippingOptions = function() {
        var $container = $(arguments[0]);

        $container.find('.gwt-RadioButton').each(function(i, radioButtonContainer) {
            var $radioButtonContainer = $(radioButtonContainer);

            if (i === 0) {
                $radioButtonContainer.find('input').addClass('js-hide-form');
            } else {
                $radioButtonContainer.find('input').addClass('js-show-form');
            }

            $radioButtonContainer.addClass('c-field__checkbox-radio');
            $radioButtonContainer.wrap('<div class="c-shipping-option-panel">');
            $radioButtonContainer.find('br').remove();
            $radioButtonContainer.find('label');
        });
    };

    var transformSendEmails = function() {
        var $sendEmails = $(arguments[0]);

        $sendEmails.find('label');
        $sendEmails.addClass('c-field__checkbox-radio');
        $(this).addClass('c-shipping-promotional-emails');

    };

    var transformCTA = function() {
        var $cta = $(arguments[0]);
        $cta.addClass('c-button c--primary c--full-width');
        $cta.find('span').text($cta.text().replace('Secure Checkout', ''));
    };

    // Some label text is regenerating in actual state as desktop when clicking shipping address radio
    // so this is required to transform again to match the design
    var transformLabelText = function() {
        $('.js-shipping-form').find('label[for="ship_region"], label[for="ship_phone2box"]').map(function(_, item) {
            var $fieldLabel = $(item);
            var $labelContent = $fieldLabel.children();
            var newLabel = Utils.updateFormLabels($fieldLabel.text());
            // Update Form Labels to match the invision
            newLabel && $fieldLabel.text(Translator.translate(newLabel));

            $fieldLabel.prepend($labelContent);
        });
    };

    var bindEvents = function() {
        $('body').on('click', '.js-hide-form', function(e) {
            transformLabelText();
            $('.js-shipping-form').attr('hidden', 'true');
        });

        $('body').on('click', '.js-show-form', function(e) {
            transformLabelText();
            $('.js-shipping-form').removeAttr('hidden');
        });

        $('body').on('click', '.js-enable-hidden-fields', function(e) {
            e.preventDefault();
            $(this).hide().next().removeAttr('hidden');
        });

    };

    var overrideGWTDomAppend = function() {
        Utils.overrideDomAppend('#gwt_billaddr_panel', transformForm);
        Utils.overrideDomAppend('#gwt_shipaddr_panel', transformForm);
        Utils.overrideDomAppend('#gwt_password_panel', transformForm);
        Utils.overrideDomAppend('#gwt_email_textbox', transformForm);
        Utils.overrideDomAppend('#gwt_sendMeEmails_cb', transformSendEmails);
        Utils.overrideDomAppend('#gwt_shippingOption_panel', transformShippingOptions);
        Utils.overrideDomAppend('#gwt_billshipaddr_btn', transformCTA);
    };

    var shippingAddressUI = function() {
        // Open the first bellows - Billing address by default
        Adaptive.$('.js-checkout-billing-address').bellows('open', Adaptive.$('.js-bellows__billing-address'));
        Adaptive.$('.js-checkout-billing-address').bellows('open', Adaptive.$('.js-bellows__shipping-address'));


        overrideGWTDomAppend();
        // Update placeholders in inputs
        // handleFormFieldsUI.inputsHandler();
        bindEvents();
    };

    return shippingAddressUI;
});
