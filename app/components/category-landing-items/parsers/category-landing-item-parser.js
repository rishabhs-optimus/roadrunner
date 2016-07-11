define(['$', 'global/utils'], function($, Utils) {


    var _parse = function($container) {
        return $container.find('.gwt-sub-sub-category-main-container, .cat5last').map(function() {
            var $currentItem = $(this);
            return {
                currentItemLink: $currentItem.find('> a').addClass('c-link'),
                currentItemImage: Utils.getHighResolutionImage($currentItem.find('.gwt-sub-category-image')),
                currentItemText: $currentItem.find('.gwt-sub-category-name-link').text()
            };
        });
    };

    return {
        parse: _parse
    };
});
