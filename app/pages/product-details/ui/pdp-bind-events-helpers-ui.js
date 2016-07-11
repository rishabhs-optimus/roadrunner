define([
    '$',
    'translator',
    // Parsers

    // UI
    'pages/product-details/ui/add-to-cart-ui',
    'pages/product-details/ui/wishlist-ui',
    'pages/product-details-bundle/ui/product-detail-widget-ui',
    'pages/product-details/ui/pdp-build-helpers-ui',
    'pages/product-details/ui/pdp-helpers-ui',
    // Templates
], function($, Translator, AddToCartUI, WishlistUI,
    ProductDetailWidgetUI, BuildHelpersUI, HelpersUI) {

    var _toggleSelected = function($selected) {
        $('.js-thumbnails').removeClass('c-updated-swatch-color-to-thumb');

        $selected.addClass('c-updated-swatch-color-to-thumb');
    };

    // zoom image on zoom-toggle, not on image click
    var bindProductImage = function() {
        $('body').on('click', '.c-product-image__zoom-toggle', function(e) {
            e.preventDefault();

            $(this).siblings('.magnifik').find('img').click();
        });
    };

    var bindThumbnails = function() {
        $('body').on('click', '.js-thumbnails', function(e) {
            e.preventDefault();

            var $selectedThumbnail = $(this);
            var $caption = $('.js-product-image__caption').addClass('u-visually-hidden');
            // give new image some time to load
            setTimeout(function() {
                HelpersUI.updateMainImageSrc($(this));
            }, 50);

            _toggleSelected($selectedThumbnail);
        });
    };

    var bindSwatches = function() {


        $('body').on('click', '.js-swatches', function(e) {
            var $target = $(e.target);

            if ($target.is('.gwt-pdp-swatch-thumbnail-image')) {
                HelpersUI.updateProductImageCaption($target.attr('alt'));
            }
        });

        $('[name=Color].js-product-option').on('change', function(e) {
            // Changing color selects doesn't change main product image, so don't update the label
            if (Adaptive.evaluatedContext.hiddenData.bundleData) {
                return;
            }

            var $select = $(this);
            var $selectedOption = $select.find('option[value="' + this.value + '"]');
            var colorName = $selectedOption.text().match(/(\w*\s*)*/)[0];

            if (/select\s*color/i.test(colorName)) {
                return;
            }

            HelpersUI.updateProductImageCaption(colorName);
        });

        $(document).on('change', 'select.js-product-option', function() {
            var $self = $(this);
            // Delay as desktop is taking time to update
            setTimeout(function() {
                var $priceTotal = $('.js-pdp-price-total');
                var $updatedPrice = $('#gwt_productdetail_json').find('.gwt-product-detail-widget-top-total-price-amount');
                if ($self.find('option:selected').text().indexOf('Choose') !== -1) {
                    // Update the Price Total
                    $priceTotal.text($updatedPrice.text());
                    $('.js-pdp-price-total').removeClass('c-price-text');
                    // Desktop also shows/hides the Total
                    if ($('.gwt-product-detail-widget-top-total-price-holder[style*="none"]')) {
                        $priceTotal.text('');
                    }
                } else {
                    $priceTotal.removeClass('u--hide');
                    $('.js-add-personalization-label').removeClass('u--hide, c--is-disabled');
                    $('.js-add-personalization').removeClass('u--hide');
                    // Update the Price Total
                    $priceTotal.text($updatedPrice.text());
                }
            }, 1000);
        });

        $(document).on('click', '.js-swatches .js-product-option', function(e) {
            // Change the first image of swatches as per desktop functionality
            var $clickedSwatch = $(this);
            var $firstCarouselItem = $('.js-product-image-thumbnails .js-thumbnails').first().find('img');
            var dataBindId = $clickedSwatch.attr('data-bind-click');
            var imageSrc = $clickedSwatch.find('img').attr('src').replace('$wgcp', '$wfpm');
            imageSrc = imageSrc.replace('_SW', '');
            imageSrc = imageSrc.replace('colorchip_pdp', 'product_add_image');

            $firstCarouselItem.attr('src', imageSrc);
            $firstCarouselItem.parents('.js-product-option').addClass('c-updated-swatch-color-to-thumb').attr('data-bind-click', dataBindId);
        });
    };

    var bindProductWidgetClick = function() {
        $('.js-product-tile[data-widget-id*="gwt"]').on('click', function(ev) {
            // This is requried to override default scroll happening due to anchor
            ev.preventDefault();
            ProductDetailWidgetUI.showProductDetailWidgetModal($(this));
        });
    };

    var bindClicks = function() {
        $('body').on('click', '.js-bind', function(e) {
            e.preventDefault();

            var $this = $(this);
            var bindId = $this.attr('data-bind-click');
            var $original = $('[data-bind-click="' + bindId + '"]');

            $original[$original.length - 1].click();

            // sometimes the event handlers are on the inputs
            if ($original.siblings('input').length) {
                $original.siblings('input').click();
            }

            HelpersUI.updateMainImageSrc($original[$original.length - 1]);
        });


        // bindProductWidgetClick();
    };

    var bindStepper = function() {
        $('body').on('click', '.js-stepper-decrease, .js-stepper-increase', function(e) {
            e.preventDefault();

            var $this = $(this);
            var $stepper = $this.closest('.c-stepper');
            var $count = $stepper.find('.c-stepper__count');
            var $qtySelect = $this.closest('.t-product-details__quantity').find('select');
            var count = $qtySelect.find('option:selected').text();
            count = parseInt(count);
            var highestCount = $qtySelect.find('option:last-child').text();

            // TRAV-446: Disabled state wasn't being removed
            $stepper.find('.c--disabled').removeClass('c--disabled');

            if ($this.hasClass('js-stepper-decrease')) {
                count--;
                if (count <= 1) {
                    count = 1;
                    $this.addClass('c--disabled');
                }
            } else {
                count++;
                if (count >= highestCount) {
                    count = highestCount;
                    $this.addClass('c--disabled');
                }
            }
            $qtySelect.val(count).change();
            var evt = document.createEvent('HTMLEvents');
            evt.initEvent('change', false, true);
            $qtySelect[0].dispatchEvent(evt);

            // TRAV-442: Reset ATC button if it's in "View Cart" state
            if ($('.js-add-to-cart').hasClass('js-to-cart')) {
                $('.js-add-to-cart').removeClass('js-to-cart').html('Add to Cart');
            }
        });
    };

    var _sortPrices = function($pricesContainer) {
        // Takes a DOM container with price elements as children
        // Modifies the DOM container to sort the price elements from low to high
        var $prices = $pricesContainer.children();
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
        $pricesContainer.empty().append($prices);
    };

    var bindProductImageOptionClick = function() {
        $('body').on('click', '.gwt-image-picker-option-image, .gwt-selection-chip-picker-option', function(e) {
            $('.js--selected-option').removeClass('js--selected-option');
            $(e.target).addClass('js--selected-option');
            var $productSpecification = $('.gwt-product-option-panel-chosen-selection');

            $productSpecification.attr('hidden', 'hidden');

            setTimeout(function() {
                $('.gwt-ListBox').wrap('<div class="c-select"></div>');

                var $secondTitlePrice = $('.js--selected-option').parents('.gwt-product-option-panel').find('.js-second-title-price__price').length ?
                    $('.js--selected-option').parents('.gwt-product-option-panel').find('.js-second-title-price__price') :
                    $('.js-second-title-price .js-second-title-price__price');
                var $chosenSelection = $('.js--selected-option').parents('.gwt-product-option-panel').find('.gwt-product-option-panel-chosen-selection');
                var _shouldSortPrices = false;
                // TRAV-274: Make price updates dynamic in second title and price container
                if ($chosenSelection.find('.gwt-now-price-for-selected-item, .gwt-was-price-for-selected-item').length) {
                    // If there is a price element, wipe the second price container empty
                    $secondTitlePrice.empty();
                    _shouldSortPrices = true;
                }
                if ($chosenSelection.find('.gwt-now-price-for-selected-item').length) {
                    // Handle the "Now" price container
                    $chosenSelection.find('.gwt-now-price-for-selected-item')
                        .addClass('c--now-price c-category-product__price-now c-arrange__item')
                        .appendTo($secondTitlePrice);
                }
                if ($chosenSelection.find('.gwt-was-price-for-selected-item').length) {
                    // Handle the "Was" price container
                    $chosenSelection.find('.gwt-was-price-for-selected-item')
                        .addClass('c--was-price c-category-product__price-was c-arrange__item')
                        .appendTo($secondTitlePrice);
                }
                if (_shouldSortPrices) {
                    // If there were any price elements, we'll need to sort them
                    _sortPrices($secondTitlePrice);
                } else {
                    // No price elements, so we'll need to extract the price and
                    // strip off any text
                    if (/[+\-]?\d+(,\d+)?(\.\d+)/.test($chosenSelection.text())) {
                        $chosenSelection.each(function(i, sel) {
                            var $sel = $(sel);
                            if (/[+\-]?\d+(,\d+)?(\.\d+)/.test($sel.text())) {
                                var $newSel = $sel.clone();
                                var $selected = $('.gwt-product-option-panel-widget-panel [class$="selected"]');
                                // Grab text that accompanies selected options and remove it from the selection text holding price
                                var $textToRemove = $selected.map(function() {
                                    return $(this).text();
                                });
                                var newText = $newSel.text();
                                $textToRemove.each(function(i, txt) {
                                    // Remove selected options' text from price string
                                    newText = newText.replace(txt, '');
                                });
                                // Strip out non-numerical text to further sanitize price string
                                newText = newText.replace(/[A-Z]?[a-z]?/g, '');
                                // Create new price element
                                var $newPrice = $('<div class="c-arrange__item">').text(newText);
                                $secondTitlePrice.html($newPrice);
                            }
                        });
                    }
                }

                HelpersUI.updateSwatchboxText();
                $productSpecification.removeAttr('hidden');

                // Update bundle color swatch image
                var $this = $(e.target);
                var $parentImg = $this.parents('.c-bellows__item').find('.iwc-main-img');
                if ($parentImg.length) {
                    $parentImg.attr('src', $parentImg.attr('src').replace(/_.*\?/, '_' + $this.attr('color') + '?'));
                } else {
                    // update single color swatch image
                    var desktopParentImgSrc = $('#gwt_productdetail_json .iwc-main-img').attr('src');
                    $('.js-product-image img').attr('src', desktopParentImgSrc);
                    $('.js-product-image-thumbnails .c-slideshow__slide').removeClass('c--selected');

                    var $selectedThumbnail = $('.js-product-image-thumbnails .js-swatch-thumbnail');

                    if ($selectedThumbnail.length) {
                        $selectedThumbnail.attr('src', desktopParentImgSrc);
                        $selectedThumbnail.parent().addClass('c--selected');
                    } else {
                        var $slide = $('<li class="c-slideshow__slide c--selected">');
                        $slide.append($('<img class="js-swatch-thumbnail">').attr('src', desktopParentImgSrc));
                        $('.js-product-image-thumbnails .c-slideshow').append($slide);
                    }
                }
            }, 1000);

            var prodSpecific = /([A-Z])\w+/g;
            var productSpecification = $productSpecification.text().match(prodSpecific) || '';
            $productSpecification.html(function(i, oldHtml) {
                return oldHtml.replace(productSpecification, '<span class="c--regular-price-space">$&</span>');
            });

            // TRAV-183 - Hide chosen selection for Size
            $productSpecification.each(function(_, item) {
                var $item = $(item);
                if ($item.parent().find('.gwt-product-options-panel-option-title').text().match(/size/i)) {
                    $item.addClass('u-visually-hidden');
                }
            });

            // Update Add To Cart button
            $('.js-add-to-cart').removeClass('js-to-cart').html('Add to Cart');
        });
    };

    var bindReviewsPaginationClick = function() {
        $('#js-reviews-bellows').on('click', '.js-review-pagination a', function() {
            var databvJsref = $(this).attr('data-bvjsref');
            // Trigger click of original Bazaar Voice pagination button
            var $paginationLink = $('.js-desktop-pdp').find('a[data-bvjsref="' + databvJsref + '"]');
            if ($paginationLink.length) {
                $paginationLink[0].click();
            }
        });
    };

    var bindPersonalizationLinks = function() {
        // Preventing double clicking on personalization action links
        $(document)[0].addEventListener('click', function(e) {
            var $this = $(e.target);

            if ($this.is('.gwt-personalize-link-style')) {
                if ($this.hasClass('js-triggered')) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }

                $this.addClass('js-triggered');

                setTimeout(function() {
                    $this.removeClass('js-triggered');
                }, 2000);
            }
        }, true);
    };


    var bindEvents = function(isLoaded) {
        bindClicks();

        if (!isLoaded) {
            bindProductWidgetClick();
            bindProductImage();
            bindSwatches();
            bindThumbnails();
            bindStepper();
            WishlistUI.bindEvents();
            AddToCartUI.bindEvents();
            bindReviewsPaginationClick();
            bindPersonalizationLinks();
        }
    };

    var resetPdpBuilderOptions = function() {
        var $productDetailWidgetPinny = $('.js-product-detail-widget-pinny');
        var $itemDesktopContainer = $('#' + $productDetailWidgetPinny.attr('data-widget-id'));
        BuildHelpersUI.buildPrice($('.js-pdp-price'), $itemDesktopContainer);

        BuildHelpersUI.buildSwatchesThumbnails(
            $productDetailWidgetPinny.find('.js-swatches'),
            $itemDesktopContainer.find('.gwt-image-picker .gwt-image-picker-option')
        );

        BuildHelpersUI.buildProductOptions(
            $productDetailWidgetPinny.find('.js-product-options'),
            $itemDesktopContainer.find('.gwt-product-option-panel')
        );
    };

    var bindCustomEvents = function() {
        $(document).on('addedToCart', function() {
            // reset bundle pdp images
            $('.c-pdp-widget-header .iwc-main-img').each(function(_, image) {
                var $image = $(image);
                $image.attr('src',  $image.attr('src').replace(/_.*\?/, '_main?'));
            });

            bindEvents(true);
        });

        // scroll to reviews and open it
        // $('.js-review-this, .js-view-reviews').on('click', function() {
        //     var $reviewBellows = $('.js-reviews-bellows');
        //     var $icon = $reviewBellows.find('.c-icon:first');
        //     $icon.attr('data-fallback', 'img/png/minus.png');
        //     $icon.find('title').text('minus');
        //     $icon.find('use').attr('xlink:href', '#icon-minus');
        //     $reviewBellows.bellows('open', 0);
        //     $.scrollTo($reviewBellows);
        // });
    };


    return {
        bindEvents: bindEvents,
        bindCustomEvents: bindCustomEvents,
        bindProductImageOptionClick: bindProductImageOptionClick,
        resetPdpBuilderOptions: resetPdpBuilderOptions
    };
});
