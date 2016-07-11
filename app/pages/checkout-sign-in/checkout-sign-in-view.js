define([
    '$',
    'global/checkoutBaseView',
    'dust!pages/checkout-sign-in/checkout-sign-in',
    'translator'
],
function($, BaseView, template, Translator) {
    var _getField = function($container) {
        return {
            input: $container.find('input'),
            inputScript: $container.find('script'),
            label: $container.find('label').addClass('c-field__label')
        };
    };

    var _parseRememberMe = function($container) {
        var $input = $container.find('input');
        var $tooltip = $container.find('.rememberMeDescriptionPopup');
        var $header = $('<div class="c-sheet__header">');
        $header.append('<div class="c-sheet__title">Remember me on this device</div>');
        var $closeButton = '<button class =" c-sheet__header-close needsclick pinny__close"><svg class="c-icon" title="delete"><title>delete</title><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-delete"></use></svg></button>';
        $header.append($closeButton);
        $tooltip.prepend($header);
        $tooltip.removeAttr('style').find('strong')
        .text(Translator.translate('remember_me'))
        .wrap('<div class="c-remember-me__header">');
        $tooltip.find('.inst-copy').append('<button class="c-button c--primary c--full-width u-margin-top-lg c-remember-me__footer pinny__close">Close</button>');
        $('<div class="pinny__close"></div>');
        return {
            input: $input,
            text: $container.find('.rememberMeLink').text().replace('computer', 'device.'),
            labelFor: $input.attr('id'),
            tooltipContent: $tooltip,
            rememberMeLink: $container.children('a').text('')
        };
    };

    var _transformContinueButton = function($button) {
        $button.addClass('c-button c--primary c--full-width');
        var buttonText = $button.text();
        $button.find('span').text(buttonText);
        return $button;
    };

    return {
        template: template,
        extend: BaseView,

        postProcess: function(context) {
            if (BaseView.postProcess) {
                context = BaseView.postProcess(context);
            }

            // TRAV-305 - Remove progress bar
            context.header.progressBar = null;

            return context;
        },

        context: {
            templateName: 'checkout-sign-in',
            pageTitle: function() {
                return $('#mainContent .custom').attr('title');
            },
            errorContainer: function() {
                return $('#gwt-error-placement-div').addClass('u-visually-hidden');
            },
            forgotPasswordParams: function() {
                return $('#gwt_forgot_password_params');
            },
            loginForm: function() {
                var $form = $('#userLogonForm');
                var $loginButton = $form.find('#logonButton');
                var buttonText = $loginButton.text();
                $loginButton.find('span').text(buttonText);
                // $form.find('label').map(function(i, item) {
                //     var $label = $(item);
                //     $label.attr('data-label', $label.text().replace('*', ''));
                // });

                return {
                    form: $form,
                    hiddenInputs: $form.find('input[type="hidden"]'),
                    email: _getField($form.find('.logonId')),
                    password: _getField($form.find('.password')),
                    rememberMe: _parseRememberMe($form.find('.rememberMe')),
                    forgotPW: $form.find('#forgotpw').addClass('c-field__info'),
                    loginButton: $loginButton.addClass('c-button c--primary c--full-width')
                };
            },
            guestLoginForm: function() {
                var $form = $('#guestLogon');
                var $formDescription = $form.find('.registration');
                $formDescription.find('b').contents().unwrap();
                return {
                    form: $form,
                    hiddenInputs: $form.find('input[type="hidden"]'),
                    heading: $formDescription.find('> h3').addClass('c-guest-checkout-heading u-padding-bottom u--tight'),
                    descriptionText: $formDescription.find('> div').first(),
                    createAccountButton: _transformContinueButton($form.find('.button.primary'))
                };
            }
        }
    };
});
