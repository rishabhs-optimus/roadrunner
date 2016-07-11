define([
    '$',
    'pinny',
    'components/tabs/tabs-ui',
    'components/sheet/sheet-ui',
    'external!translator',
    'global/ui/forgot-password-ui',
    'modal-center'
], function($, pinny, tabs, sheet, Translator, forgotPasswordUI, modalCenter) {

    var overrideSubmitUserLogon = function() {
        var desktopSubmitUserLogon = window.submitUserLogon;
        window.submitUserLogon = function() {
            var result = desktopSubmitUserLogon.apply(this, arguments);

            // Reapply styles to the button and password label
            $('#logonButton').addClass('c-button c--full-width c--primary');

            // If there are no validation errors, the result is false
            // In this case, we want to show the loader
            if (!result) {
                // TODO: Change the button to loading state
            }

            return result;
        };
    };

    var checkErrors = function() {
        var $errorContainer = $('.js-error-container');

        if ($errorContainer.children().length) {
            Adaptive.notification.triggerError($errorContainer);
        }
    };

    var initializeRememberMePinny = function() {
        var $rememberMeEl = $('.js-remember-me-panel');

        sheet.init($rememberMeEl, {
            effect: modalCenter,
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

    var handleErrorNotify = function() {
        $('.t-sign-in__tabs').on('click', '.c-tabs__controls-item', function() {
            $('.c-notification-close').trigger('click');
        });
    };

    var overrideShowErrors = function() {
        var desktopShowErrorIDsAndPanel = window.showErrorIDsAndPanel;
        window.showErrorIDsAndPanel = function() {
            var result = desktopShowErrorIDsAndPanel.apply(this, arguments);
            var $errorPopup = $('#gwt-error-placement-div').attr('hidden', 'hidden');
            var $inputLabel = $('.c-form-group').find('label').not('.errortxt');
            Adaptive.notification.triggerError($errorPopup.find('.gwt-csb-error-panel'));

            $('.errortxt').addClass('c-field__label').parents('.c-field').addClass('c--error');
            $('.errortxt').parents('.c-box-row').addClass('c--error-row');
            if ($inputLabel.length) {
                $inputLabel.parents('.c-box-row').removeClass('c--error-row');
            }

            return result;
        };
    };

    var signInUI = function() {
        tabs.init();
        forgotPasswordUI();
        initializeRememberMePinny();
        checkErrors();
        handleErrorNotify();

        // Override the submit events right before they occur
        var $logonForm = $('#userLogonForm');
        var originalOnSubmit = $logonForm[0].onsubmit;
        var logonFunctionsOverridden = false;

        $logonForm[0].onsubmit = null;

        $logonForm.submit(function() {
            console.log($(window).scrollTop);
            if (!logonFunctionsOverridden) {
                overrideSubmitUserLogon();
                overrideShowErrors();
                logonFunctionsOverridden = true;
            }

            return originalOnSubmit.call(this);
        });
    };

    return signInUI;
});
