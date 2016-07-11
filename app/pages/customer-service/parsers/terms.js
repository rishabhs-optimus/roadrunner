define([
    '$',
    'global/utils'
], function($, Utils) {
    var _parseBellows = function($container, skip) {
        return $container.map(function(_, container) {
            var $container = $(container);

            return $container.find('h2').slice(skip).map(function(_, element) {
                var $element = $(element);
                var $content = $element.nextUntil('h2');

                $content.wrapAll('<div class="c-text-content"/>');

                return {
                    sectionTitle: $element.text(),
                    content: $content.parent()
                };
            });
        })[0];
    };
    var _parse = function($container, skip) {
        return {
            beforeBellows: $container.find('h2:eq(' + skip + ')').prevUntil().remove(),
            bellows: {items: _parseBellows($container, 0)}
        };
    };

    return {
        parse: _parse
    };
});
