define([
    '$',
    'translator'
], function($, Translator) {


    var parse = function($products) {
        return $products.find('.sli_resultcontainer_inner').map(function(_, product) {
            var $product = $(product);
            var $productLink = $product.find('.prodName .product-link');
            var $priceContainer = $product.find('> .priceLine');
            var $calloutText = $priceContainer.next('div').text().trim();
            var hasPriceDiscount = $priceContainer.find('.priceWas').length ? true : false;

            return {
                productImg: $product.find('.thumbImage img:not(.more-details)').removeAttr('style'),
                productHref: $productLink.attr('href'),
                productTitle: $productLink.text(),
                productPrice: {
                    priceDiscount: hasPriceDiscount,
                    price: $priceContainer.find('.price').text(),
                    priceNewLabel: Translator.translate('currentPriceLabel'),
                    priceNew: $priceContainer.find('.priceNow').text().trim(),
                    priceOld: {
                        label: Translator.translate('oldPriceLabel'),
                        value: $priceContainer.find('.priceWas').text().trim()
                    },
                },
                shortDescription: $product.find('.sli_swatchList').text()
            };
        });
    };

    return {
        parse: parse
    };
});
