define([
    '$',
    'global/baseView',
    'dust!pages/account-order-details/account-order-details'
],
function($, BaseView, template) {
    var _parseOrderDetails = function($orderItems) {
        if (!$orderItems.length) {
            return;
        }

        var index = 0;
        return $orderItems.find('tbody .prod').map(function(_, product) {
            var $product = $(product);
            var $productInfo = $product.find('.colProd');
            var titleText;

            var textNodes = $productInfo.contents().filter(function() {
                return this.nodeType === 3;
            });

            textNodes.each(function(index) {
                var $text = $(this).text();

                if (index === 0) {
                    titleText = $text;
                }
            });

            index++;

            return {
                index: _ + 1,
                title: titleText.toLowerCase(),
                quantity: $product.find('.qty'),
                status: $product.find('.tracking').find('br').remove().end(),
                price: $product.find('.totals'),
                shipmethod: $product.find('.shipmethod')
            };
        });
    };

    var _parseBillingInfo = function($billItems) {
        if (!$billItems.length) {
            return;
        }

        var index = 0;
        return $billItems.find('tfoot .prod').map(function(_, product) {
            var $product = $(product);
            return {
                label: $product.find('.txtR').not('.totals'),
                value: $product.find('.totals')
            };
        });
    };

    var _parseShippingInfo = function() {
        return {
            shippingTitle: $('.od-ship').first().remove().text(),
            shippingName: $('.od-name').first().remove().text(),
            shippingAddr: $('.od-address-line').first().remove().text(),
            shippingCity: $('.od-city').first().remove().text(),
            shippingState: $('.od-state').first().remove().text(),
            shippingZip: $('.od-zip').first().remove().text(),
            shippingCountry: $('.od-country').first().remove().text()
        };
    };

    var _parseOrders = function($orders) {
        if (!$orders.length) {
            return;
        }

        return $orders.map(function(_, order) {
            var $order = $(order);

            return {
                shippingInfo: _parseShippingInfo(),
                orderItems: _parseOrderDetails($order),
                billInfo: _parseBillingInfo($order)
            };
        });
    };

    return {
        template: template,
        extend: BaseView,
        context: {
            templateName: 'account-order-details',
            breadcrumbLink: function() {
                return {
                    href: $('.backLink a').attr('href'),
                    title: $('.backLink a').text().replace('Back to', '')
                };
            },
            orderNumberDesc: function() {
                return $('.orderSummary p:first-child b').remove().text();
            },
            orderNumberNo: function() {
                return $('.orderSummary p:first-child').text();
            },
            orderDateDesc: function() {
                return $('.orderSummary p:last-child b').remove().text();
            },
            orderDateNo: function() {
                return $('.orderSummary p:last-child').text();
            },
            hiddenInputs: function() {
                return $('input[type="hidden"], form.hidden');
            },
            order: function() {
                return _parseOrders($('.orders'));
            }
        }
    };
});
