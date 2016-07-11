define([
    '$',
    'global/utils',
    'components/sheet/sheet-ui',
    // Templates
    'dust!pages/product-details-bundle/partials/product-widget-popup',
    // UI
    'pages/product-details/ui/pdp-build-helpers-ui',
    'translator'
], function($, Utils, sheet,
    // Templates
    ProductWidgetPopupTmpl,
    // UI
    BuildHelpersUI,
    translator) {

    var $productDetailWidgetPinny = $('.js-product-detail-widget-pinny');

    // Product Info - Title
    var _getProductInfo = function($itemDesktopContainer) {
        return {
            title: $itemDesktopContainer.find('.gwt-product-title-panel h3').text()
        };
    };

    var _showProductDetailWidgetModal = function($widgetContainer) {
        var title = 'Collection';
        var $itemDesktopContainer = $('#' + $widgetContainer.attr('data-widget-id'));

        var data = {
            widgetContent: {
                productInfo: _getProductInfo($itemDesktopContainer)
            }
        };
        $productDetailWidgetPinny.find('.c-sheet__title').html(title);

        new ProductWidgetPopupTmpl(data, function(err, html) {
            $productDetailWidgetPinny.find('.js-product-detail-widget-pinny__body').html(html);
        });

        BuildHelpersUI.buildPrice($('.js-pdp-price'), $itemDesktopContainer);
        BuildHelpersUI.buildProductImages(
            false, $productDetailWidgetPinny.find('.js-product-image'), $itemDesktopContainer, true
        );
        BuildHelpersUI.buildSwatchesThumbnails(
            $productDetailWidgetPinny.find('.js-swatches'),
            $itemDesktopContainer.find('.gwt-image-picker .gwt-image-picker-option')
        );

        BuildHelpersUI.buildProductOptions(
            $productDetailWidgetPinny.find('.js-product-options'),
            $itemDesktopContainer.find('.gwt-product-option-panel')
        );
        // Repalce with Prototype
        Utils.replaceWithPrototypeElements();

        $productDetailWidgetPinny.pinny('open');
    };

    var _initSheet = function() {
        sheet.init($productDetailWidgetPinny, {
            shade: {
                cssClass: 'js-product-detail-widget-shade'
            },
            coverage: '100%',
            appendTo: '.js-widget-container'
        });
    };

    return {
        initSheet: _initSheet,
        showProductDetailWidgetModal: _showProductDetailWidgetModal,
    };
});
