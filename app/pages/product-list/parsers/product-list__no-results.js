define([
    '$',
    'translator',
    'pages/product-list/parsers/product-list__products'
], function($, Translator, productListProductsParser) {

    // Get search again form
    var getSearchResultForm = function($form) {
        var $inputTextBox = $form.find('#sli_search_1');
        $inputTextBox.attr({'placeholder': Translator.translate('search-again'), 'value': ''});
        return {
            form: $form,
            input: $inputTextBox.addClass('c-input-form-wrapper__input-text'),
            buttonType: $form.find('input[type="button"]')
        };
    };


    var parse = function($noResults) {
        var $searchTips =  $('.no_result');
        $searchTips.find('b').wrap('<h1></h1>').addClass('no-result-found');
        $searchTips.find('h1').after('<div></div>');
        $searchTips.find('h1').before(':');
        var $popularSearch = $('#popularsearches>.new_items').text();
        var $popularListsearch = $('#popularsearches a');
        $popularListsearch = $popularListsearch.sort(function(ob1, ob2) {
            return parseInt(ob2.style.fontSize) - parseInt(ob1.style.fontSize);
        });
        var $popularListsearch = $popularListsearch.slice(0, 10);
        $popularListsearch.removeAttr('style');
        var $payPalacceptingfooter = $('#paypalNowAcceptingFooter');

        return {
            noResultsMessage: $searchTips,
            mostpopularsearch: $popularSearch.toLowerCase(),
            mostpopularsearchlist: $popularListsearch,
            paypalacceptnoresult: $payPalacceptingfooter
        };
    };

    return {
        parse: parse
    };
});
