define([
    '$'
], function($) {

    var parse = function($container) {
        if (!$container.length) {
            return;
        }
        var $options;
        if ($container.hasClass('sli_sort')) {
            var $optionsSortBy = $container.filter('.sli_sort').find('.active, a').map(function(_, item) {
                var $link = $(item);
                return {
                    value: $link.attr('href'),
                    text: $link.text(),
                    selected: $link.hasClass('active')
                };
            });
        }
        $options =  $container.find('.cin-options li').map(function(_, item) {
            var $item = $(item);
            var $link = $item.find('a');
            if ($link !== null && $link !== undefined) {
                $link.attr('onclick', function(i, v) {
                    return v.replace(/document.location.href='|';return false;/g, '');
                });
            }
            return {
                value: $link.attr('onclick'),
                text: $link.text(),
                selected: $item.hasClass('cin-selected')
            };
        });
        return {
            options: $options.length ? $options : $optionsSortBy
        };
    };

    return {
        parse: parse
    };
});
