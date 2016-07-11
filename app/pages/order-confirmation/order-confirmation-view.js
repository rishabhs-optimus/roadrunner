define([
    '$',
    'global/checkoutBaseView',
    'dust!pages/order-confirmation/order-confirmation',
    'translator'
],
function($, BaseView, template, Translator) {
    return {
        template: template,
        extend: BaseView,
        postProcess: function(context) {
            if (BaseView.postProcess) {
                context = BaseView.postProcess(context);
            }

            var $breadcrumbs = $('.breadcrumbs li');
            var $giftBreadcrumb = $breadcrumbs.first();
            var orderContainsGifts = /gift/i.test($giftBreadcrumb.text()) && !!$giftBreadcrumb.find('a').length;
            var steps;
            var stepsLength;
            var i;

            if (orderContainsGifts) {
                context.header.progressBar = context.header.progressBarWithGift;
            }

            steps = context.header.progressBar.steps;
            stepsLength = steps.length;

            for (i = 0; i < stepsLength; i++) {
                steps[i].status = 'c--complete';
                steps[i].statusText = 'Completed';
            }

            return context;
        },
        context: {
            templateName: 'order-confirmation',
            hiddenForms: function() {
                return $('form.hidden').add($('#gwt_view_name').parent());
            },
            hiddenInputs: function() {
                return $('#container').children('input[type="hidde"]');
            },
            analyticsContainer: function() {
                return $('#analyticsDataShop9');
            },
            orderConfirmationContainer: function() {
                return $('#orderConfirmation');
            },
            orderError: function(context) {
                return context.orderConfirmationContainer.children('.error').text();
            },
            successMessage: function(context) {
                return context.orderConfirmationContainer.find('.order_confirmation_message');
            },
            orderInfo: function(context) {
                var $orderInfoTable = context.orderConfirmationContainer.find('.order_confirmation_info');

                return $orderInfoTable.find('tr').map(function(i, orderRow) {
                    var $orderCells = $(orderRow).children();

                    return {
                        label: $orderCells.first().text(),
                        value: $orderCells.last().text()
                    };
                });
            },
            finePrint: function(context) {
                var $finePrint = context.orderConfirmationContainer.find('#gwt_wwcm_order_confirmation');
                return $finePrint.find('> h2, > p');
            },
            continueShopping: function(context) {
                return context.orderConfirmationContainer.find('.actions a')
                    .addClass('c-button c--full-width c--primary');
            },
            guestRegistrationContainer: function(context) {
                return context.orderConfirmationContainer.find('#gwt_guest_user_reg');
            },
            viewOrderLink: function(context) {
                return context.orderConfirmationContainer.find('#printlink');
            }
        }
    };
});
