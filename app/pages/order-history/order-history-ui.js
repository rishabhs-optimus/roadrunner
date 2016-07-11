define([
    '$',
    'global/utils',
    'dust!pages/order-history/partials/order-history-list',
], function($, Utils, OrderListTmpl) {
    var $orderListContainer = $('.js-order-history');

    var _transformOrderHistory = function(orderHistoryContainer) {
        var $orderHistoryContainer = $(orderHistoryContainer);
        var $orderRows = $orderHistoryContainer.find('tr').filter(function() {
            return $(this).children('.gwt-order-history-widget-order').length;
        });

        var orderListObj = $orderRows.map(function(_, order) {
            var $order = $(this);
            return {
                orderNumber: $order.find('.gwt-order-history-widget-order'),
                orderDate: $order.find('.gwt-order-history-widget-date')
            };
        });

        var data = {
            orderList: orderListObj
        };

        new OrderListTmpl(data, function(err, html) {
            $('.js-loader').attr('hidden', 'hidden');
            $orderListContainer.append($(html));
        });
    };

    var orderHistoryUI = function() {
        Utils.overrideDomAppend('', _transformOrderHistory, '.gwt-order-history-widget-mainPanel');
    };

    return orderHistoryUI;
});
