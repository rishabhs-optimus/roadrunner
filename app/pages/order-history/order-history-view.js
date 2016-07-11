/**
 * Edit Card View
 */

define([
    '$',
    'global/baseView',
    'dust!pages/order-history/order-history',
    'translator'
],
function($, baseView, template, Translator) {

    return {
        template: template,
        extend: baseView,
        context: {
            templateName: 'order-history',
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
                var $introSection = $('.inst-copy .default');
                var position = $introSection.html().indexOf('or email us at');
                $introSection.html([$introSection.html().slice(0, position), '<br><br>', $introSection.html().slice(position)].join(''));
                var introArr = $introSection.html().split('<br><br>');
                return introArr.map(function(para) {
                    return {
                        para: para
                    };
                });
            },
            hiddenInputs: function() {
                return $('input[type="hidden"], form.hidden');
            },
            orderHistory: function() {
                return {
                    orderHistoryContainer: $('#orderHistory'),
                    fallbackMessage: $('#gwt_order_history_div')
                };
            }
        }
    };
});
