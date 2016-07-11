define([
    '$',
    'global/baseView',
    'dust!pages/confirmation-details/confirmation-details',
    'global/parsers/cart-item-parser',
    'global/parsers/address-parser',
    'pages/confirmation-details/parsers/items-shipping',
    'global/parsers/totals-parser',
    'translator'
],
function($, BaseView, template, cartItemParser, addressParser, itemsShippingParser, totalsParser, Translator) {

    var reviewText = function() {
        var orderReviewElement = $('#orderReviewDisplayViewDiv');
        var rawText = orderReviewElement.contents().filter(function() {
            return this.nodeType === 3;
        }).text().trim().replace(/.$/, '');

        return rawText + orderReviewElement.find('b:first').text() + '.';
    };

    return {
        template: template,
        extend: BaseView,
        postProcess: function(context) {
            if (BaseView.postProcess) {
                context = BaseView.postProcess(context);
            }

            var $breadcrumbs = $('.breadcrumbs li');

            return context;
        },
        context: {
            templateName: 'confirmation-details',
            hiddenInputs: function() {
                return $('#container').children('input[type="hidde"]');
            },
            orderContainer: function() {
                return $('#orderReviewDisplayViewDiv');
            },
            orderInfo: function(context) {
                var $infoContainer = context.orderContainer.children('.vcard');

                return $infoContainer.children().map(function(i, row) {
                    var $row = $(row);
                    return {
                        label: $row.find('b').remove().text(),
                        value: $row.text()
                    };
                });
            },
            billingAddress: function(context) {
                return addressParser.parse(context.orderContainer.find('.od-bill'));
            },
            paymentDetails: function(context) {
                var $paymentContainer = context.orderContainer.find('.od-bill-payment');
                var cardText = $paymentContainer.find('.vcard').contents().filter(function(i, node) {
                    return node.nodeType === Node.TEXT_NODE;
                });

                if (cardText) {
                    return {
                        sectionTitle: $paymentContainer.find('h3').text().replace(':', ''),
                        cardName: cardText[0].textContent.replace(':', ''),
                        cardInfo: cardText[1].textContent.replace('Card#', 'Card#: ')
                    };
                }
            },
            orderItems: function(context) {
                return itemsShippingParser.parse(context.orderContainer.find('.orderItemRow'));
            },
            totals: function(context) {
                return totalsParser.parse(context.orderContainer.find('#order_total_table'));
            },
            reviewText: reviewText
        }

    };
});
