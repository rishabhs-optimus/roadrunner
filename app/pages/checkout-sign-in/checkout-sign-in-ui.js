define([
    '$',
    'global/ui/forgot-password',
    'global/ui/handle-form-fields',
    'components/sheet/sheet-ui'
], function($, forgotPasswordUI, handleFormFieldsUI, sheet) {
    var _overrideDesktop = function() {
        var _desktopSubmit = window.submitUserLogon;

        window.submitUserLogon = function() {
            var result = _desktopSubmit.apply(this, arguments);

            $('.js-signin-button button').addClass('c-button c--full-width c--primary');

            return result;
        };
    };
    var initializeRememberMePinny = function() {
        var $rememberMeEl = $('.js-remember-me-panel');
        sheet.init($rememberMeEl, {
            open: function() {
                $('.js-remember-me-panel').parent().addClass('c-remember-me-pinny  c-full-size-pinny');
            },
            shade: {
                opacity: 0.9,
                color: '#fff'
            }
        });
        $('#rememberMeLink').on('click', function() {
            $rememberMeEl.pinny('open');
        });
    };

    var checkoutSignInUI = function() {
        forgotPasswordUI();
        _overrideDesktop();
        // Update placeholders in inputs
        initializeRememberMePinny();
    };

    return checkoutSignInUI;
});
