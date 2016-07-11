define([
    '$',
    'dust!pages/product-list/partials/product-list__no-results',
    'pages/product-list/parsers/product-list__no-results',
    'global/ui/enable-disable-button'
],
function($, NoResultsTemplate, productListNoResultParser, enableDisableButtonUI) {

    // Get no search result page content
    var showNoResults = function($noResults) {
        var $loader = $('.js-filter-loader');
        var noSeacrhResultContent = productListNoResultParser.parse($noResults);

        // Remove search contents that is appended by desktop
        $('.js-product-tile').find('#sli_products').empty();
        $('.js-product-tile').prop('hidden', 'hidden');
        //$('.js-product-tile').find('ul').removeClass('t-product-list__product-tile');
        new NoResultsTemplate(noSeacrhResultContent, function(err, html) {
            $('.js-no-results').html(html);
        });

        $('.c-bellows').bellows();
    };

    var handleNoResult = function() {

        var $loader = $('.js-filter-loader');

        if (event.animationName === 'noResult') {
            $loader.removeClass('u--hide');
        }
    };

    var handleNoResult1 = function() {
        var $loader = $('.js-filter-loader');
        if (event.animationName === 'noResult') {
            var $noResultsPanel = $('.js-no-results');
            showNoResults($('.sli_noresults_container'));

            // Hide sections that are not required on n search result page
            $('.js-title').addClass('u--hide');
            $('.js-results-sort').addClass('u--hide');
            $('.js-refine-results').addClass('u--hide');
            $('.js-search-suggestion').empty();

            $noResultsPanel.removeAttr('hidden');
            $loader.addClass('u--hide');

            enableDisableButtonUI();
        }
    };

    var noResultHandler = function() {
        // Add event listeners for no results Section
        document.addEventListener('animationStart', handleNoResult);
        document.addEventListener('animationend', handleNoResult1);
        document.addEventListener('webkitAnimationStart', handleNoResult);
    };

    return noResultHandler;

});
