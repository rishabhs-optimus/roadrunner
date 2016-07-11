define([
    '$'
], function($) {
    var _parse = function($pdpContainer) {

        // We need only first carousel's image
        return $pdpContainer.find('.tilePanel').first().find('.iwc-thumb-img').map(function(_, item) {
            var $item = $(item);
            $item.parent('.js-thumbnails');
            return {
                imgSrc: $item.attr('src').replace('$wfit$', '$wfih$')
            };
        });
    };

    return {
        parse: _parse
    };
});
