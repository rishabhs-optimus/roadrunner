define(['$'], function($) {

    var styleForm = function() {
        $('.required').addClass('u-text-error');
        $('.c-field input').wrap('<div class="c-input"></div>');

    };

    var AccountChangePasswordUI = function() {
        styleForm();
    };

    return AccountChangePasswordUI;
});
