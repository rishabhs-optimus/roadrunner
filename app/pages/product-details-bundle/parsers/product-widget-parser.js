define([
    '$',
    'pages/product-details/parsers/product-price-parser',
    'dust!pages/product-details-bundle/partials/pdp-widget/bellowsHeader',
    'dust!pages/product-details-bundle/partials/pdp-widget/bellowsContent'
], function($, ProductPriceParser, widgetHeaderTmpl, widgetContentTmpl) {

    var chooseImage = function($img, widgetId) {
        if (!$img.length) {
            return;
        }

        for (var i = 0; i < $img.length; i++) {
            if (typeof $img.eq(i).attr('src') !== 'undefined') {
                return $img.eq(i);
            }
        }

        // If the images are not defined yet
        $img.eq(0)[0].onload = function() {
            Adaptive.$('.js-product-widget-pinny[data-widget-id="' + widgetId + '"]')
                .parents('.c-pdp-widget-header')
                .find('.c-image img')
                .attr('src', Adaptive.$(this).attr('src'));
        };

        return $('<img>');
    };

    var getBellowsHeader = function($bellowsHeader, index) {
        var $header;
        var widgetId = 'js-product-widget-pinny' + index;
        var $productDescription = $bellowsHeader.next().find('.gwt-product-detail-widget-options-column1');

        var headerData = {
            productWidgetImage: chooseImage($bellowsHeader.find('.iwc-main-img'), widgetId),
            widgetPinnyClass: widgetId,
            productWidgetDetailPinny: $bellowsHeader.next().find('.gwt-product-detail-additional-info-panel').remove(),
            productDescription: $productDescription
        };
        widgetHeaderTmpl(headerData, function(err, renderedHtml) {
            $header = $(renderedHtml);
        });
        return $header;
    };

    var getBellowsContent = function($bellowsContent) {
        var $content;
        var contentData = {
            productWidgetOptions: $bellowsContent.find('.gwt-product-detail-widget-options-column2'),
            productWidgetQantity: $bellowsContent.next('.gwt-product-detail-widget-price-column')
        };
        widgetContentTmpl(contentData, function(err, renderedHtml) {
            $content = $(renderedHtml);
        });
        return $content;
    };

    var _parse = function($pdpWidget) {
        return $pdpWidget.map(function(index, item) {
            var $item = $(item);
            return {
                bellowsHeader: getBellowsHeader($item.find('.gwt-product-detail-center-panel'), index),
                bellowsContent: $('<div class="c-swatch-selection-section js-widget-swatch" />')
            };
        });
    };

    return {
        parse: _parse
    };
});
