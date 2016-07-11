define([
    '$',
    'global/baseView',
    'dust!pages/gift-card-balance/gift-card-balance'
],
function($, BaseView, template, topNav) {
    return {
        template: template,
        extend: BaseView,
        context: {
            templateName: 'gift-card-balance',
            pageTitle: function() {
                return 'Gift Card Balance';
            },
            contents: function() {
                var $introText = $('#mainContent').find('p:not(:last-child)');

                $introText.map(function(index, item) {
                    $(item).html($(item).html().replace(/&nbsp;/g, ''));
                });
                return $introText;
            },
            formContainer: function() {
                var $formContainer = $('#gwt_gift_card_balance');
                return $formContainer;
            }
        }

        /**
         * If you wish to override preProcess/postProcess in this view, have a look at the documentation:
         * http://adaptivejs.mobify.com/v1.0/docs/views
         */
    };
});
