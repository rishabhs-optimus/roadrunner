define([
    '$',
    'global/utils',
    'global/overrides/jquery-validate'
], function($, Utils, jQueryValidateOverride) {

    var emailRegisterUI = function() {
        // Add any scripts you would like to run on the emailRegister page only here
        jQueryValidateOverride.init();

        Utils.updateParentIframeHeight();

        // Check if form is updated. (Errors either shown/hidden)
        $('.c-form')[0].addEventListener('validated', function(e) {
            Utils.updateParentIframeHeight();
        }, false);
    };

    return emailRegisterUI;
});
