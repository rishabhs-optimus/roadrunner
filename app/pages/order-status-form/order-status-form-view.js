define([
    '$',
    'global/baseView',
    'dust!pages/order-status-form/order-status-form'
],
function($, BaseView, template) {
    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'order-status-form',
            pageTitle: function() {
                return $('#mainContent').find('h1').first().remove().attr('title');
            },
            content: function() {
                return $('.data > p').not(':empty');
            },
            form: function() {
                var $form = $('#orderStatusForm');
                $form.map(function(_, form) {
                    var $form = $(form);

                    $form.find('button').addClass('c-button c--full-width c--primary');
                });
                return $form;
            }
        }

        /**
         * If you wish to override preProcess/postProcess in this view, have a look at the documentation:
         * http://adaptivejs.mobify.com/v1.0/docs/views
         */
    };
});
