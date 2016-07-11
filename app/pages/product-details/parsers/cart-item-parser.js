define(['$'], function($) {

    var _parseItems = function($items) {
        return $items.map(function(i, item) {
            var $item = $(item);
            return {
                name: $item.find('.addToCartProductName').text(),
                options: $item.find('.oios-option-line').map(function(i, optionLine) {
                    var $optionLine = $(optionLine);
                    return {
                        value: $optionLine.find('.ois-option-value').remove().text(),
                        label: $optionLine.text()
                    };
                }),
                price: {
                    label: $item.find('.gwt_addtocartdiv_pricelabel').text(),
                    value: $item.find('.gwt_addtocartdiv_price').text()
                },
                qtyValue: $item.find('.gwt_addtocartdiv_quanity, .gwt_grDiv_quantity').text()
            };

        });
    };

    var _parsePrice = function($priceContainer) {
        return $priceContainer.map(function(_, priceContainer) {
            var $priceContainer = $(priceContainer);
            var hasDiscount = $priceContainer.find('.gwt_addtocartdive_waspricevalue, .gwt_addtocartdiv_waspricevalue').length;
            var $priceOldLabel = $priceContainer.find('.gwt_addtocartdiv_waspricelabel');
            var $priceNewLabel = $priceContainer.find('.gwt_addtocartdiv_nowpricelabel');

            // TRAV-430: Keep existing old price parsing intact
            var _priceOld = $priceContainer.find('.gwt_addtocartdive_waspricevalue, .gwt_addtocartdiv_waspricevalue').map(function(i, item) {
                return {
                    label: $priceOldLabel.eq(i).text(),
                    value: $(this).text().trim()
                };
            });

            if ($priceContainer.hasClass('gwt-promo-has-orginal-label')) {
                // TRAV-430: Ensure price ordering is correct
                _priceOld = []; // reset
                // Add "Was" price
                _priceOld.push({
                    label: $priceContainer.find('.gwt-promo-discount-was-label .gwt_addtocartdiv_waspricelabel').text(),
                    value: $priceContainer.find('.gwt-promo-discount-was-label .gwt_addtocartdive_waspricevalue, .gwt-promo-discount-was-label .gwt_addtocartdiv_waspricevalue').text().trim()
                });

                // Add "Regular" price
                _priceOld.push({
                    label: $priceContainer.find('.gwt-promo-discount-orginal-label .gwt_addtocartdiv_waspricelabel').text(),
                    value: $priceContainer.find('.gwt-promo-discount-orginal-label .gwt_addtocartdive_waspricevalue').text().trim()
                });
            }

            return {
                price: $priceContainer.find('.gwt_addtocartdiv_price').text(),
                priceDiscount: !!hasDiscount,
                priceOld: _priceOld,
                priceNewLabel: $priceNewLabel.length ? $priceNewLabel.text().trim() + ' ' : '',
                priceNew: $priceContainer.find('.gwt_addtocartdive_nowpricevalue').text(),
            };
        });
    };

    var _parseModalCartItems = function($items) {
        return $items.map(function(i, item) {
            var $item = $(item);
            var $personalizationText = $item.find('.gwt_personalization_wrapper');
            var shippingText =  $item.find('.gwt_addtocartdiv_shipping_message').text();
            $personalizationText.find('.separator').remove();
            return {
                name: $item.find('.addToCartProductName').text(),
                options: $item.find('.oios-option-line').map(function(i, optionLine) {
                    var $optionLine = $(optionLine);
                    return {
                        name: $optionLine.find('.ois-option-name').remove().text(),
                        value: $optionLine.find('.ois-option-value').remove().text(),
                    };
                }),
                itemDetail: {
                    itemLabel: $item.find('.gwt_addtocartdiv_itemlabel').text(),
                    itemNumber: $item.find('.gwt_addtocartdiv_itemnumber').text()
                },
                qtyValue: $item.find('.gwt_addtocartdiv_quanity, .gwt_grDiv_quantity').text(),
                imgSrc: $item.find('.gwt-shoppingcart-thumbnail-image').attr('src'),
                price: _parsePrice($item.find('.gwt_addtocartdiv_pricepanel')),
                lowQuantityText: $item.find('.gwt_addtocartdiv_fLowQuantityLabel').addClass('u-text-error'),
                shippingText: shippingText.length ? shippingText : '',
                personalizationText: $personalizationText.addClass('u-text-gray'),
                personalizationCost: $item.find('.gwt-addtocartdiv-personalization-cost-panel').text(),
                inventoryMessage: $item.find('.gwt_addtocartdiv_fInventoryMessageLabel').addClass('u-text-small u-text-gray')
            };

        });
    };

    var _parseCartModal = function($fullModal) {
        return {
            items: _parseModalCartItems($fullModal.find('.addToCartItem')),
        };
    };

    var _buildWishlistHref = function() {
        return $('#wishlist').find('a').attr('href');
    };

    var _parseWishlist = function($fullModal) {
        var $viewListButton = $fullModal.find('.button.primary');
        return {
            items: _parseItems($fullModal.find('.addToCartItem')),
            checkoutButton: '',
            viewListButton: {
                text: $viewListButton.text(),
                href: _buildWishlistHref()
            },
            successMessage: $fullModal.find('.dialogTopCenterInner .gwt-HTML').first().text()
        };
    };

    return {
        parseCartModal: _parseCartModal,
        parseWishlist: _parseWishlist
    };
});
