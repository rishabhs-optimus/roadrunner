define(['$'], function($) {

    // Update prices for products
    var updatePrices = function($el) {
        var templateData = {};
        $el.each(function(i, priceContainer) {
            var $priceContainer = $(priceContainer);
            var $priceLine = $(priceContainer).find('.cin-price, .gwt-product-info-panel-avail');
            var $oldPrice = $(priceContainer).find('.cin-price-then, .gwt-product-info-panel-stacked-price-was-label');
            $priceContainer.find('.removed').addClass('u-text-error');
            if (!$oldPrice.length) {
                $priceContainer = $(priceContainer).find('.priceWas');
                if ($priceContainer.length > 0) {
                    $priceContainer.html($priceContainer.text().replace('Regular', 'Was'));
                    var $oldPrice = $(priceContainer).find('.priceWas').clone().addClass('c--price-was');
                    var $newPrice = $(priceContainer).find('.priceNow').clone().addClass('c--price-new');
                    $(priceContainer).find('.priceWas').replaceWith($newPrice);
                    $(priceContainer).find('.priceNow:not(.c--price-new)').replaceWith($oldPrice);
                }

                templateData = {
                    price: $(priceContainer),
                };
            } else {
                templateData = {
                    priceNew: $(priceContainer).find('.cin-price-now, .gwt-product-info-panel-stacked-price-now-label').text().replace('Now', ''),
                    priceOld: { value: $oldPrice.text().replace('Regular', '') },
                    priceDiscount: true
                };
            }
        });

        return templateData;
    };

    var parse = function($container) {
        var $carouselItems;
        if (!$container.products) {
            $carouselItems = $container.find('.tilePanel .carouselTile').map(function(_, item) {
                var $item = $(item);
                var $heading = $item.find('.gwt-we-suggest-panel-name-anchor');

                return {
                    img : $item.find('.gwt-we-suggest-panel-img-anchor img'),
                    heading: $heading.text(),
                    href: $heading.attr('href'),
                    productPriceContainer: $item.find('.gwt-product-info-panel-avail, .gwt-product-info-panel-was-now-price-holder').length ? true : false,
                    productPrice: updatePrices($item
                        .find('.gwt-product-info-panel-avail, .gwt-product-info-panel-was-now-price-holder')),
                };
            });
        } else {
            $container.products.map(function(product) {
                return {
                    img : $('<img />').attr('src', product.thumbNail),
                    heading: product.prodName,
                    href: product.productDetailTargetURL
                };
            });
        }


        return {
            items: $carouselItems,
            // carouselTitle:
        };
    };

    return {
        parse: parse
    };
});
