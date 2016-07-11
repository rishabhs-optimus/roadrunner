define([
    '$',
    'translator',
    'pages/product-list/parsers/product-list__search-suggestions',
    'dust!components/tabs/partials/tab-controls',
    'dust!components/search-suggestions/search-suggestions',
    'dust!components/hide-reveal/hide-reveal',
    'components/hide-reveal/hide-reveal-ui'
],
function($, Translator, productListSearchSuggestionParser, TabControlsTemplate,
    SearchSuggestionTemplate, HideRevealTemplate, hideRevealUI) {

    // Get Products and Article Tabs
    var getProductsAndVideoTabs = function($container) {
        if ($container.find('li').length < 2) {
            return;
        }
        return $container.find('li').map(function(_, tab) {
            var $tab = $(tab);
            return {
                href: $tab.find('a').attr('href'),
                title: $tab.text(),
                labelClass: $tab.hasClass('sli_selected') ? 'c--current' : false
            };
        });
    };

    var getProductVideoSection = function() {
        new TabControlsTemplate({tabs: getProductsAndVideoTabs($('.sli_tabs'))}, function(err, html) {
            if ($(html).children().length) {
                $('.js-product-tile').removeAttr('hidden');
                $('.js-product-article').html(html).removeAttr('hidden');
            } else {
                $('.js-product-article').html(html).attr('hidden');
            }
        });
    };

    // Get search suggestions for search result page
    // Used Search Suggestion and Hide Reveal component
    var searchSuggestionSection = function($suggestions) {
        if ($suggestions.length) {
            var searchSuggTemplateData = productListSearchSuggestionParser.parse($suggestions.find('li'));
            var hideRevealTemplateData = {};
            new SearchSuggestionTemplate(searchSuggTemplateData, function(err, html) {
                hideRevealTemplateData = {
                    bodyContent: $(html),
                    revealIconName: 'arrow-right',
                    hideIconName: 'arrow-right',
                    revealText: Translator.translate('search_suggestions'),
                };
            });

            new HideRevealTemplate(hideRevealTemplateData, function(err, html) {
                $(html).children().length &&
                $('.js-search-suggestion').html(html).removeAttr('hidden');
            });
        }
        hideRevealUI.init();
    };

    return {
        getProductVideoSection: getProductVideoSection,
        searchSuggestionSection: searchSuggestionSection
    };

});
