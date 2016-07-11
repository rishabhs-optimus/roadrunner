define([
    '$',
    'translator',
    'components/sheet/sheet-ui',
    'components/tabs/tabs-ui',
    'global/parsers/size-chart-pinny-parser',
    'dust!global/partials/size-chart/size-chart-main-page'
], function($, Translator, sheet,  Tabs, sizeChartParser, SizeChartTemplate) {

    var $sizeChartPinny = $('.js-size-chart-pinny');

    var _bindEvents = function() {
        Tabs.init();

    };

    var _updatePinnyHeader = function($pinnyHeader, url) {
        if (url.indexOf('sizechart_men.html') > -1) {
            return $pinnyHeader.html(Translator.translate('mens') + Translator.translate('size_chart'));
        } else if (url.indexOf('women') > -1) {
            return $pinnyHeader.html(Translator.translate('womens') + Translator.translate('size_chart'));
        } else if (url.indexOf('luggage') > -1) {
            return $pinnyHeader.html('Luggage Guidelines');
        } else {
            return $pinnyHeader.html(Translator.translate('size_guideline'));
        }
    };

    var _init = function($sizeChartContent, $sizeChartPinny, url) {
        _updatePinnyHeader($sizeChartPinny.find('.pinny__title'), url);

        if ($sizeChartContent.attr('id') === 'size-charts-all') {
            var templateContent = sizeChartParser.parse($sizeChartContent);

            new SizeChartTemplate(templateContent, function(err, html) {
                $sizeChartPinny.find('.js-size-chart-body').html(html);
                _bindEvents();
            });
        } else {
            // First <table> is a nav menu that links to other size charts.
            // Not relevant here so I won't be including it on page.
            var $tables = $sizeChartContent.children('table:not(:first)');

            $tables.find('.heading').remove();
            $tables.find('td').addClass('u-no-border');
            $tables.find('img')
                .removeAttr('align')
                .removeAttr('height')
                .removeAttr('width')
                .wrap('<div class="u-text-center">');
            $tables.find('ol').addClass('c-number-list')
                .find('li').addClass('u-margin-bottom-sm');

            $sizeChartPinny.find('.js-size-chart-body').html($tables);
        }
    };

    var _initSheet = function() {
        sheet.init($sizeChartPinny, {
            // coverage: '100%',
            shade: {
                opacity: 0.95,
                color: '#fff',
                zIndex: 3
            },
        });
    };

    return {
        init: _init,
        initSheet: _initSheet,
    };
});
