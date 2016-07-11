define(['$', 'translator', 'global/utils'], function($, Translator, Utils) {

    var _parse = function($container) {
        return $container.find('.gwt-product-info-panel').map(function(_, item) {
            var $currentItem = $(item);
            var hasPriceDiscount = $currentItem.find('.gwt-product-info-panel-stacked-price-was-label').length ? true : false;
            $currentItem.find('.gwt-product-info-panel-avail:contains(No Longer)').addClass('u-text-error u--bold');
            return {
                productImg: Utils.getHighResolutionProductImage($currentItem.find('.gwt-browse-product-image')),
                productHref: $currentItem.find('.gwt-Anchor').attr('href'),
                productTitle: $currentItem.find('.gwt-sub-category-info-panel-link').text(),
                productPrice: {
                    priceDiscount: hasPriceDiscount,
                    price: $currentItem.find('.gwt-product-info-panel-avail'),
                    priceNew: $currentItem.find('.gwt-product-info-panel-stacked-price-now-label').text(),
                    priceOld: $currentItem.find('.gwt-product-info-panel-stacked-price-was-label:contains("Was")').map(function(_, item) {
                        return {
                            value: $(item).text()
                        };
                    }),
                    priceRegular: $currentItem.find('.gwt-product-info-panel-stacked-price-was-label:contains("Regular")').map(function(_, item) {
                        return {
                            value: $(item).text().replace('Regular', 'Reg')
                        };
                    }),
                    isThreeTielPrice: $currentItem.find('.gwt-product-info-panel-stacked-price-now-label.gwt-promo-discount-now-label').length ? true : false,
                    currentItemThreeTierSalePrice: $currentItem.find('.gwt-product-info-panel-stacked-price-now-label.gwt-promo-discount-now-label').text(),
                    currentItemThreeTierRegularPrice: $currentItem.find('.gwt-product-info-panel-stacked-price-was-label.gwt-promo-discount-orginal-label').text()
                        .replace('Regular', Translator.translate('regular_price_label')),
                    currentItemThreeTierWasPrice: $currentItem.find('.gwt-product-info-panel-stacked-price-was-label.gwt-promo-discount-was-label').text(),
                },
                productRating: $currentItem.find('.bvrating'),
                currentItemReview: Utils.getNumberOfReviews($currentItem.find('.gwt-product-info-panel-details-panel-html-bv-reviews')),
                shortDescription: $currentItem.find('.gwt-product-info-panel-was-now-price-holder ~ .gwt-product-info-panel-details-panel-html').text()
            };
        });
    };

    return {
        parse: _parse
    };
});
