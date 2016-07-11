define([
    '$',
    'global/utils',
    'global/includes/pdp-sections/ui/pdp-utils',
    'translator',
    // Parsers
    'pages/product-details/parsers/product-image-parser',
    'pages/product-details-bundle/parsers/product-image-bundle-parser',
    'pages/product-details/parsers/scroller-parser',
    'pages/product-details/parsers/product-options-parser',
    'pages/product-details/parsers/product-price-parser',
    'pages/product-details-bundle/parsers/product-widget-parser',
    // Templates
    'dust!components/stepper/stepper',
    'dust!components/product-image/product-image',
    'dust!pages/product-details-bundle/partials/product-image-bundle',
    'dust!components/scroller/scroller',
    'dust!pages/product-details/partials/product-options',
    'dust!components/price/price',
    'dust!components/bellows/bellows',
    'dust!components/pdp-widget/pdp-widget',
    'dust!components/hide-reveal/partials/hide-reveal-links'
], function($, Utils, pdpUtils, Translator,
    // Parsers
    ProductImageParser, ProductImageBundleParser, ScrollerParser, ProductOptionsParser,
    ProductPriceParser, ProductWidgetParser,
    // Templates
    StepperTmpl, ProductImageTmpl, ProductImageBundleTmpl, ScrollerTmpl, ProductOptionsTmpl,
    PriceTmpl, BellowsTmpl, ProductWidgetTmpl, HideRevealLinksTmpl) {

    var enableDisableClasses = '.js-add-to-cart, .gwt-product-detail-widget-personalization-panel';
    var _getSelectDropDown = function($options) {
        return {
            options: $options.map(function(index, item) {
                var $item = $(item);
                var text = $item.text();
                if (index === 0) {
                    return;
                }
                return {
                    value: $item.attr('value'),
                    dataId: $item.attr('data-id'),
                    text: text,
                    selected: $item.hasClass('active')
                };
            })
        };
    };

    var _buildProductQuantityOption = function($quantityOptionContainer) {
        $quantityOptionContainer = $('.gwt-product-detail-widget-quantity-panel');

        if (!$quantityOptionContainer.length) {
            return;
        }
        var $quantityContainer = $('<div>', {
            class: 't-product-details__quantity c-box-row'
        });
        var stepperHTML;


        $quantityContainer.append($('<label class="u-padding-left-tight">Quantity</label>'));
        var $itemNum = $('.gwt-bdp-signle-product-item-number');
        // parser data
        var $selectQty = $quantityOptionContainer.find('.csb-quantity-listbox').addClass('u-white').parent();
        var $optionZero = $selectQty.find('select').find('option').first();
        parseInt($optionZero.val()) === 0 && $optionZero.prop('disabled', 'disabled');

        var data = {
            decreaseIcon: 'minus',
            decreaseTitle: 'Reduce Quantity',
            increaseIcon: 'plus',
            isMin: true,
            increaseTitle: 'Increase Quantity'
        };

        new StepperTmpl(data, function(err, html) {
            // appending to existing options
            stepperHTML = html;
        });

        var $priceSection = $quantityOptionContainer.find('.gwt-product-detail-widget-top-total-price-holder');
        $priceSection.find('.gwt-product-detail-widget-top-total-price-label').remove();

        $quantityContainer
            .append(stepperHTML)
            .append($quantityOptionContainer.find($priceSection).addClass('c-pdp-price-total c-price-text'))
            .append($itemNum);

        $quantityContainer.find('.js-stepper-decrease').after($selectQty);
        return $quantityContainer;
    };

    var buildProductWidgets = function() {
        var $container = $('.js-product-widget');

        // parser data
        var collection = {
            title: $('.gwt-select-items-bundle-header .gwt-Label'),
            products: ProductWidgetParser.parse($('.gwt-product-detail-widget'))
        };

        new ProductWidgetTmpl(collection, function(err, html) {
            $container.empty().append(html);
        });
    };

    var heightOfImageContainer = function() {
        var imageHeight = $('#gwt-product-detail-left-panel').height();
        $('.js-product-image').height(imageHeight);
    };

    var buildProductImages = function(isBundled, $container, $desktopContainer, isWidget) {
        // if (!$container) {
        //     $container = $('.js-product-image');
        // }

        // // parser data
        // var data = {};
        // if (!isBundled) {
        //     if (isWidget) {
        //         data = ProductImageParser.parse($desktopContainer);
        //     } else {
        //         data = ProductImageParser.parse($('.gwt-product-detail'));
        //     }
        //     new ProductImageTmpl(data, function(err, html) {
        //         var $pdpCarouselContent = $('#gwt-product-detail-left-panel');
        //         $container.html($pdpCarouselContent);
        //         pdpUtils.transformImageThumbnail();
        //     });
        // } else {
        //     data = {
        //         bundle: ProductImageBundleParser.parse($('.gwt-product-detail'))
        //     };
        //     new ProductImageBundleTmpl(data, function(err, html) {
        //         if (jQuery(html).find('.c-product-image__image').length > 3) {
        //             $container.empty().append(html);
        //         } else {
        //             $('.c-product-image-wrapper').addClass('js-product-image').html(html);
        //         }
        //     });
        // }
    };

    var count = 0;
    var buildSwatchesThumbnails = function($container, $thumbnails) {
        var $appendTo = $appendTo || $('.c-swatch-selection-section');
        var $swatch = $container || $('.gwt-product-detail-widget')[0] || $('.gwt-product-right-content-panel')[0];
        $swatch = $($swatch);
        var hideRevealData;
        var $hideRevealLinks;

        if ($swatch.find('.gwt-product-no-options-panel').length) {
            $(enableDisableClasses).removeClass('c--is-disabled');
            return;
        }
        var $optionsPanel = $appendTo.find('.js-options-panel');
        $optionsPanel.append($swatch);

        // Find all size chart buttons
        $('.gwt-product-detail-widget .gwt-product-option-panel-custom-link').each(function(_, sizeChart) {
            var $sizeChart = $(sizeChart);
            var text  = $sizeChart.text();

            if (text.length && !/size chart/i.test(text)) {
                $sizeChart.wrap('<button class=" c-button c--secondary c-lugguage-guidelines c--full-width u-margin-top-md"></button>');
                $sizeChart.parents('.gwt-product-option-panel-swatchbox').append($sizeChart.parent().remove());
            }
        });

        if ($('.update-cart-button').length) {
            $('.js-add-to-cart')
                .text('Update to cart')
                .removeClass('c--is-disabled');
        }

        // checkProductOption();
    };

    var buildProductOptions = function($container, $productOptionsContainer) {
        if (!$container) {
            $container = $('.js-product-options').empty();
        }
        if (!$productOptionsContainer) {
            $productOptionsContainer = $('.gwt-product-option-panel');
        }

        var $multiOptionItems = [];

        $productOptionsContainer.each(function() {
            var $productOptionContainer = $(this).closest('.gwt-product-detail-widget-price-column');
            var $productOptionWrapper = $('<div>', {
                class: 'c-list-numbers'
            });
            var qtySelectName = $productOptionContainer.find('.gwt-product-detail-widget-quantity-price-panel').find('select').attr('name');
            var $title;
            var $additionalInfo;
            var $productOptions = $productOptionContainer.find('.gwt-product-option-panel-listbox-container').addClass('c-select');
            var parsedOptions = $productOptions.map(function(_, option) {
                var $option = $(option);
                return ProductOptionsParser.parse($option);
            });

            if ($productOptionContainer.find('select').length > 1) {
                $productOptionContainer.find('.gwt-personalize-link-style').addClass('u-visually-hidden');
            }

            // parser data
            var data = {
                productOptions: parsedOptions
            };

            // build SKU
            var $sku;
            var skuRegex = /Item\:\s*\d+\s/;
            var skuText = $productOptionContainer.find('.gwt-product-detail-widget-title').text().match(skuRegex);
            if (skuText) {
                skuText = skuText[0].replace(/Item\:\s*/, '');
                $sku = $('<span>', {
                    class: 'c-aux-text',
                    text: 'SKU: ' + skuText
                });
            }

            // if we have multiple product options, we need to find the title of product variant
            if ($productOptionsContainer.length > 1) {
                // build price
                $title = $('<p>');
                var regex = /^Item\:\s*\d*\s*\-\s*/;
                var text = $productOptionContainer.find('.gwt-product-detail-widget-title').text().replace(regex, '');
                $title.text(text);

                var $priceContainer = $productOptionContainer.find('.gwt-product-detail-widget-price-column');
                var $discountedPrice = $priceContainer.find('.gwt-product-detail-widget-price-now');
                var hasDiscount = $discountedPrice.length > 0 && !/display\:\s*none/.test($discountedPrice.attr('style'));
                var $price;

                if (hasDiscount) {
                    $price = $priceContainer.find('.gwt-product-detail-widget-price-was');
                } else {
                    $price = $priceContainer;
                }
                var priceData = ProductPriceParser.parse($price, $discountedPrice);

                new PriceTmpl(priceData, function(err, html) {
                    $additionalInfo = $(html);
                });
            }

            var productOptionMarkup;

            productOptionMarkup = $productOptionWrapper
                .append(_buildProductQuantityOption(qtySelectName, $sku, $productOptionContainer.find('.csb-quantity-listbox')));

            // build pdp 1
            if ($productOptionsContainer.length <= 1) {
                $container.empty().html(productOptionMarkup);
            } else {
                // build pdp 2 - multi options
                var bellowsItemData = {
                    contentClass: 't-product-details__product-options u-padding-sides-0 js-product-option-container',
                    sectionTitle: $title,
                    info: $additionalInfo.addClass('c--small'),
                    content: productOptionMarkup
                };

                $multiOptionItems.push(bellowsItemData);
            }
        });

        // build pdp 2 bellows
        if ($productOptionsContainer.length > 1) {
            var bellowsData = {
                class: 'js-pdp-2 c--blue c--checkbox c--gray-bg',
                items: $multiOptionItems
            };

            new BellowsTmpl(bellowsData, function(err, html) {
                var $title = $('<h2 class="c-title c--small u-margin-bottom-md">').text('Select and Configure');
                $container.empty().html(html);
                $container.prepend($title);
            });
        }
    };

    var _sortPrices = function($prices) {
        // Takes a collection of price DOM elements
        // Modifies the DOM to sort the price elements from low to high
        $prices.sort(function(a, b) {
            var aNum = parseFloat($(a).text().match(/[+\-]?\d+(,\d+)?(\.\d+)?/)[0]);
            var bNum = parseFloat($(b).text().match(/[+\-]?\d+(,\d+)?(\.\d+)?/)[0]);
            if (aNum > bNum) {
                return 1;
            }
            if (aNum < bNum) {
                return -1;
            }
            return 0;
        });
        return $prices;
    };

    var buildPrice = function($container, $productDetails ) {
        var $pricePanel = $productDetails.find('.gwt-price-panel').first();
        var _shouldSortPrices = false;
        if ($pricePanel.find('.gwt-promo-discount-orginal-label').length) {
            _shouldSortPrices = true;
            Utils.swapElements($pricePanel.find('.gwt-promo-discount-orginal-label'), $pricePanel.find('.gwt-now-price-holder'));
            Utils.swapElements($pricePanel.find('.gwt-promo-discount-was-label'), $pricePanel.find('.gwt-promo-discount-orginal-label'));
        } else {
            Utils.swapElements($pricePanel.find('.gwt-was-price-holder'), $pricePanel.find('.gwt-now-price-holder'));
        }

        if ($pricePanel.length) {
            if (_shouldSortPrices) {
                // TRAV-320: Ensure prices are sorted from low to high
                var $workingPricePanel = $pricePanel.clone();
                var $workingPrices = $workingPricePanel.find('.gwt-HTML');
                var $sortedPrices = _sortPrices($workingPrices);
                $workingPrices.parent().html($sortedPrices);
                $container.empty().append($workingPricePanel);
            } else {
                $container.empty().append($pricePanel);
            }
        }

        // TRAV-274: Have second price display populated alongside page's
        if ($('.js-second-title-price .js-second-title-price__price').length) {
            var $decoratedPricePanel = $pricePanel.clone();
            $decoratedPricePanel = $decoratedPricePanel.find('.gwt-HTML').addClass('c-arrange__item');
            $decoratedPricePanel.filter('.gwt-now-price-holder').addClass('c-category-product__price-now');
            $decoratedPricePanel.filter('.gwt-was-price-holder').addClass('c-category-product__price-was');
            $decoratedPricePanel = _sortPrices($decoratedPricePanel);
            $('.js-second-title-price .js-second-title-price__price').empty().append($decoratedPricePanel);
        }
    };

    var buildProductMatrix = function($container, $productDetails) {
        $container.append($productDetails);
        $productDetails.addClass('c-matrix-detail-radio-panel c-tabs__controls');
        $productDetails.find('.gwt-matrix-product-detail-radion-button-option-panel').addClass('c-matrix-detail-radio-button c-tabs__controls-item ');
        $productDetails.find('.gwt-matrix-product-detail-item-label, .gwt-Label.gwt-matrix-product-detail-item-id-value').addClass('c-matrix-detail-label');
        $productDetails.find('.gwt-matrix-product-detail-name-and-item-number-panel').addClass('c-tabs__button');
        $productDetails.find('.gwt-matrix-product-detail-name-label').addClass('c-radio-name-label');
        $productDetails.find('.gwt-matrix-product-detail-item-number-panel').addClass('c-radio-number-panel');
        $productDetails.find('.gwt-matrix-product-detail-radion-button').addClass('c-product-detail-radio-button');
        $productDetails.find('input[type="radio"]:checked')
            .closest('.c-tabs__controls-item').addClass('c--current');

        // TRAV-209
        if (!!$('.c-matrix-detail-radio-button').length) {
            heightOfImageContainer();
            $(window).on('resize', function() {
                heightOfImageContainer();
            });
        }
    };

    var buildAvaialabilityPanel = function($container, $availabilityContainer) {
        $container.append($availabilityContainer.find('.gwt-HTML'));
    };

    return {
        buildSwatchesThumbnails: buildSwatchesThumbnails,
        buildProductImages: buildProductImages,
        buildPrice: buildPrice,
        buildProductOptions: buildProductOptions,
        buildProductWidgets: buildProductWidgets,
        buildProductMatrix: buildProductMatrix,
        buildAvaialabilityPanel: buildAvaialabilityPanel
    };
});
