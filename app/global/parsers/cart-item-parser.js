define([
    '$',
    'translator'
], function($, translator) {

    // Gifting Options Page - Get Gift Wrap Choices
    var _getGiftWrapChoices = function($container) {
        if (!$container.length) {
            return;
        }

        return {
            giftWrapMessage: $container.find('.giftwrapchoice').length ? false : $container.text(),
            choices: $container.find('.giftwrapchoice').map(function(_, item) {
                var $item = $(item);
                var giftWrapImageURL = (function() {
                    if (($item.find('.gwimage img').attr('x-src') || '').indexOf('NoWrap') < 0) {
                        return $item.find('.gwimage img');
                    } else {
                        return $('<svg class="c-icon" data-fallback="img/png/no-wrap-icon.png"><title>no-wrap-icon</title><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-no-wrap-icon"></use></svg>');
                    }
                })();


                return {
                    chekbox: $item.find('[type="radio"]'),
                    giftWrapImage: giftWrapImageURL,
                    label: $item.find('.gwlabel'),
                    price: $item.find('.gwprice').text()
                };
            })
        };
    };

    // Gifting Options Page - Get Gift Message
    var _getGiftMessage = function($container) {
        if (!$container.length) {
            return;
        }
        var characterMsg = $container.find('.giftWrapMessageDescTxt').text()
            .replace(/\(|maximum|\)/ig, '').trim().toLowerCase();

        return {
            label: translator.translate('gift_message'),
            input: $container.find('textarea'),
            characterLimitMessage: 'Max ' + characterMsg + ' limit',
            info: $container.find('.info').html(),
        };
    };

    // Get recommended accessory section
    var _getRecommendedAccessory = function($container) {
        if (!$container.length) {
            return;
        }
        var itemData = JSON.parse($container.find('.JSON').text()).pageProduct;
        return {
            heading: $container.find('.contentLeaderText').text(),
            itemName: itemData.prodName
        };
    };

    var _createQtySelectDropdown = function(qtyArr, value) {
        return {
            options: $.map(qtyArr, function(i, item) {
                return {
                    value: i,
                    text: i,
                    selected: i === value ? true : false
                };
            })
        };
    };

    var _getQty = function(itemData, $item) {
        var $container = $item.find('[id*="gwt_quantity_control"]').addClass('u-visually-hidden');
        var value = parseInt($container.attr('data-initialquantity'));
        var maxQuantity = $container.attr('data-maxquantity');
        var qtyArr = [];

        for (var i = 1; i <= maxQuantity; i++) {
            qtyArr.push(i);
        }

        if (!$container.length) {
            return {
                detailedShippingInfo: $item.find('select').siblings('a').text(),
                count: $item.find('.qty li').first().text()
            };
        }

        return {
            qtyLabel: translator.translate('qtyLable'),
            prodQty: itemData.quantity,
            detailedShippingInfo: $item.find('select').siblings('a').text(),
            count: value,
            container: $container,
            isMax: value === $container.data('maxquantity'),
            isMin: value === 1,
            items: _createQtySelectDropdown(qtyArr, value),
            totalQty: $item.find('.totalprice').text()
        };
    };

    var _parsePrice = function($priceCell) {
        var $oldPrice = $priceCell.find('.listPrice');
        var $newPrice = $priceCell.find('.nowLabel');
        var $orig = $priceCell.find('.orig');
        var $freeItem = $priceCell.find('.freeItem');
        var $discountPriceBottom = $priceCell.find('.discountPrice .pushedBottom');
        $freeItem.next().remove();
        return {
            priceDiscount: !!$oldPrice.length,
            freeItemLength: $freeItem.length || $discountPriceBottom.length ? true : false,
            freeItem: $freeItem,
            discountPriceBottom: $discountPriceBottom.length ? true : false,
            discountPriceBottomText: $discountPriceBottom.text(),
            price: $orig.length ? $orig.text() : $priceCell.text(),
            priceNew: !!$newPrice.length ? $newPrice.text() : '',
            priceOld: !!$oldPrice.length ? translator.translate('oldPriceLabel') + ' ' + $oldPrice.text().replace(/regular/i, '') : ''
        };
    };

    var _getGiftMessageContent = function($giftMessageContent, $editGiftButton) {
        if (!$editGiftButton.length && !$giftMessageContent.length) {
            return;
        }
        if ($giftMessageContent.length) {
            $giftMessageContent = $giftMessageContent.text().replace('Gift Message: ', '');
        }
        if ($editGiftButton.length) {
            $editGiftButton.find('a').text('Edit');
        }
        return {
            primaryIconName: 'giftIconBlue',
            primaryContent: $giftMessageContent,
            editGiftButton: $editGiftButton
        };
    };

    var _freeShippingLuggage = function($freeShippingLuggage) {
        return {
            label: $freeShippingLuggage.find('a').text(),
            tooltipClass: $freeShippingLuggage.find('.nodisplay').attr('id'),
            tooltipContent: $freeShippingLuggage.find('.nodisplay').html()
        };
    };

    var _parse = function($items) {

        return $items.map(function(i, item) {
            var $item = $(item);
            var itemData = JSON.parse($item.find('.JSON:first').text()).pageProduct;
            var $editButton = $item.find('[id*="editButton"] button');
            var $lowInv = $item.find('.lowInv_msg');
            var lowStock = !!$lowInv.length;
            var $personalizationRow = $item.find('[id*="personalizationRow"]');
            var $freeShippingLuggage = $item.find('.itemLevelAdj');
            // var $editGiftButton = $item.find('.gift_msg .button');
            var $shipSurchargeRow = $item.find('[id*="shipSurcharge_"]');

            // This variable for ship method
            var $shipping = $item.find('.shipMethod');
            var deliveryMethodMessage = '';
            if ($shipping.length) {
                deliveryMethodMessage = $shipping.contents().filter(function() {
                    return this.nodeType === 3 && this.textContent.trim() !== '';
                });
            }

            var $detailsLink = $item.find('[id*="detShipInfoLink"]');
            var $shippingSelect = $item.find('[id*="shipModeId"]');

            // This variable for shipmethod pinny
            var shippingDetailsHeader = $item.find('.detShipInfo').prev('a').text();
            var $content = $item.find('.detailedShippingInfo, .detailed_shipping_info');
            $content.find('tr').map(function(_, item) {
                var $item = $(item);
                if ($item.find('td, th').length === 0) {
                    $item.remove();
                }
            });
            if ($('.view-OrderConfirmationDisplayView').length) {
                $shipSurchargeRow = $item.next().next();
            }
            var $giftMessageContent;

            var $giftBoxDescribeMessages = '';

            var $giftBoxMessagesContainerCreate = $('<div />');

            $editButton.addClass('c-button c--small c--link c--dark c--no-padding');

            $giftBoxMessagesContainerCreate
                .append($item.nextUntil('.orderItemRow').clone());

            var $giftBoxMessages = $giftBoxMessagesContainerCreate
                .find('.giftMessageRow');

            if ((/Gift Message:/).test($giftBoxMessages.find('.gifting').text())) {
                $giftBoxDescribeMessages = $giftBoxMessages.last().find('.gifting');
            }

            var $editGiftButton = $item.find('.edit_gift_option_link');

            if (!$personalizationRow.length) {
                $personalizationRow = $item.next('[id*="personalizationRow"]');
            }

            var inStockMessage = $item.find('.avail_msg').last();

            if (itemData.itemAvailableInventoryMessage === 'In-Stock ') {
                inStockMessage = itemData.itemAvailableInventoryMessage;
            }

            return {
                isOrderPaymentPage: $('.view-OrderReviewDisplayView').length ? true : false,
                isConfirmOrderPage: $('.view-OrderConfirmationDisplayView').length ? true : false,
                deliveryMethodMessage: deliveryMethodMessage,
                isCartPage: $('.view-ShoppingCartView').length ? true : false,
                quantityCount: $item.find('.qty.txtR').find('p').first().text(),
                pinnyTargetClass: 'js-shipping-details-pinny-' + itemData.orderItemId,
                pinnyClass: 'shipping-details-pinny js-shipping-details-pinny js-shipping-details-pinny-' + itemData.orderItemId,
                itemName: itemData.prodName,
                itemHref: itemData.productDetailTargetURL,
                itemNumber: itemData.mfPartNumber,
                quantity: _getQty(itemData, $item),
                eachText: _getQty(itemData, $item).count === 1 ? '' : 'each',
                removeButton: $item.find('.remove, .qty a').addClass('c-button c--small c--link c--dark c--no-padding'),
                price: _parsePrice($item.find('.price').not('#perzuprice')),
                totalPrice: $item.find('.totalprice').text(),
                personalizationPrice: $personalizationRow.length ? true : false,
                isPersonalizationPrice: $personalizationRow.find('#perzuprice div').text().length ? true : false,
                personalizationPriceText: $personalizationRow.find('#perzuprice div').text(),
                personalizationContentClass: !$personalizationRow.find('#perzuprice div').text().length ? 'u--hide' : false,
                isStockLow: lowStock,
                isInStock: !lowStock && itemData.PERSONALIZATION_ID !== 'DS',
                stockInfo: $item.find('.avail_msg').text(),
                availabilityContainer: lowStock ? $lowInv.text() : inStockMessage,
                availableRestrictionMsg: $item.find('.avail_msg_restriction, .avail_hdr, .gwt-oid-availability'),
                shippingDate: itemData.dropShipBackOrderDistinction_avaDate,
                editButton: $editButton,
                // Used on Gifting Options Page
                giftWrapChoices: _getGiftWrapChoices($item.find('.giftWrapChoices')),
                giftMessage: _getGiftMessage($item.find('.giftMessage')),
                freeShippingLuggage: $freeShippingLuggage.length ? _freeShippingLuggage($freeShippingLuggage) : false,
                gift: $item.find('.gift-checkbox').map(function(i, gift) {
                    var $gift = $(gift);
                    var $label = $gift.find('label');

                    return {
                        input: $gift.find('input').remove(),
                        tooltipContent: $gift.find('.showGiftInfoPopup'),
                        label: $label.addClass('c-field__label'),
                        labelText: $label.text()
                    };
                }),
                originalContent: $item.find('td').map(function(i, cell) {
                    var $cell = $(cell);
                    if ($cell.is('.giftWrapChoices')) {
                        return;
                    }
                    return {
                        class: $cell.attr('class'),
                        content: $cell.html()
                    };
                }),
                giftMessageOptions: !!$giftBoxMessages.find('.totalprice').text() ? {
                    labelText: $giftBoxMessages.first().find('.gifting').text(),
                    priceText: $giftBoxMessages.first().find('.totalprice').text($giftBoxMessages.first().find('.totalprice').text().replace('$', '+'))
                } : false,
                giftMessageContent: _getGiftMessageContent(
                    $giftBoxDescribeMessages,
                    $editGiftButton
                ),
                personalizationRow: $personalizationRow.map(function(i, row) {
                    return {
                        id: row.id,
                        content: $(row).children().map(function(i, cell) {
                            return {
                                class: cell.className,
                                id: cell.id,
                                cellContent: $(cell).html()
                            };
                        })
                    };
                }),
                shippingSurcharge: $shipSurchargeRow.map(function(i, row) {
                    var $row = $(row);

                    return {
                        label: $row.find('#shipSurchargedesc').text(),
                        value: $row.find('#shipSurchargeuprice').text()
                    };
                }),
                recommendedAccessory: _getRecommendedAccessory($item.find('.cartUpSellRow')),

                shippingInfo: {
                    detailsLinkText: !!$detailsLink.length ? $detailsLink.remove().text().replace(/information/i, 'Info') : '',
                    shippingText: $shipping.text(),
                    GRShippingMethod: $shippingSelect,
                    enjoyFreeGiftOrShip : $item.find('.itemLevelAdj a')
                },
                shippingDetails: {
                    title: shippingDetailsHeader,
                    content: $content
                },
                perzNotAvailMessage: function() {
                    return $('#perznotavailmessage').text();
                },
                isPerzNotAvailMessage: function() {
                    return $('#perznotavailmessage').text().length;
                }
            };
        });
    };

    return {
        parse: _parse
    };
});
