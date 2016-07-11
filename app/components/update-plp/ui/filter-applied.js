define([
    '$'
], function($) {

    var filterApplied = function() {
        var isFilterApplied = false;
        var $customSelect = $('.c-custom-select__inner');
        var $refineButton = $('.js-refine-button');

        $customSelect.each(function() {
            if ($(this).text().trim() !== 'All') {
                isFilterApplied = true;
                return;
            }
        });

        if (isFilterApplied) {
            $refineButton.addClass('c-filter-applied');
        } else {
            $refineButton.removeClass('c-filter-applied');
        }
    };

    return filterApplied;
});
