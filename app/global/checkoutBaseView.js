define([
    '$',
    'global/includes/checkout-header/context',
    'global/baseView',
    'dust!global/checkoutBase'
],
function($, checkoutHeader, BaseView, baseTemplate) {
    var descript;

    return {
        template: baseTemplate,
        extend: BaseView,
        includes: {
            header: checkoutHeader
        },
        preProcess: function(context) {
            $('#emailUpdates').remove();
            $('script[x-src*="sli"]').remove();


            if (BaseView.preProcess) {
                context = BaseView.preProcess(context);
            }

            return context;
        },
        postProcess: function(context) {
            if (BaseView.postProcess) {
                context = BaseView.postProcess(context);
            }

            return context;
        },
        context: {
            templateName: 'checkout-base',
        }
    };

});
