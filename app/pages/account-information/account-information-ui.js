define([
    '$',
    'pages/account-information/decorators/account-information__form-decorator',
    'global/ui/handle-form-fields',
    'global/ui/replace-text-node'

],
function($, accountInfoFormDecorator, handleFormFieldsUI, replaceNbspUI) {
    var transformForm = function() {
        $('label[for=bill_cnbox]').after('<span class= "c-accntinfo-option">optional</span>');
        $('label[for=bill_phone2box]').after('<span class= "c-accntinfo-option">optional</span>');
        $('label[for=ship_cnbox]').after('<span class= "c-accntinfo-option">optional</span>');
        $('label[for=ship_phone2box]').after('<span class= "c-accntinfo-option">optional</span>');
        $('#gwt_sameasbilling_cb').addClass('c--same-bill-add');
        var placeholder1 = $('label[for=bill_sa2box]').text().match(/\(([^)]+)\)/)[1];
        var placeholder2 = $('label[for=ship_sa2box]').text().match(/\(([^)]+)\)/)[1];
        $('#bill_sa2box').attr('placeholder', placeholder1.charAt(0).toUpperCase() + placeholder1.slice(1));
        $('#ship_sa2box').attr('placeholder', placeholder1.charAt(0).toUpperCase() + placeholder1.slice(1));
        $('.js-form-container').each(function(i, formContainer) {
            var $formContainer = $(formContainer);
            // We have to use a decorator here.
            // Using a parser/partial template instead breaks some of the desktop JS functionality
            // Their JS ends up referencing the original elements, and not the elements in the partial.

            $('br').remove();
            $('#ship_reqdlabel').remove();
            $('#gwt_sameasbilling_cb>.gwt-CheckBox').addClass('c-get-checkbox-height');
            $formContainer.find('.group .spot').map(function(_, item) {
                $formContainer.find('.miLabel').remove();
                $formContainer.find('.c-box-row').removeClass('.u--hide');
                $formContainer.find('label >.required').remove();
                $formContainer.find('label[for~=bill_sa2box]').text('');
                $formContainer.find('label[for=ship_sa2box]').text('');
                $formContainer.find('#bill_reqdlabel').remove();
                $formContainer.find('.js-shipping-panel').addClass('same-shipping-block');
                var $item = $(item);
                var $labelRequired = $item.find('label .required');
                if ($labelRequired.length) {
                    $labelRequired.closest('label').append($labelRequired);
                }
            });
            $formContainer.find('.postal-code, .phone1_shipping, .phone2_shipping').attr('type', 'tel');
            $formContainer.find('label').map(function(i, item) {
                var $label = $(item);
                $label.attr('data-label', $label.text().replace('*', ''));
            });

            accountInfoFormDecorator.decorate($formContainer);

            if ($formContainer.is('#gwt_shipaddr_panel')) {
                $formContainer.addClass('js-shipping-panel c-form-panel');
                $formContainer.parent().parent().find('.gwt-CheckBox input').on('click', function(e) {
                    $formContainer.toggleClass('c--active');
                });
            } else if ($formContainer.is('#gwt_billaddr_panel')) {
                $formContainer.find('#bill_reqdlabel').removeClass().addClass('c-required-label').unwrap()
                    .insertAfter($('.accountInfoBillingForm').find('h3').wrap('<div class="c-box-row"/>'));
            }

            var $hiddenField = $('.addrStreet3Spot, .addrFaxSpot');
            if ($hiddenField.css('display') === 'none') {
                $hiddenField.parent().hide();
            }

            var $sumbitButton = $('#gwt_billshipaddr_btn button');
            if (!$sumbitButton.hasClass('c--primary')) {
                $('#gwt_billshipaddr_btn button span').text('Continue');
                $('#gwt_billshipaddr_btn button').addClass('c-button c--primary c--full-width u-margin-top-lg u-margin-bottom-lg');
            }
        });
    };

    var overrideDesktop = function() {
        var _oldRunAsync = window.CSBEntryPoint.__installRunAsyncCode;
        var transformed = false;

        window.CSBEntryPoint.__installRunAsyncCode = function() {
            _oldRunAsync.apply(this, arguments);

            if (!transformed && $('.address-widget-wwcm-wrapper').length) {
                transformForm();

                transformed = true;
            }
        };
    };

    var bindEventHandler = function() {
        $('body').on('change', '#bill_country-name', function() {
            var $billRegion = $('#bill_region');
            if ($billRegion.prop('disabled')) {
                $billRegion.parent().addClass('c--is-disabled');
            } else {
                $billRegion.parent().removeClass('c--is-disabled');
            }

        });
    };

    var accountInformationUI = function() {
        // Add any scripts you would like to run on the accountInformation page only here
        overrideDesktop();
        bindEventHandler();
        // Update placeholders in inputs
        //handleFormFieldsUI.inputsHandler();
        replaceNbspUI.replaceNbsp();

    };

    return accountInformationUI;
});
