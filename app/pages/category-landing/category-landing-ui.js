define([
    '$',
    'components/category-landing-items/category-landing-items-ui',
    'components/pagination/pagination-ui',
    'components/expandable/expandable-ui'
],
function($, CategoryLandingItemsUI, PaginationUI, Expandable) {

    var applyDefaultView = function() {
        window.location.hash = window.location.hash.replace('&view=list', '&view=biggrid');
    };

    var categoryLandingUI = function() {
        applyDefaultView();
        CategoryLandingItemsUI.init();
        PaginationUI.init();
        Expandable.init();
    };

    return categoryLandingUI;
});
