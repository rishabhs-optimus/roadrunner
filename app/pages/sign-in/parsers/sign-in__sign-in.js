define([
    '$',
    'translator',
    'global/utils'
], function($, Translator, Utils) {

    // Get label and inputs
    var getFormFields = function($form) {
        return $form.find('.spot').map( function(_, item) {
            var $self = $(item);
            if (!$self.children().length) {
                return;
            }
            return {
                label: $self.find('label'),
                input: $self.find('input').addClass('c-input c-arrange__item'),
                formScript: $self.find('script'),
                isForgotPassword: $self.find('#logonPassword')
            };
        });
    };

    // Get Remember Me checkbox, content and hidden elements
    var getRememberMe = function($rememberMe) {
        var $rememberMeInfo = $rememberMe.children('#rememberMeDescriptionPopup');
        var $header = $('<div class="c-sheet__header">');
        $header.append('<div class="c-sheet__title">Remember me on this device</div>');
        var $closeButton = '<button class =" c-sheet__header-close needsclick pinny__close"><svg class="c-icon" title="delete"><title>delete</title><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-delete"></use></svg></button>';
        $header.append($closeButton);
        $rememberMeInfo.prepend($header);
        $rememberMeInfo.removeAttr('style').find('strong')
        .text(Translator.translate('remember_me'))
        .wrap('<div class="c-remember-me__header">');
        $rememberMeInfo.find('.inst-copy').append('<button class="c-button c--primary c--full-width u-margin-top-lg c-remember-me__footer pinny__close">Close</button>');
        $('<div class="pinny__close"></div>');

        return {
            checkbox: $rememberMe.children('input'),
            rememberMeLink: $rememberMe.find('a').text(Translator.translate('remember_me'))
                            .attr('href', 'javascript:void(0)')
                            .removeAttr('onclick'),
            hiddenDiv: $rememberMeInfo
        };
    };

    var _parse = function($form) {
        var $submitButtonWrapper = $form.find('.actions').remove();

        // Hide the please wait div as not required on page
        $submitButtonWrapper.find('#pleaseWait').addClass('u--hide');
        $('#forgotpw').find('a').addClass('c--arrow-right');

        return {
            form: $form,
            hiddenFields: $form.find('input[type="hidden"]'),
            signInButton:  $submitButtonWrapper.find('#logonButton').addClass('c-button c--full-width c--primary'),
            rememberMe: getRememberMe($form.find('.rememberMe').remove()),
            forgotPassword: $('#gwt_forgot_password_params').add($('#forgotpw')),
            errorContainer: $('#gwt-error-placement-div'),
            formField: getFormFields($form),
            welcomeText: $('.data > .inst-copy').text()
        };
    };

    return {
        parse: _parse
    };
});
