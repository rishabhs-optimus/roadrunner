define([
    '$',
    'global/ui/cart-item-ui',
    'pages/order-review-and-payment/ui/review-ui',
    'global/ui/tooltip-ui',
    'pages/order-review-and-payment/ui/payment-ui',
    'global/ui/handle-form-fields',
    'global/utils',
    'translator',
    'bower_components/jquery-creditcardvalidator/jquery.creditCardValidator'

], function($, cartItemUI, reviewUI, tooltipUI, paymentUI, handleFormFieldsUI, Utils, Translator) {

    var cardTypes = {
        'amex': 'American Express',
        'visa': 'Visa',
        'discover': 'Discover',
        'mastercard': 'Master Card',
        'jcb': 'JCB'
    };

    var updateLabelText = function() {
        $('.c-form-group').find('.c-box').map(function(i, inputContainer) {
            var $inputContainer = $(inputContainer);
            // Required 'star' move to before of the label text
            var $labelField = $inputContainer.find('label');
            var $labelContent = $labelField.children();
            // var $labelRequired = $labelField.find('.required');
            $labelField.attr('data-label', $labelField.text().replace('*', ''));

            var newLabel = Utils.updateFormLabels($labelField.text());
            // Update Form Labels to match the invision
            newLabel && $labelField.text(Translator.translate(newLabel));

            $labelField.prepend($labelContent);
        });
        $('#creditCardOptions').find('#card_id_number').attr('placeholder', 'CVV');
    };

    var _animation = function() {
        if (event.animationName === 'pleaseWaitLoader') {
            var $pleaseWaitLoader = $('.gwt-payment-selection-please-wait-panel');
            var $pleaseWaitLoader = $('#pleaseWait');
            if ($pleaseWaitLoader.length || $pleaseWaitLoader[0].style.display === 'inline') {
                $('.js-filter-loader').removeClass('u--hide');
            } else {
                $('.js-filter-loader').addClass('u--hide');
            }
        }
    };

    var _bindEvents = function() {
        $('html').on('click', '.js-promo-container .edit-promo-link', function(e) {
            $(this).parents('.js-promo-container').removeClass('c--promo-selected');
        });
        if ($('#labelPromoCode').length) {
            $('.js-promo-container').addClass('c--promo-selected');
        }

        var $cardSelect = $('.js-card-type select');

        jQuery('#accountcc').validateCreditCard(function(result) {
            var $input = $(this);
            var $container = $input.closest('.js-cc-input-container');
            var $paymentCardType = $('.js-cc-payment-card-type');
            var type = result.card_type;

            if ($input.val().indexOf('*') > -1) {
                // The user has saved CC info, so it's been pre-filled
                return;
            }

            if (type && type.name) {
                $paymentCardType.addClass('c--' + type.name);
                $cardSelect.children('[value="' + cardTypes[type.name] + '"]').prop('selected', true);
                $cardSelect.trigger('change');
                // Hide all other card ID info blocks (CC ID tooltip)
                $('.js-ccID-tooltip .js-card-id-block').not('.js-' + type.name).addClass('u-visually-hidden');
            } else {
                $paymentCardType.attr('class', 'paymentOption creditCard form js-cc-payment-card-type');
            }
        });

        $('.js-toggle').on('click', function(e) {
            var $button = $(this);
            var $target = $button.next($button.attr('data-target'));
            e.preventDefault();

            $button.attr('hidden', 'true');
            $target.removeAttr('hidden');

        });

        $('.js-apply-input input').on('focus input keyup', function() {
            var $input = $(this);
            var $button = $input.parent().next().find('button');

            if ($input.val() !== '') {
                $button.removeAttr('disabled');
            } else {
                $button.attr('disabled', 'true');
            }
        });
    };

    var switchForms = function($newlyActiveForm, $previouslyActiveForm) {
        $newlyActiveForm.find('input').removeAttr('disabled');
        $previouslyActiveForm.find('.js-form-container input').attr('disabled', 'true');

        $newlyActiveForm.find('#payment-type-holder').addClass('c-payment-active');
        $previouslyActiveForm.find('#payment-type-holder').removeClass('c-payment-active');
    };

    var _overrideDesktop = function() {
        var _submitForm = window.submitCreditCardForm;
        var _showPLCC = window.showPLCCOptions;
        var _showCreditCard = window.showCreditCardOptions;
        var $plccForm = $('.js-plcc-form');
        var $ccForm = $('.js-cc-payment-card-type');

        window.submitCreditCardForm = function() {
            $('.js-payment-block .js-form-container').find('input[disabled], select[disabled]').removeAttr('disabled');

            return _submitForm.apply(this, arguments);
        };

        window.showPLCCOptions = function() {
            var result = _showPLCC.apply(this, arguments);

            switchForms($plccForm, $ccForm);

            $('.js-submit').removeAttr('onclick');

            return result;
        };

        window.showCreditCardOptions = function() {
            var result = _showCreditCard.apply(this, arguments);

            switchForms($ccForm, $plccForm);

            if (window.checkAndTokenizeCVV) {
                $('.js-submit').attr('onclick', 'checkAndTokenizeCVV();');
            }

            return result;
        };
    };

    var slectChanged = function() {
        var _paymentOptionChanged = window.paymentOptionChanged;
        window.paymentOptionChanged = function() {
            var k = $('#accountcc').val();
            var _a = _paymentOptionChanged.apply(this, arguments);
            $('#accountcc').val(k);
            return _a;
        };
    };


    var orderReviewAndPaymentUI = function() {
        _overrideDesktop();

        tooltipUI();
        reviewUI.setUpSection();
        paymentUI.init();
        updateLabelText();
        _bindEvents();
        // Update placeholders in inputs
        handleFormFieldsUI.updatePlaceholder();

        $('#plcc_account').attr('placeholder', Translator.translate('fg_credit_card_number'));
        // TODO: Check the script adding disabled state
        $('.js-review-only').find('.js-submit').removeAttr('disabled');

        // Implementation of loader on changing payment options
        document.addEventListener('animationStart', _animation);
        document.addEventListener('webkitAnimationStart', _animation);
        slectChanged();
    };

    return orderReviewAndPaymentUI;
});
