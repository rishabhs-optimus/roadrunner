define([
    '$',
    'components/sheet/sheet-ui',
    'components/update-plp/ui/filter-applied'
],
function($, Sheet, isFilterAppliedUI) {

    // Show price range in price filter drodown
    var priceRangeApplied = function($priceRange) {
        var startPriceFrom = $priceRange.find('a').first().text();
        var endPriceTo = $priceRange.find('a').last().text();
        $priceRange.closest('.c-filter-stack__filters')
            .find('.c-custom-select__inner').text(startPriceFrom + ' - ' + endPriceTo);
    };

    var initFilterPinny = function() {
        var $filterSheetEl;
        var filterSheet;

        // $('.js-filter-stack').on('click', function() {
        //     var $pinnyContainerEl = $(this);
        //     $filterSheetEl = $pinnyContainerEl.find('.js-filter-panel');
        //     filterSheet = Sheet.init($filterSheetEl, {
        //         appendTo: $pinnyContainerEl,
        //         shade: {
        //             opacity: 0.9,
        //             color: '#fff'
        //         },
        //         closed: function() {
        //             var $pinnyInstance = $(this.$content);
        //             priceRangeApplied($pinnyInstance.find('.c-filter-panel__label .sli-range-slider-track'));
        //             isFilterAppliedUI();
        //         }
        //     });
        //     filterSheet.open();
        // });
    };

    return initFilterPinny;

});
