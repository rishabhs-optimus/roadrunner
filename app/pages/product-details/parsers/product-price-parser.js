define([
    '$',
    'global/utils'
], function($, Utils) {

    var _initCurrency = function() {
        var currency = $('#gwt_international_currency_indicator').val();
        if (!currency) {
            currency = '$';
        }
        return currency;
    };

    var _parseFromJSON = function(minPrice, maxPrice, minListPrice, maxListPrice) {
        // desktop logic to calculate this is stupid...
        // 4 cases:
        // 1. 1 price, not on sale
        // 2. range price (min/max), not on sale
        // 3. 1 price, on sale
        // 4. range price (min/max), on sale with range (min/max)
        // 5. range sale price (min/max), but 1 old price (minList === maxList)
        var currency = _initCurrency();

        if (maxPrice <= 0 || minPrice <= 0) {
            return;
        }
        minPrice = Utils.roundToTwoDecimals(minPrice);
        maxPrice = Utils.roundToTwoDecimals(maxPrice);
        minListPrice = Utils.roundToTwoDecimals(minListPrice);
        maxListPrice = Utils.roundToTwoDecimals(maxListPrice);

        // not on sale cases
        if (parseInt(maxListPrice) === 0) {
            // case 1: 1 price, not on sale
            if (minPrice === maxPrice) {
                return {
                    price: currency + minPrice,
                    priceDiscount: false
                };
            } else {
                return {
                    price: currency + minPrice + ' - ' + currency + maxPrice,
                    priceDiscount: false
                };
            }
        } else {
            if (maxListPrice === minListPrice) {
                // case 5: range sale price, 1 old price
                if (minPrice !== maxPrice) {
                    return {
                        price: currency + minPrice + ' - ' + currency + maxPrice,
                        priceDiscount: true,
                        priceNew: currency + minPrice + ' - ' + currency + maxPrice,
                        priceOld: { value: currency + minListPrice }
                    };
                }
                // case 3: 1 price, on sale
                return {
                    price: currency + maxPrice,
                    priceDiscount: true,
                    priceNew: currency + minPrice,
                    priceOld: { value: currency + maxListPrice }
                };
            } else {
                // case 4. range price (min/max), on sale with range (min/max)
                return {
                    price: currency + minPrice + ' - ' + currency + maxPrice,
                    priceDiscount: true,
                    priceNew: currency + minPrice + ' - ' + currency + maxPrice,
                    priceOld: { value: currency + minListPrice + ' - ' + currency + maxListPrice }
                };
            }
        }
    };

    var _parse = function($price, $discountedPrice, hasDiscount) {
        var currency = _initCurrency();

        if (!$price.length) {
            return;
        }

        var regex = /[+-]?\d+(\.\d+)?/g;
        var price = $price.text().match(regex) || '';
        var discountedPrice = $discountedPrice.text().match(regex) || '';

        if (!price.length) {
            return;
        }

        price = price.map(function(num) {
            return Utils.roundToTwoDecimals(parseFloat(num));
        });

        if ($discountedPrice.length && discountedPrice.length) {
            discountedPrice = discountedPrice.map(function(num) {
                return Utils.roundToTwoDecimals(parseFloat(num));
            });

            if (discountedPrice.length > 1) {
                discountedPrice = discountedPrice.join(' - ' + currency);
            }
        }

        // if it's a bundle price
        if (price.length > 1) {
            price = price.join(' - ' + currency);
        }

        return {
            price: currency + price,
            priceDiscount: $discountedPrice.length > 0 && !/display\:\s*none/.test($discountedPrice.attr('style')),
            priceNew: discountedPrice ? currency + discountedPrice : '',
            priceOld: { value: currency + price }
        };
    };

    return {
        parse: _parse,
        parseFromJSON: _parseFromJSON
    };
});
