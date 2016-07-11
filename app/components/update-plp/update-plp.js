define([
    '$',
    'velocity',
    'hijax',
    'translator',
    'pages/product-list/parsers/product-list__products',
    'pages/product-list/parsers/product-list__pagination',
    'pages/product-list/parsers/product-list__number-of-results',
    'dust!components/product-tile/product-tile',
    'dust!components/pagination/pagination',
    'dust!components/number-of-results/number-of-results',
    'dust!components/filter-stack/filter-stack',
    'dust!components/article-list-card/article-list-card',
    'dust!pages/product-list/partials/product-list__sort-by',
    'pages/product-list/parsers/product-list__refine-result',
    'pages/product-list/parsers/product-list__sort-by',
    'pages/product-list/parsers/product-list__articles',
    'components/update-plp/ui/filter-pinny',
    'components/update-plp/ui/show-no-results',
    'components/update-plp/ui/search-results',
    'components/update-plp/ui/filter-applied',
    'dust!components/shipping-restriction/shipping-restriction',
    'global/parsers/shipping-restriction',
    'dust!components/tabs/partials/tab-controls',
    'dust!components/filter-stack/partials/category-filter',
    'scrollTo'
],
function($, Velocity, Hijax, Translator, productListProductsParser, productListPaginationParser,
    productListNumberOfResultsParser, ProductTileTemplate,
    PaginationTemplate, NumberOfResultsTemplate, filterStackTemplate, ArticleListCardTemplate,
    ProductListSortByTemplate, refineResultParser, productListSortByParser, productListArticleParser,
    initFilterPinnyUI, showNoResultsUI, searchResultsUI, isFilterAppliedUI, shippingRestrictionTemplate,
    shippingRestrictionParser, TabControlsTemplate, CategoryFilterTemplate) {

    // Get Products and Article Tabs
    var getProductsAndVideoTabs = function($container) {
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
            $(html).children().length &&
            $('.js-product-article').html(html).removeAttr('hidden');
        });
    };

    // Add active class on selected filter text label
    var activeCheckedFilterLable = function($checkbox) {
        $checkbox.map(function(_, item) {
            var $item = $(item);
            var $label = $item.closest('label').find('.c-filter-panel__label');
            if ($item.find('input').is(':checked')) {
                $label.addClass('c--check-active');
            } else {
                $label.removeClass('c--check-active');
            }
        });
    };

    var priceRangeApplied = function($priceRange) {
        var startPriceFrom = $priceRange.first().text();
        var endPriceTo = $priceRange.last().text();
        var text = startPriceFrom.length ? startPriceFrom + ' - ' + endPriceTo : 'All';
        $('.js-price-range-slider').find('.c-custom-select__inner').text(text);
    };

    var setFilterStack = function($pinnyInstance1) {
        $pinnyInstance1.map(function(i, item) {
            var $pinnyInstance = $(item).find('.pinny__content');
            var $filterStack = $pinnyInstance.closest('.c-filter-stack__filters').find('.c-custom-select__inner');
            var selectedFilter = $pinnyInstance.find('.sli_selected > a, .sli_selected > span > a');
            var selectedFilterArr =
                selectedFilter.map(function(_, item) {
                    var $item = $(item);
                    if ($item.find('img').length === 0) {
                        return $item.text().trim();
                    }
                    return $item.find('img').clone();
                });
            selectedFilterArr = selectedFilterArr.toArray();
            if (selectedFilterArr.length === 0) {
                $filterStack.html('All');
            } else {
                if ( typeof (selectedFilterArr[0]) === 'string' ) {
                    $filterStack.text(selectedFilterArr.join(', ') || 'All');
                } else {
                    $filterStack.html(selectedFilterArr || 'All');
                }
            }
        });
    };

    var getCategoryList = function($container) {

        var $template;

        $container.find('.sli_count').remove();
        $container.find('.sli_facetImage').remove();
        $container.find('.sli_unselected').prepend('<span class="sli_facetImage"><input type="checkbox"></span>');
        $container.find('.sli_selected').prepend('<span class="sli_facetImage"><input type="checkbox" checked></span>');

        if (!$container.find('li').length) {
            return;
        }
        var $plpCategory = $container.find('#sideBoxContent').find('.firstChild');
        var data = {
            filterStackfilters:  {
                label: 'Category',
                labelClass: 'u-margin-start-md',
                customSelectText: Translator.translate('all'),
                customSelect: true,
                filterStackfiltersClass: 'js-filter-stack',
                isFilterPanelPinny: true,
                filterPanelClass: 'js-filter-panel',
                isHeader: true,
                pinnyTitle: 'Category',
                filterPanelContent: !!$plpCategory.length ?
                                        $plpCategory.children('li').addClass('c-category-filter-list') :
                                        $container.children('li').addClass('c-category-filter-list')
            }
        };

        new CategoryFilterTemplate(data, function(err, html) {
            if (!$(html).find('.pinny__content').children().length) {
                return;
            }
            $template = $(html);
        });
        return $template;
    };

    // TODO: Add comments
    var filterStackfilters = function() {
        var $filter = $('#sli_head_facets');
        $filter.find('.sli_narrow').text().replace(':', '');
        var refineContentData = refineResultParser.parse($filter);
        var $categoryList = getCategoryList($('#sli_facet_cat1_group'));
        var bellowsHeading = $filter.find('.sli_narrow');
        bellowsHeading.html(!!bellowsHeading.html() && bellowsHeading.html().replace(':', ''));
        var $refineResults = $('.js-refine-results');
        filterStackTemplate({filterStackItems: refineContentData}, function(err, html) {
            if (!$(html).children().length &&
                    !jQuery('.js-filter-stack-category').children().length) {
                $refineResults.hide();
            } else {
                $refineResults.show();
            }
            $refineResults.find('.c-bellows__header').find('.sli_narrow').remove();
            $refineResults.find('.c-bellows__header').append(bellowsHeading);
            $('.js-filter-by').replaceWith(html);
            $('.js-filter-by').find('.c-filter-stack__heading').after($categoryList);
            // initFilterPinnyUI();
            setFilterStack($('.js-filter-panel'));
            activeCheckedFilterLable($('.c-filter-panel__checkbox'));
            setTimeout(function() {
                priceRangeApplied($('.sli-range-slider-thumb-label'));
            }, 100);

            var $filterPinny = $('.js-filter-single-pinny');
            var $filterContent = $('.js-filter-panel');

            if ($filterPinny.find('.c--category-piny').length) {
                $filterPinny.find('.c--category-piny')
                    .find('.pinny__content')
                    .html($filterContent.find('.c-category-filter-list').parent().html());

                $filterPinny.find('.pinny__close').addClass('c--apply').text('Apply');
            } else if ($filterPinny.find('.c--size-piny').length) {
                $filterPinny.find('.c--size-piny')
                    .find('.pinny__content')
                    .html($filterContent.find('#sli_facet_top_size_group').parent().html());

                $filterPinny.find('.pinny__close').addClass('c--apply').text('Apply');
            } else if ($filterPinny.find('.c--color-piny').length) {
                $filterPinny.find('.c--color-piny')
                    .find('.pinny__content')
                    .html($filterContent.find('#sli_facet_top_color_group').parent().html());

                $filterPinny.find('.pinny__close').addClass('c--apply').text('Apply');
            } else if ($filterPinny.find('.c--price-piny').length) {
                $filterPinny.find('.c--price-piny')
                    .find('.pinny__content')
                    .html($filterContent.find('#sli_facet_top_pbove_group').parent().html());

                $filterPinny.find('.pinny__close').addClass('c--apply').text('Apply');
            }

            isFilterAppliedUI();
            var $pricePinnyContent  = $('.js-filter-single-pinny').find('.c--price-piny').find('.pinny__content');
            if (!!$pricePinnyContent) {
                $pricePinnyContent.html(
                    $('.c-filter-stack__filters:contains(Price)').find('#sli_facet_top_pbpri_group, #sli_facet_top_pbove_group')
                );
            }
        });
    };

    var updateShippingMessage = function() {
        var updateShippingMessageData = shippingRestrictionParser.parse($('#ProductCategory_InternationalShipRestrictContentEspotDiv'), $('#showIntlShipRestrictInfoPopup'));
        shippingRestrictionTemplate({shippingRestriction: updateShippingMessageData}, function(err, html) {
            $('.js-shipping-restriction').html(html);
        });
    };

    var clearPriceFilter = function() {
        var $priceFilter = jQuery('#sli_bct').find('[href*="raprislider"]');
        $priceFilter.find('img').remove();
        $priceFilter.append('<svg class="c-icon " data-fallback="img/png/remove.png"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-remove"></use></svg>');

        if (!$('#slider-raprislider').length) {
            jQuery('.c-breadcrumb ').after($priceFilter.addClass('c-price-filter-clear'));
        } else {
            $('.c-price-filter-clear').remove();
        }
    };

    var interceptLeftNavUpdate = function() {
        filterStackfilters();
        var _updateLeftNav = jQuery.sliLoadInData;
        jQuery.sliLoadInData = function() {
            var _returnLeftNav = _updateLeftNav.apply(this, arguments);
            searchResultsUI.getProductVideoSection();
            filterStackfilters();
            clearPriceFilter();
            return _returnLeftNav;
        };
    };

    var updateRefineButtonText = function() {
        var $bellowButton = $('.js-refine-button').find('span');
        var $bellowButtonOpen = $('.bellows--is-open').find($bellowButton);
        var totalCount = $('.js-total-count').text().trim();

        // Don't change the sequence of below two lines.
        $bellowButton.text('Refine ' + totalCount + ' Results');
        $bellowButtonOpen.text('Show ' + totalCount + ' Results');

        $('.c-refine-filter').bellows({
            open: function() {
                // 'js-total-count' is used without caching since it is
                // updated each time.
                totalCount = $('.js-total-count').text().trim();
                $bellowButton.text('Show ' + totalCount + ' Results');
            },
            close: function() {
                // 'js-total-count' is used without caching since it is
                // updated each time.
                totalCount = $('.js-total-count').text().trim();
                $bellowButton.text('Refine ' + totalCount + ' Results');
            }
        });
    };

    // Update number of products displayed and total products count
    var updateNumberOfResults = function($container) {
        var templateData = productListNumberOfResultsParser.parse($container);
        new NumberOfResultsTemplate({numberOfResults: templateData}, function(err, html) {
            jQuery('.js-number-of-results').html(html);
            updateRefineButtonText();
        });
    };

    // Update products
    var updateProductTiles = function($products) {
        var templateData;
        if ($products.find('.sli_travel_result').length) {
            var $article = $products.find('.sli_travel_result');
            templateData = productListArticleParser.parse($article);
            new ArticleListCardTemplate({articleListCard: templateData}, function(err, html) {
                $('.js-product-tile').find('ul').html(html);
            });
            updateNumberOfResults($('.sli_bct_num_results').parent());
            $('.js-product-list__sort-by').addClass('u--hide');
        } else {
            var $productContainer = $products.find('.sli_resultcontainer_inner');
            templateData = productListProductsParser.parse($productContainer, true);
            new ProductTileTemplate({products: templateData}, function(err, html) {
                jQuery('.js-product-tile').find('ul').html(html);
            });
        }

    };

    // Display Shipping restiction message
    var updateShippingRestrictionMessage = function() {
        var $message = $('.js-restriction-msg-container');

        if (!$message.hasClass('nodisplay')) {
            $message.parent().removeAttr('hidden');
        }
    };

    var plpWebSphere = function() {
        if (event.animationName === 'plpWebSphere') {
            updateProductTiles(jQuery('.gwt-products-display-panel').find('.gwt-product-info-panel'));
        } else if (event.animationName === 'shippingRestriction') {
            updateShippingMessage();
            updateShippingRestrictionMessage();
        }
    };

    // TODO: Add comments
    var plpWebSphereTile = function() {
        // Add event listeners for an filter panel being added.
        // TODO: Cache variables
        document.addEventListener('animationend', plpWebSphere);
        document.addEventListener('webkitAnimationEnd', plpWebSphere);
    };


    // Handle swatch functionality
    // Change main image on click of swatche and swatche image
    var handleSwatcheFunctionality = function() {
        $('body').on('click', '.js-swatche-image', function() {
            var $this = $(this);
            var $productContainer = $this.closest('.c-product-tile');
            var $productImage = $productContainer.find('.js-product-tile-image');

            if (!$this.hasClass('js--selected')) {
                $productContainer.find('.js--selected').removeClass('js--selected');

                $this.addClass('js--selected');

                // Update thumbnail with new swatch selection
                $productImage.hide().attr('src', $this.attr('alt'));

                // Show loading overlay
                $productContainer.find('.c-product-tile__image-overlay').removeAttr('hidden');
            }
        });

        // Show the rest of the swatches
        $('body').on('click', '.c-swatches__trigger', function() {
            var $this = $(this);

            $this.attr('hidden', 'hidden');
            $this.siblings('.c-swatches__swatche[hidden]').removeAttr('hidden');
        });

    };

    var handleThumbnailUpdate = function() {
        $('.js-product-tile-image').on('load', function() {
            var $this = $(this);

            $this.closest('.c-product-tile__image-container')
                .find('.c-product-tile__image-overlay')
                .attr('hidden', 'hidden');

            Velocity.animate($this, 'fadeIn', {duration: 200});
        });
    };

    // Update Pagination
    var updatePagination = function($newPagination) {
        var paginationContent = productListPaginationParser.parse($newPagination);
        new PaginationTemplate({pagination: paginationContent}, function(err, html) {
            // Desktop class has been used as the entrie div generates dynamically
            var $html = $(html);
            if (!$html.find('li').length) {
                $html.find('> span').remove();
            }
            jQuery('.js-pagination').html($html[0]);

            $.scrollTo($('html'));
        });
        if ($('.c-pagination').find('li').length === 1) {
            $('.js-pagination').addClass('u--hide');
        }
    };

    // Update page title
    var updatePageTitle = function($pageTitle) {
        if (!$pageTitle.length) {
            return;
        }
        var $pageTitleArr = $pageTitle.trim().split(':');
        return $('.js-title').html('Search Results for' + ' ' + '<b>' + '<br>' + $pageTitleArr[1]);
    };

    // Update Sort By dropdown
    var updateSortby = function($sortby) {
        if (!$sortby.length) {
            return;
        }
        var sortbyContent = productListSortByParser.parse($sortby);
        new ProductListSortByTemplate({sortBy: sortbyContent}, function(err, html) {
            $('.js-product-list__sort-by').html(html);
        });

    };

    var bindEvents = function() {
        handleSwatcheFunctionality();
        updateRefineButtonText();
    };

    var searchPinnyClose = function() {
        if ($('.js-search-pinny').hasClass('pinny--is-open')) {
            $('.js-search').pinny('close');
        }
    };

    var bindEventForSortBy = function() {
        $('.js-sort-menu').on('change', function() {
            var dataOnclickValue = $(this).find('option:selected').attr('data-href');
            window.location.href = dataOnclickValue;
        });
    };

    var initHijax = function() {
        var hijax = new Hijax();
        var $loader = $('.js-filter-loader');

        hijax.set(
           'filter-proxy',
            function(url) {
                return url.indexOf('slisearchtr') > -1;
            },
            {
                beforeSend: function() {

                    $('.js-search-pinny.pinny--is-open').find('.pinny__close').trigger('click');
                    $('#headerBox').trigger('blur');
                    $loader.removeClass('u--hide');
                },
                receive: function(data, xhr) {
                    var $pageTitle = $('.js-title');
                    var $resultsAndSortContainer = $('.js-results-sort');
                    var $refineResults = $('.js-refine-results');
                    if (!$(data).find('.sli_noresults_container').length) {
                        $('.js-no-results').empty();
                        //updatePageTitle($('.js-desktop-sli-bct').find('.sli_bct_search_results'));
                        updatePageTitle($('.sli_display_info_text_container').text());
                        $pageTitle.removeClass('u--hide');
                        updatePagination($('#sli_pagination_header'));
                        updateNumberOfResults($('.sli_bct_num_results').parent());
                        $resultsAndSortContainer.removeClass('u--hide');
                        $refineResults.removeClass('u--hide');
                        updateSortby($('.cin-filter-sortby, .sli_sort'));
                        $('.js-product-list__sort-by').removeClass('u--hide');
                        // Search Page
                        searchResultsUI.searchSuggestionSection($('.js-desktop-sli-tab').find('.sli_tab_bar_suggestions'));
                        bindEvents();
                        bindEventForSortBy();
                    }
                    searchPinnyClose();
                }
            }
        );

        hijax.set(
            'price-proxy',
            function(url) {
                return url.indexOf('JSONPricingAPI') > -1;
            },
            {
                complete: function(data, xhr) {
                    updateProductTiles($('#sli_loadingDiv')); //.find('.sli_resultcontainer_inner'));
                    $loader.addClass('u--hide');

                    handleThumbnailUpdate();
                }
            }
        );

        hijax.set(
            'new-additions',
            function(url) {
                return url.indexOf('newest-additions') > -1;
            },
            {
                complete: function() {
                    // FRGT-163: Updated structure for the new additions headings
                    var $heroImageContainer = $('.js-product-tile').find('li').children('h2').parent();
                    $heroImageContainer.map(function(_, item) {
                        var $item = $(item);

                        $item.replaceWith($item.find('h2').removeAttr('style').addClass('c-newest-addtion-title'));
                    });
                }
            }
        );
    };

    var updatePlpUI = function() {
        updateProductTiles($('#sli_loadingDiv'));
        updatePagination($('#sli_pagination_header'));
        updateShippingMessage();
        initHijax();
        plpWebSphereTile();
        interceptLeftNavUpdate();
        showNoResultsUI();
        bindEvents();
        bindEventForSortBy();
        updateShippingRestrictionMessage();
    };

    return updatePlpUI;

});
