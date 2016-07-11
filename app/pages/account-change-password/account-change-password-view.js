define([
    '$',
    'global/baseView',
    'dust!pages/account-change-password/account-change-password',
    'translator'
],
function($, BaseView, template, Translator) {

    var _parseForm = function($form) {
        $form.find('.spot').addClass('c-field');
        $form.find('.required').remove();
        $('#newPasswordLbl').html($('#newPasswordLbl').text().replace('Create a New Password', 'New Password'));
        return {
            formWrapper: $form,
            formInputs: $form.find('input[type="hidden"]'),
            currentPassword: $('#currentPasswordLbl').closest('.spot'),
            newPassword: $('#newPasswordLbl').closest('.spot'),
            reEnterPassword: $('#confirmPasswordLbl').closest('.spot'),
            continueButton: $('.button.primary').addClass('c-button c--primary c--full-width'),
        };
    };

    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'account-change-password',
            breadcrumbLink: function() {
                return {
                    href: $('#myAccount a').attr('href'),
                    title: Translator.translate('account_overview')
                };
            },
            pageTitle: function() {
                return $('.custom').attr('title');
            },
            introText: function() {
                return $('.change_info .inst-copy');
            },
            form: function() {
                var $form = $('#changePasswordForm');

                return _parseForm($form);
            },
        }
    };
});
