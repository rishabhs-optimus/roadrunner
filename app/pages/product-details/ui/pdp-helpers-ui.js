define([
    '$',
    'translator',
    'components/sheet/sheet-ui',
], function($, Translator, sheet) {
    var checkSwatchesSelected = function($containers) {
        var containerCount = $containers.length;
        var selectedSwatchCount = 0;

        $containers.each(function() {
            var $this = $(this);

            if ($this.find('.gwt-selection-chip-selected, .gwt-image-picker-option-image-selected').length) {
                selectedSwatchCount++;
            }
        });

        if (selectedSwatchCount === containerCount) {
            return true;
        } else {
            return false;
        }
    };

    var enableDisableButton = function() {
        var $priceContainer = $('.gwt-product-detail-top-price')[0];
        var $swatchContainers = $('.gwt-product-option-panel-swatchbox');
        var swatchesSelected = $swatchContainers.length ? checkSwatchesSelected($swatchContainers) : null;
        var personalizationForm = $('.gwt_personalization_options_panel');
        var notnull = true;
        if (personalizationForm.find('input:first').val() === '') {
            notnull = false;
        }

        if ((!!$priceContainer && $priceContainer.style.display === 'none') ||
            (!swatchesSelected) ||
            // TRAV-274: Don't enable ATC button if an unavailable combination is selected
            ($('.c-swatch-selection-section .gwt-no-available-combination > [class$="selected"]').length)
            ) {
            $('.js-enable-disable-button').find('button').addClass('c--is-disabled');
        } else {
            $('.js-enable-disable-button').find('button').removeClass('c--is-disabled');
        }
        if (notnull === true && personalizationForm.length) {
            $('.js-enable-disable-button').find('button').removeClass('c--is-disabled');
        }
    };

    var enableDisableAddToCartWishlist = function() {
        $('body').on('click', '#gwt-option-panel', function() {
            setTimeout(function() {
                enableDisableButton();
            }, 2000);
        });
        $('body').on('keyup', '.gwt_personalization_options_panel input', function() {
            setTimeout(function() {
                enableDisableButton();
            }, 2000);
        });
    };

    var buildStaticPersonalization = function() {
        var $optionPanel = jQuery('.c-swatch-selection-section').find('.gwt_personalization_options_panel');
        $optionPanel.find('.gwt-HTML').remove();
        $('.gwt-product-detail-widget-personalization-chosen-values').find('.gwt-personalization-textbox-label').first().addClass('c-required-label');
        $('.gwt-product-detail-widget-personalization-chosen-values').find('.gwt-personalization-textbox-description').first()
        .text($('.gwt-product-detail-widget-personalization-chosen-values').find('.gwt-personalization-textbox-description').first().text().replace('*Required.', ' '));
        $('.js-enable-disable-button').prepend($('.c-product-qty-and-price'));

        $optionPanel.find('input').map(function(idx, itm) {
            var $input = jQuery(this);
            var $labelAndDescription = $('<div class="c-arrange"></div>');

            $labelAndDescription.append($input.prev().addClass('c-arrange__item u-margin-top-md u-margin-bottom-md'));
            $labelAndDescription.append($input.next().addClass('u-text-small u-text-gray u-margin-top-md u-margin-bottom-md u-text-align-end'));

            $input.wrap('<div class="c-box-row" />');
            $input.before($labelAndDescription);
        });
    };

    var updateMainImageSrc = function($item) {
        var $container = $('.js-product-image');
        var $productImage = $container.find('.c-product-image__image');
        if ($item) {
            var productImageSrc = $($item).attr('src');
            //TODO -- make helper function

            if (productImageSrc) {
                productImageSrc = productImageSrc.split('?')[0];
                productImageSrc = productImageSrc.replace('$wgcp', '$wgis');
                productImageSrc = productImageSrc.replace('$wgit', '$wgis');
                productImageSrc = productImageSrc.replace('$wfis', '$wgis');
                productImageSrc = productImageSrc.replace('_SW', '');
                $productImage.attr('src', productImageSrc);
            }
        }
        var imgSrc = $productImage.attr('src');

    };

    var updateSpecialShipping = function($desktopContainer) {
        if (!$desktopContainer) {
            $desktopContainer = Adaptive.$('.gwt-product-detail-widget-dynamic-info-panel .gwt-HTML:not([style*="none"]),' +
                '.gwt-product-bottom-col2-content-panel .gwt-product-detail-quantityrow');
        } else {
            $desktopContainer = $desktopContainer.find('.gwt-product-detail-widget-dynamic-info-panel .gwt-HTML:not([style*="none"]),' +
                '.gwt-product-bottom-col2-content-panel .gwt-product-detail-quantityrow');
        }
        var shippingText = $desktopContainer.clone(true);

        if (!shippingText) {
            $('.js-shipping-text').remove();
            return;
        }

        var $shippingText = $('<div>', {
            class: 'js-shipping-text u-text-align-center'
        }).html(shippingText);

        var $shippingItem = Adaptive.$('.js-shipping-text');
        if (!$shippingItem.length) {
            $shippingText.insertAfter($('.c-pdp-price-section'));
        } else {
            $shippingItem.html(shippingText);
        }
    };

    var updateProductImageCaption = function(swatchColor) {
        if (!swatchColor) {
            return;
        }

        var $container = $('.js-product-image');
        var $caption = $container.find('.js-product-image__caption');

        $caption
            .removeClass('u-visually-hidden')
            .text(swatchColor);
    };

    var updatePrice = function() {
        var $updatedPrice = $('#gwt_productdetail_json').find('.gwt-product-detail-widget-top-total-price-amount');
        $('.js-pdp-price-total').text($updatedPrice.text());
    };

    var updateDesktopSelect = function($qtySelect, count) {
        $('.c-stepper').find('button').removeClass('c--disabled');
        if (count > 1 && count < 20) {
            $('.c-stepper').find('button').removeClass('c--disabled');
        } else if (count <= 1) {
            $('.c-stepper').find('.js-stepper-decrease').addClass('c--disabled');
        } else {
            $('.c-stepper').find('.js-stepper-increase').addClass('c--disabled');
        }

        // update desktop div
        // need to use window dispatch event to trigger prototype events
        $qtySelect.val(count);
        var evt = document.createEvent('HTMLEvents');
        evt.initEvent('change', false, true);
        $qtySelect[0].dispatchEvent(evt);

        setTimeout(function() {
            updatePrice();
        }, 1000);
    };

    var productDetailsDecorators = function() {
        // after-render decorations
        var $container = $('.js-product-image');
        var $productImage = $container.find('.iwc-main-img');
        var $exclusiveTag = $('.gwt-product-detail-bold-label');

        $productImage.addClass('c-product-image__image');

        if ($productImage[0]) {
            $productImage[0].ontouchstart = undefined;
            $productImage[0].onclick = undefined;
        }

        // if ($exclusiveTag.length) {
        //     $('.js-tag')
        //         .text($exclusiveTag.text())
        //         .removeAttr('hidden');
        // }

        // fastclick causing issues where elements need to be double clicked
        // for clicks to register
        $('js-bind').addClass('needsclick');

        // if there are multiple product options, let's trigger the first qty to be selected
        $('.js-stepper-decrease').first().click();

        // GH-130: Monogramming link missing on desktop markup, use hardcoded one instead
        var $monogramImg = $('.js-product-bellows').find('img').filter(function() {
            return /monogram/.test(jQuery(this).attr('src'));
        });

        var $monogramLink = $('<a>', {
            // either this or use custom asset
            href: location.origin + '/wcsstore/images/GarnetHill/sitewide/monogramcharts/sheets.html',
            text: 'Monogramming Sizing and Placement',
            target: '_blank'
        });

        if ($monogramImg.length) {
            $monogramImg.after($monogramLink);
        }
    };

    var updateSwatchboxText = function($container, $desktopContainer) {
        if (!$container) {
            $container = $('.js-color-text');
        }
        if (!$desktopContainer) {
            $desktopContainer = Adaptive.$('.gwt-product-option-panel-chosen-selection');
        }
        $container.text($desktopContainer.text());
    };

    var updateCTAs = function() {
        var $desktopCtas = $('.gwt-top-cart-gift-registry-btns').first();
        var $desktopAddToCart = $desktopCtas.find('.primary');
        var $addToCartButton = $('.js-add-to-cart');
        var $wishlistButton = $('.js-add-to-wishlist');

        if ($desktopCtas.find('.secondary').is('[style*="none"]')) {
            $wishlistButton.attr('hidden', 'true');
        }


        $addToCartButton.append($('<svg class="c-icon" data-fallback="img/png/arrow-right.png"><title>arrow-right</title><use xlink:href="#icon-arrow-right"></use></svg>'));
    };

    // Update all the carousel anhors to have the coremetrics data in the hash.
    // TODO: Refactor this to be less susceptible to desktop changes, or carousel order changes.
    var updateCarouselAnchors = function() {
        var $carousels = $('.t-product-details__suggested-products .c-scroller');

        $carousels.each(function(index) {
            var $ourCarousel = $(this);
            var $theirCarousel = $('[class^="gwt-we-suggest-panel-products"]').eq(index);
            var $theirAnchor = $theirCarousel.find('a:first');

            var hash = $theirAnchor.attr('href').split('?')[1];

            // Update our product anchors by adding the sections ('recently viewed', 'may we suggest', etc) hash.
            if (hash) {
                $ourCarousel.find('a').each(function() {
                    var $anchor = $(this);

                    $anchor.attr('href', $anchor.attr('href') + '?' + hash);
                });
            }
        });

    };

    var getWidgetDesktopContainer = function() {
        var $pinny = $('.js-product-detail-widget-pinny');
        return $('#' + $pinny.attr('data-widget-id'));
    };

    // / Handles the icons displayed when bellow is open and closed
    var initBellows = function() {
        $('.js-product-bellows').on('click', '.c-bellows__header', function(e) {
            var $target = $(this);

            var $icon = $target.find('.c-icon');

            if ($icon.find('title').text() === 'expand') {
                $icon.attr('data-fallback', 'img/png/collapse.png');
                $icon.find('title').text('collapse');
                $icon.find('use').attr('xlink:href', '#icon-collapse');
            } else {
                $icon.attr('data-fallback', 'img/png/expand.png');
                $icon.find('title').text('expand');
                $icon.find('use').attr('xlink:href', '#icon-expand');
            }
        });
    };

    return {
        enableDisableAddToCartWishlist: enableDisableAddToCartWishlist,
        updateMainImageSrc: updateMainImageSrc,
        updateProductImageCaption: updateProductImageCaption,
        updateCTAs: updateCTAs,
        updateDesktopSelect: updateDesktopSelect,
        productDetailsDecorators: productDetailsDecorators,
        updateSwatchboxText: updateSwatchboxText,
        updateSpecialShipping: updateSpecialShipping,
        updateCarouselAnchors: updateCarouselAnchors,
        getWidgetDesktopContainer: getWidgetDesktopContainer,
        initBellows: initBellows,
        buildStaticPersonalization: buildStaticPersonalization
    };
});
