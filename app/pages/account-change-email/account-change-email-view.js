define([
    '$',
    'global/baseView',
    'dust!pages/account-change-email/account-change-email',
    'translator'
],
function($, BaseView, template, Translator) {
    var _parseForm = function($form) {
        if (!$form.length) {
            return;
        }

        $form.find('.spot').addClass('c-field');
        $form.find('.required').remove();
        $form.find('#logonId_old').removeAttr('style').attr('readonly', 'readonly');
        $form.find('.spot input[type=text]').attr('type', 'email');
        return {
            formWrapper: $form,
            formInputs: $form.find('input[type="hidden"]'),
            confirmationText: $form.contents().filter(function(i, node) {
                return node.nodeType === Node.TEXT_NODE;
            }),
            emailCurrent: $form.find('#current_email_label').closest('.spot'),
            emailNew: $form.find('#new_email_label').closest('.spot'),
            emailAgain: $form.find('#re_enter_email_label').closest('.spot'),
            continueButton: $form.find('.button.primary').addClass('c-button c--primary c--full-width'),
        };
    };

    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'account-change-email',
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
                return _parseForm($('#changeEmailForm').addClass('js-form'));
            }
        }
    };
});
