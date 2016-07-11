define([
    '$',
    'global/ui/tooltip-ui',
    'components/update-plp/update-plp',
    'components/update-plp/ui/filter-pinny',
    'components/sheet/sheet-ui',
],
function($, tooltipUI, updatePlpUI, initFilterPinnyUI, Sheet) {

    var preProcessPlpUI = function() {
        if ($('.t-product-list').length) {
            updatePlpUI();
        }
    };

    preProcessPlpUI();

    var _toggleIcon = function($item) {
        var $icon = $item.find('.c-icon');
        if ($icon.find('title').text() === 'plus') {
            $icon.attr('data-fallback', 'img/png/minus.png');
            $icon.find('title').text('minus');
            $icon.find('use').attr('xlink:href', '#icon-minus');
        } else {
            $icon.attr('data-fallback', 'img/png/plus.png');
            $icon.find('title').text('plus');
            $icon.find('use').attr('xlink:href', '#icon-plus');
        }
    };

    var bindEventsHandler = function() {
        // As the color filter is tightly coupled with its parent container
        // therefore trigger it with dummy color filter
        $('body').on('click', '.js-color-filter', function() {
            var index = $(this).parent().index();
            $('#sli_head_facets #sli_facet_top_color_group li').eq(index).find('a').trigger('click');
        });

        $('body').on('click', '.js-bellows-header', function() {
            var $item = $(this);
            _toggleIcon($item);
        });

        $('body').on('click', '.js-filter-stack', function() {

            var $pinnyContainerEl = $(this);
            var $filterSheetEl = $('.js-filter-main');

            $filterSheetEl.removeClass('c--category-piny c--size-piny c--color-piny c--price-piny');

            if ($pinnyContainerEl.find('.c-category-filter-list').length) {
                $filterSheetEl.addClass('c--category-piny');
            } else if ($pinnyContainerEl.find('#sli_facet_top_size_group').length) {
                $filterSheetEl.addClass('c--size-piny');
            } else if ($pinnyContainerEl.find('#sli_facet_top_color_group').length) {
                $filterSheetEl.addClass('c--color-piny');
            } else if ($pinnyContainerEl.find('#sli_facet_top_pbpri_group, #sli_facet_top_pbove_group').length) {
                $filterSheetEl.addClass('c--price-piny');
            }

            $filterSheetEl.html($pinnyContainerEl.find('.js-filter-panel').html());
            var filterSheet = Sheet.init($filterSheetEl, {
                appendTo: 'body',
                shade: {
                    opacity: 0.9,
                    color: '#fff'
                }
            });
            filterSheet.open();
        });

    };

    var applyDefaultView = function() {
        window.location.hash = window.location.hash.replace('&view=list', '&view=biggrid');
    };

    var productListUI = function() {
        initFilterPinnyUI();
        tooltipUI();
        bindEventsHandler();
        applyDefaultView();
    };

    return productListUI;

});
