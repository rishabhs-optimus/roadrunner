define([
    '$',
    'translator',
    'components/search-suggestions/parsers/search-suggestions',
    'dust!components/search-suggestions/search-suggestions',
    'sheet-bottom',
    'dust!components/search-suggestions/partials/search-suggestions__header'
], function(
    $,
    Translator,
    searchSuggestionParser,
    SearchSuggestionTemplate,
    sheetBottom,
    SearchSuggestionHeader
) {

    var toggleEmptySearchImage = function() {
        var $searchResult = $('.js-search__auto-complete');
        if (!$searchResult.children().length || $searchResult.css('display') === 'none') {
            $('.c-search-pinny .pinny__content').addClass('c--no-result');
        } else {
            $('.c-search-pinny .pinny__content').removeClass('c--no-result');
        }
    };

    var overrideSearch = function() {
        var _oldAddData = window.sliAutocomplete.select.addData;
        var _oldSelectCurrent = window.sliAutocomplete.select.selectCurrent;
        var _oldInputBlur = window.sliAutocomplete.input.onBlur;
        var _hideSearchSuggestion = window.sliAutocomplete.select.hide;
        var $searchSuggest = $('#sli_autocomplete');

        $searchSuggest.addClass('c-search-suggestions u-padding-sides-md js-search__auto-complete');

        $searchSuggest.appendTo($('.js-search'));

        window.sliAutocomplete.select.hide = function() {
            _hideSearchSuggestion.apply(this, arguments);
            toggleEmptySearchImage();
        };

        window.sliAutocomplete.select.addData = function() {
            var searchData = {suggestions: ''};
            _oldAddData.apply(this, arguments);
            $searchSuggest.removeAttr('style');
            toggleEmptySearchImage();
            searchData.suggestions = searchSuggestionParser.parse($searchSuggest);

            new SearchSuggestionTemplate(searchData, function(err, html) {
                $searchSuggest.html($(html));
            });
        };

        // The desktop scripts sets the active option on hover,
        // so set it ouselves before letting the desktop scripts select the "current" option
        window.sliAutocomplete.select.selectCurrent = function() {
            var $suggestions = $('.js-suggestion');
            this.currentSelected = $suggestions.index($suggestions.filter('.js--active')[0]);
            _oldSelectCurrent.apply(this, arguments);
        };

        window.sliAutocomplete.input.onBlur = function() {
            // Don't hide the suggestions on blur.
            return;
        };

        // Mark the "active" suggestion to use above.
        $('body').on('click', '.js-suggestion', function(e) {
            $(this).addClass('js--active');
        });
    };

    var initSearch = function() {
        var searchOverridden = false;
        var $searchPinny = $('.js-search');
        var $searchInput = $('.js-search__input');
        var $headerItem = $('.t-header__row-item').children();
        var searchSuggestionHeader = false;

        var searchSuggestionHeaderData = {
            search: Translator.translate('search_travelsmith')
        };

        new SearchSuggestionHeader(searchSuggestionHeaderData, function(err, html) {
            searchSuggestionHeaderData = html;
        });



        // Init search autosuggestion PInny
        $searchPinny.pinny({
            effect: sheetBottom,
            zIndex: 1000, // Match our standard modal z-index from our CSS ($z4-depth)
            coverage: '100%',
            cssClass: 'c-sheet c-search-pinny js-search-pinny c-full-size-pinny',
            shade: {
                opacity: 0.9,
                color: '#fff'
            },
            reFocus: false,
            structure: {
                header: searchSuggestionHeaderData
            },
            open: function() {
                $headerItem.addClass('c--depth-max');
                $('.c-search-pinny .pinny__content').addClass('c--no-result');
            },
            opened: function() {
                $('.js-search__input').focus();
            },
            close: function() {
                $headerItem.removeClass('c--depth-max');
            },
            closed: function() {
                $searchInput.val('');
                window.sliAutocomplete.select.hide();
            }
        });

        $('.js-search-box').on('click', function() {

            if (!searchOverridden) {
                // The desktop function that we need to override won't exist on doc ready
                // It's a script that's added through other JS, so wait until the user first
                // focuses into the input to override the desktop functionality
                overrideSearch();
                searchOverridden = true;
            }

            $searchPinny.pinny('open');
        });

        var $searchContainer = $('.js-search');

        $searchContainer.on('keyup', '.js-search__input', function() {
            var $textBox = $(this);
            var searchBoxValue = $textBox.val();
            var $clearTextBox = $('.c-clear-search-box');
            if (searchBoxValue.length) {
                $clearTextBox.show();
            } else {
                $clearTextBox.hide();
            }
        });

        $searchContainer.on('click', '.c-clear-search-box', function() {
            var $searchBox = $('#headerBox');
            $searchBox.val('');
            $searchBox.trigger('keyup');
            window.sliAutocomplete.select.hide();
        });


    };

    return {
        init: initSearch
    };
});
