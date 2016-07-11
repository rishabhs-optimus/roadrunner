define([
    '$',
    'translator',
    'dust!components/filter-panel/filter-panel',
    'pages/product-list/parsers/product-list__filter-panel'
],
function($, Translator, filterPanelTemplate, filterPanelParser) {

    var selectOptions = function($options) {
        return $options.map(function(index, item) {
            var $item = $(item);
            var text;
            if (index === 0) {
                text = $item.text(Translator.translate('all') + ' ' + $item.text());
            } else {
                text = $item.text();
            }
            return {
                value: $item.attr('href'),
                text: text,
                selected: $item.hasClass('cin-current')
            };
        });
    };

    var filterStackfilters = function($container) {
        return $container.find('.cin-sidebox-navigation > .cin-group > li.cin-current').map(function(index, item) {
            var $item = $(item);
            if ($item.children().length <= 1) {
                return;
            }
            return {
                labelClass: 'c-refine-category',
                selectClass: 'js-sort-menu',
                selectField: true,
                options: selectOptions($item.find('a')),
                filterStackfiltersClass: 'js-filter-stack-category'
            };
        });
    };

    var parse = function($container) {
        if (!$container.length ||
            // FRGT-165
            $container.find('.cin-current')
                .children('.cin-group').children('.cin-current').length) {
            return;
        }
        return {
            filterStack: {
                title: Translator.translate('by_category'),
                class: 'c-form-group',
                filterStackfilters: filterStackfilters($container),

            }
        };
    };

    return {
        parse: parse
    };
});
