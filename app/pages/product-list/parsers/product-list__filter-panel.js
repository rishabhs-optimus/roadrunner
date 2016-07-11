define(['$'], function($) {

    var filterPanelList = function($filterPanelList) {
        var $priceRangeSlider = $filterPanelList.find('.cin-slider');
        if ($priceRangeSlider.length) {
            return {
                label: $priceRangeSlider.addClass('c-price-range-slider')
            };
        } else {

            $filterPanelList.find('> ul').removeAttr('style');
            $filterPanelList.find('> ul').find('.viewAll, .viewAllSelected').remove();
            $filterPanelList.find('> ul#sli_facet_top_pbove_group').find('.sli_count').remove();
            $filterPanelList.find('> ul').find('.sli_facets_color').removeAttr('style');
            $filterPanelList.find('> ul').find('.sli_facetImage img').remove();
            $filterPanelList.find('> ul').find('.sli_unselected .sli_facetImage').append('<input type="checkbox">');
            $filterPanelList.find('> ul').find('.sli_selected .sli_facetImage').append('<input type="checkbox" checked>');
            if ($filterPanelList.find('#sli_facet_top_color_group').length) {
                return $filterPanelList.find('> ul').clone().find('a').removeAttr('onclick href').addClass('js-color-filter').end();
            } else {
                return $filterPanelList.find('> ul');
            }
        }
    };

    var parse = function($container) {
        return {
            filterPanel: {
                filterPanelList: filterPanelList($container)
            }
        };
    };

    return {
        parse: parse
    };
});
