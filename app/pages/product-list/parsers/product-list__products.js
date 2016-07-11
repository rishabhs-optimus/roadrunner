define([
    '$',
    'global/parsers/rating-star',
    'global/utils'
], function($, globalStarRatingParser, Utils) {

    // Check for More colors
    // Remove more color string from product image if present
    var isMoreColorsAvailable = function($productImage, isUIScript) {
        var moreColorsString = '&badgeValue=morecolors';
        var srcAttribute = 'src';
        if (!isUIScript) {
            srcAttribute = 'x-src';
        }

        if (!!$productImage.attr(srcAttribute) && $productImage.attr(srcAttribute).match(new RegExp(moreColorsString)) !== null) {
            $productImage.attr(srcAttribute, $productImage.attr(srcAttribute).replace(moreColorsString, ''));
            $productImage.attr('data-alternative', $productImage.attr('data-alternative').replace(moreColorsString, ''));
            return true;
        }
        return false;
    };

    // Get product Ratings
    var parseRating = function(reviewSrc) {
        var rating = /(\d\_\d)\.gif/.exec(reviewSrc);

        if (rating) {
            // turn the rating value into a float
            rating = parseFloat(rating[1].replace('_', '.'));

            return globalStarRatingParser.parse(rating, true);
        }
    };

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
                    price: $(priceContainer).children(),
                };
            } else {
                templateData = {
                    priceNew: $(priceContainer).find('.cin-price-now, .gwt-product-info-panel-stacked-price-now-label').text().replace('Now', ''),
                    priceOld: { value: $oldPrice.text().replace('Was', '') },
                    priceDiscount: true
                };
            }
        });

        return templateData;
    };

    // Get Articles - used article list card component
    var getArticles = function($products, isUIScript) {
        return $products.map(function(_, item) {
            var $item = $(item);

            return {
                articleLink: $item.children('a'),
                articleHeading: $item.find('.cin-details a').text(),
                articleDescription: $item.find('.cin-description').html()
            };
        });
    };

    var parse = function($products, isUIScript) {
        if ($products.hasClass('sli_nonproduct_result')) {
            return getArticles($products, isUIScript);
        }
        $('.t-product-list__refine-results').removeAttr('hidden');
        return $products.map(function(_, product) {
            var $product = $(product);
            var $productLink = $product.find('.product-link, .gwt-Anchor');
            var $productImage = $product.find('.cin-image, .gwt-browse-product-image').clone();
            var $ratingImage = $product.find('.bvrating');
            var ratingSrc = $ratingImage.attr('x-src') || $ratingImage.attr('src');
            var swatches = $product.find('.sli_swatch_ele').map(function(index, item) {
                return {
                    swatcheSrc: $(item).find('img').attr('src'),
                    altSrc: $(item).find('img').attr('alt')
                };
            });
            $productImage.removeAttr('onmouseout').removeAttr('onmouseenter').addClass('js-product-tile-image');
            return {
                class: $product.attr('class'),
                productLink: $productLink,
                productHref: $productLink.attr('href'),
                moreColors: isMoreColorsAvailable($productImage, isUIScript),
                productImg: $productImage,
                productTitle: $productLink.text(),
                productPrice: updatePrices($product.find('.priceLine, .gwt-product-info-panel-was-now-price-holder')),
                productRating: $product.find('.bvrating'),
                productSwatches: {
                    ifMore: swatches.length > 6,
                    swatches: swatches.length > 6 ? swatches.slice(0, 5) : swatches,
                    moreSwatches: swatches.length > 6 ? swatches.slice(5) : []
                },
                calloutText: $product.find('.cin-callout').text(),
                currentItemReview: $product.find('.ratingCopy'),
                shortDescription: $product.find('.sli_short_desc')
            };
        });
    };

    return {
        parse: parse
    };
});
