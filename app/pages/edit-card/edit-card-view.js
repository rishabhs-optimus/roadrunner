/**
 * Edit Card View
 */

define([
    '$',
    'global/baseView',
    'dust!pages/edit-card/edit-card',
    'translator'
],
function($, baseView, template, Translator) {

    return {
        template: template,
        extend: baseView,
        context: {
            templateName: 'edit-card',
            breadcrumbLink: function() {
                return {
                    href: $('#myAccount a').attr('href'),
                    title: Translator.translate('account_overview')
                };
            },
            editMessage: function() {
                return $('.change_info p').addClass('c-change-payment__info');
            },
            form: function() {
                return $('#creditCardEditForm');
            },
            hiddenFields: function(context) {
                return context.form.find('input[type=hidden]');
            },
            fields: function(context) {
                return context.form.find('.spot').not('.actions').map(function(i, row) {
                    var $row = $(row);
                    // TRAV-372: Change credit card field to use numeric keyboard
                    if ($row.find('input').hasClass('cidNumber')) {
                        $row.find('input').attr('type', 'tel');
                    }
                    return {
                        label: $row.find('label').find('.required').remove().end().addClass('c-change-payment__label'),
                        select: $row.find('select').addClass('c-change-payment__input'),
                        input: $row.find('input').addClass('c-change-payment__input')
                    };
                });
            },
            expirationField: function(context) {
                var $expirationData = context.form.find('#exp-date-row');
                return {
                    label: $expirationData.find('#monthParent label').find('.required').remove().end().addClass('c-change-payment__label'),
                    monthSelector: $expirationData.find('#monthParent select').addClass('c-change-payment__month'),
                    year: $expirationData.find('#cardExpiryYear').addClass('c-change-payment__year'),
                    hiddenDiv: $expirationData.find('.hidden')
                };
            },
            submitBtn: function(context) {
                return context.form.find('.actions button').addClass('c--full-width c-button c--primary');
            },
            formScript: function() {
                return $('.change_info').next('script');
            },
            errorContainer: function(context) {
                return context.form.find('#gwt-error-placement-div').addClass('c-change-payment__error');
            }
        }
    };
});
