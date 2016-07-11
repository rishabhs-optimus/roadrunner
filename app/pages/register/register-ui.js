define([
    '$',
    'global/ui/handle-form-fields',
    'components/sheet/sheet-ui'
],
function($, handleFormFieldsUI, sheet) {

    var overrideDesktopScripts = function() {
        var desktopSubmitUserRegistration = window.submitUserRegistration;
        window.submitUserRegistration = function() {
            var result = desktopSubmitUserRegistration.apply(this, arguments);

            $('.button.primary').addClass('c-button c--full-width c--primary').removeAttr('disabled');

            return result;
        };
    };

    var initializePerksPinny = function() {
        var $perksPinnyEl = $('.c-register-content__perks');
        sheet.init($perksPinnyEl, {
            open: function() {
                $perksPinnyEl.parent().addClass('c-register-content__perks-pinny');
            }
        });
        $('.c-register-content__perks-link').on('click', function() {
            $perksPinnyEl.pinny('open');
        });
    };

    var registerUI = function() {
        overrideDesktopScripts();
        initializePerksPinny();

        // Update placeholders in inputs
        // handleFormFieldsUI.updatePlaceholder();
        // handleFormFieldsUI.inputsHandler();
    };

    return registerUI;

});
