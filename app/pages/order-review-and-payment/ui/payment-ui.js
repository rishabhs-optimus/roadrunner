define([
    '$',
    'global/ui/promo-code-ui'
    // 'bower_components/jquery-creditcardvalidator/jquery.creditCardValidator'
], function($, promoCodeUI) {

    var cardTypes = {
        'amex': '',
        'visa': 'Visa',
        'discover': 'Discover',
        'mastercard': 'Master Card',
        'jcb': 'JCB'
    };

    var _bindEvents = function() {

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

    var _updateFieldsAndButtons = function() {
        var $ccField = $('#accountcc');
        var cvvStyles = {
            width: '100%',
            height: '40px',
            padding: '8px 12px',
            border: '1px solid #bbb',
            'border-radius': '0',
            '-webkit-box-shadow': 'inset 0 2px 2px 0 #eee',
            'box-shadow': 'inset 0 2px 2px 0 #eee',
            'color': '#444',
            'font-family': '"lato-regular", "Roboto", sans-serif',
            'font-size': '15px',
            'line-height': '20px',
            '-webkit-appearance': 'none',
            '-webkit-tap-highlight-color': 'transparent',
            'box-sizing': 'border-box'
        };
        var $placeOrderButton = $('.js-place-order .primary');
        $ccField.removeAttr('onkeyup');
        $ccField.removeAttr('pattern');
        $ccField.attr('type', 'tel');
        $('#card_id_number_label').addClass('js-tooltip-button');
        $('#card_id_number_label').attr('data-target', '.js-ccID-tooltip');

        $placeOrderButton.addClass('c-button c--primary c--full-width js-submit');

        !!window.ccTokenizerSocket && !!window.ccTokenizerSocket.setCVVFieldStyleByObject && window.ccTokenizerSocket.setCVVFieldStyleByObject(cvvStyles);
    };

    var _checkForErrors = function() {
        // Wrap error with generic container
        $('#payment-error-cvv[style*="block"]').contents().wrapAll('<div id="gwt-error-placement-div" />');
        var $otherErrors = $('#ok-placement-div .gwt-csb-error-panel, #payment-error-cvv[style*="block"]');
        var $plccError = $('#topErrorMessages');

        if ($otherErrors.length) {
            Adaptive.notification.triggerError($otherErrors.parent());
        }

        if (!!$plccError.text().trim()) {
            Adaptive.notification.triggerError($plccError);
        }
    };

    var _overrideSubmit = function() {
        var _submitForm = window.submitCreditCardForm;

        window.submitCreditCardForm = function() {
            $('.js-payment-block').find('input, select').removeAttr('disabled');
            var result = _submitForm.apply(this, arguments);

            return result;
        };
    };

    var _init = function() {


        promoCodeUI.init();

        _bindEvents();

        _overrideSubmit();

        _updateFieldsAndButtons();

        _checkForErrors();
    };

    return {
        init: _init
    };
});
