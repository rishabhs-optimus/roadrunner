define([
    '$',
    'translator',
    'components/sheet/sheet-ui',
    'dust!components/bellows/bellows',
    'removeStyle',
    'global/utils',
    'global/utils/dom-operation-override'
], function($, Translator, sheet, BellowsTmpl, RemoveStyles, Utils, DomOverride) {
    var $personalizationPinny = $('.js-personalization-pinny');
    var $personalizationShade = $('.js-personalization-shade');
    var $pinnyContent = $personalizationPinny.find('.js-personalization-content');

    $personalizationPinny.addClass('c-header-title');
    $personalizationPinny.find('.pinny__content').addClass('u-padding-all-0');

    // stick relevant content into relevant bellows steps
    var transformPinnyContent = function($container) {

        // Remove Elements
        $container.find('.gwt-personalization-modal-accordions-header').first().remove();
        $container.find('.gwt-accordion-tab-header, .tabs-button-panel')
            .remove();
        $container.find('.button.secondary:not(.step-button)')
            .attr('hidden', '')
            .addClass('js-personalization-close');

        $container.find('.gwt-personalization-modal-leftbody-content, .gwt-accordion-tab-content').removeStyle();

        // Style Cost
        $container.find('.gwt-dm-modal-productinfopanel-cost').addClass('u--italic u-margin-bottom-lg');


        // Style Image
        $container.find('.gwt-personalization-modal-rightbody-content')
            .addClass('u-border-bottom u-bleed-lg u-text-align-center');

        // Style Input
        $container.find('.gwt-personalization-modal-accordions-content input').each(function() {
            var $input = $(this);

            $input.siblings('.gwt-personalization-textbox-label').wrap('<label>');
            $input.parent().addClass('c-field').parent().addClass('c-field__row');

        });

        // Style Swatch Label
        var swatchLabel = $container.find('.gwt-swatch-picker-label-name').text();

        $container.find('.gwt-personalization-swatch-picker-label').parent().addClass('u-margin-bottom-lg');

        $container
            .find('.gwt-personalization-swatch-picker-label')
            .parent().prepend('<div class="t-product-details__personalize-label c-arrange c--justify-between"><label>' + swatchLabel + '</div>');
        $container.find('.t-product-details__personalize-label').append($container.find('.gwt-personalization-swatch-picker-description').addClass('u-margin-top-lg u-margin-bottom-md'));

        $container.find('.gwt-personalization-swatch-picker-label').remove();

        // Style Swatches
        $container.find('.gwt-swatch-picker')
            .addClass('c-swatch__container u-shift-start u-shift-end');

        $container
            .find('.gwt-swatch-picker')
            .addClass('c-swatch__container');

        $container
            .find('.gwt-personalization-image-picker-option, .gwt-personalization-swatch-picker-option')
            .addClass('c-swatch');

        // Button
        $container.find('.button.primary').addClass('js-personalization-save');

        $container.find('.gwt-personalization-modal-accordions-content-option').each(function() {
            var $option = $(this);
            var $input = $option.find('input');
            if ($input.length) {
                var $placeholder = $option.find('.gwt-personalization-textbox-description').remove();
                $input.attr('placeholder', $placeholder.text());
            }
        });

        $container.find('.gwt-personalization-image-picker-label').remove();

        $container.find('.gwt-personalization-image-picker-description').addClass('u-text-align-center u-margin-bottom-md');

        $container.find('.js-personalization-save, .js-personalization-save')
            .addClass('c-button c--full-width u-margin-bottom-md')
            .wrapAll('<div class="u-margin-bottom-md"></div>');

        $container.find('.button.primary')
            .addClass('c--primary')
            .text(Translator.translate('save_and_close'));

        $container.find('.gwt-personalization-modal-total-price-holder').addClass('u-text-align-end u-margin-bottom-lg u--bold u-text-size-large');
        $container.find('#gwt-personalization-shipping-details')
            .addClass('c-aux-text u-padding-sides-md u-text-align-center');
    };

    var animationListener = function() {
        if (event.animationName === 'errorAdded') {
            var $clonedErrorPanel = $('.gwt-personalization-modal-mainpanel #gwt-error-placement-div').clone(true);
            var $errorPanel = $('.js-error-panel');
            $clonedErrorPanel.find('.gwt-csb-error-panel').removeClass('gwt-csb-error-panel');
            $errorPanel.html(
                $clonedErrorPanel
            );
        }
    };

    var _closePinny = function() {
        var $lockup = $('.lockup__container');
        $personalizationPinny.parent().appendTo($lockup);
        $personalizationShade.appendTo($lockup);

        $personalizationPinny.pinny('close');
    };

    var buildPinny = function() {
        var $modal = $('#gwt-personalization-modal-V2');

        $modal.children(':not(.pinny)').addClass('u-visually-hidden');
        $('.gwt-PopupPanelGlass').addClass('u-visually-hidden');

        $personalizationPinny.find('.c-sheet__title').html('Personalize');

        // we can't use a partial template here without losing all event listeners
        // So instead we need to transform the content in place
        $pinnyContent.empty();
        $pinnyContent.append($('<div class="js-error-panel u-padding-left-tight" />'));

        $modal
            .append($pinnyContent.closest('.pinny'))
            .append($personalizationShade);

        $pinnyContent.append($modal.find('#gwt-error-placement-div, .gwt-dm-modal-productinfopanel-cost, .gwt-personalization-modal-rightbody-content, .gwt-personalization-modal-leftbody-content, #gwt-personalization-shipping-details, .gwt-submit-cancel-dialog-button-panel'));

        transformPinnyContent($pinnyContent);

        $personalizationPinny.pinny('open');
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

    var _updateSecondPrice = function() {
        // TRAV-425
        var $secondTitlePrice = $('.js-second-title-price .js-second-title-price__price');
        var $chosenSelection = $('.gwt-product-option-panel-chosen-selection');
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
    };

    var updateChosenPersonalization = function() {
        var $container = $('.gwt-product-detail-widget-personalization-panel');

        // TRAV-425
        _updateSecondPrice();

        if (!$container.length) {
            return;
        }

        $container.append($container.find('.gwt-personalize-edit-remove-link-panel-style'));
    };

    var waitForPersonalizationModal = function() {
        var $personalizationModal = $('#gwt-personalization-modal-V2');
        var pollForVisible = window.setInterval(function() {
            if (/visibility: visible/i.test($personalizationModal.attr('style'))) {
                clearInterval(pollForVisible);
                buildPinny();
            }

            // clear interval after 10s
            setTimeout(function() {
                clearInterval(pollForVisible);
            }, 10000);

            return;
        }, 100);
    };

    var _bindPinnyEvents = function() {
        $('body').on('click', '.js-personalization-pinny .pinny__close', function() {
            $('.js-personalization-pinny .js-personalization-close').triggerGWT('click');
        });

        DomOverride.on('domAppend', '#gwt-personalization-modal-V2', waitForPersonalizationModal);
        DomOverride.on('domRemove', '#gwt-personalization-modal-V2', _closePinny);
        DomOverride.on('domAppend', '', updateChosenPersonalization, '.gwt-personalize-edit-remove-link-panel-style');
    };

    var _init = function() {
        // Initialize these separately from the other plugins,
        // since we don't have to wait until the product image is loaded for these.
        sheet.init($personalizationPinny, {
            shade: {
                opacity: 0.95,
                color: '#fff',
            },
            coverage: '100%',
            closed: function() {
                updateChosenPersonalization();
            }
        });

        _bindPinnyEvents();

        document.addEventListener('animationStart', animationListener);
        document.addEventListener('webkitAnimationStart', animationListener);
    };

    return {
        init: _init,
        build: buildPinny
    };
});
