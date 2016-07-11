define([
    '$'
], function($) {
    var _parse = function($pdpWidget) {

        // We need only first carousel's image
        return $pdpWidget.map(function(_, item) {
            var $item = $(item);
            var $bellowsHeader;
            var $bellowsContent;
            return {
                items: {
                    bellowsHeader: $item.find('.gwt-product-detail-center-panel'),
                    bellowsContent: $item.find('.gwt-product-detail-widget-options-column')
                }
            };
        });
    };

    return {
        parse: _parse
    };
});
