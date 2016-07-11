/**
 * Change Payment View
 */

define([
    '$',
    'global/baseView',
    'dust!pages/change-payment/change-payment',
    'translator'
],
function($, baseView, template, Translator) {

    return {
        template: template,
        extend: baseView,
        context: {
            templateName: 'change-payment',
            breadcrumbLink: function() {
                return {
                    href: $('#myAccount a').attr('href'),
                    title: Translator.translate('account_overview')
                };
            },
            cardDetails: function() {
                return $('.form');
            },
            fields: function(context) {
                return context.cardDetails.find('.spot').map(function(i, row) {
                    var $row = $(row);
                    $row.find('label').text($row.find('label').text().replace('Select', ''));
                    return {
                        label: $row.find('label').addClass('c-change-payment__label'),
                        value: $row.find('span').addClass('c-change-payment__value')
                    };
                });
            },
            errorContainer: function(context) {
                return context.cardDetails.find('#gwt-error-placement-div');
            },
            buttons: function(context) {
                return {
                    removeBtn: context.cardDetails.find('.button:contains(Remove)').find('span').text('Remove').end().addClass('c-change-payment__remove'),
                    editBtn: context.cardDetails.find('.button:contains(Edit)').addClass('c-change-payment__edit')
                };
            }
        }
    };
});
