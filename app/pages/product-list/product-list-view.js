/**
 * Product List Page View
 */

define([
    '$',
    'global/baseView',
    'dust!pages/product-list/product-list',
    'dust!components/button/button',
    'dust!components/filter-stack/filter-stack',
    'pages/product-list/parsers/product-list__refine-result',
    'components/breadcrumb/parsers/breadcrumb',
    'components/carousel/parsers/carousel',
    'pages/product-list/parsers/product-list__products',
    'pages/product-list/parsers/product-list__sort-by',
    'pages/product-list/parsers/product-list__pagination',
    'pages/product-list/parsers/product-list__number-of-results',
    'global/parsers/shipping-restriction',
    'pages/product-list/parsers/product-list__refine-category',
    'pages/product-list/parsers/product-list-2__pagination'
],
function($, baseView, template, buttonTemplate, filterStackTemplate, refineResultParser,
    breadcrumbParser, relatedProductsParser, productListProductParser, productListSortByParser,
    productListPaginationParser, productListNumberOfResultsParser, shippingRestrictionParser,
    refineCategoryParser, productListPagination2Parser) {

    return {
        template: template,
        extend: baseView,
        context: {
            templateName: 'product-list',
            leftNavHidden: function() {
                return $('#leftNav').addClass('c-left-nav u-visually-hidden');
            },
            breadcrumbLink: function() {
                var $breadcrumb = $('#breadcrumbs_ul');

                if (!$breadcrumb.length) {
                    return;
                }
                var $breadcrumContent = breadcrumbParser.parse($breadcrumb);
                if ($breadcrumContent.title === '') {
                    return;
                }
                return $breadcrumContent;
            },

            pageTitle: function() {
                return $('#categoryHeader').text();
            },

            pageMainTitle: function() {
                return $('#browseHead').addClass('c-title u-padding-top u-padding-bottom');
            },
            portaForma: function() {
                return {
                    form: $('#changepageSizeForm'),
                    hiddenField: $('#filters')
                };
            },
            products: function() {
                return $('#sli_resultsSection_wrapper');
            },
            sortBy: function() {
                return productListSortByParser.parse($('.cin-filter-sortby, #sli_head_facets, #sli_head .sli_sort'));
            },
            shippingRestriction: function() {
                return shippingRestrictionParser.parse($('#ProductCategory_InternationalShipRestrictContentEspotDiv'), $('#showIntlShipRestrictInfoPopup'));
            },
            numberOfResults: function() {
                return productListNumberOfResultsParser.parse($('.sli_bct_num_results').parent());
            },
            hiddenFilters: function() {
                return $('#sli_head_facets');
            },
            refineResult: function() {
                var $filterContainer = $('#sli_head_facets').clone();

                var refineContentData = refineResultParser.parse($filterContainer);
                var refineCategoryData = refineCategoryParser.parse($filterContainer);
                var $refineContent;
                var $refineCategoryContent;
                var filterStackDataArray = [];

                refineCategoryData && filterStackDataArray.push(refineCategoryData);
                refineContentData && filterStackDataArray.push(refineContentData);

                // Do not render refine bellow section if there
                // is no filters or categories.
                if (!filterStackDataArray.length) {
                    return;
                }

                var filterStackData = {
                    filterStackItems: filterStackDataArray
                };


                // Html for refine filter-stack Body
                filterStackTemplate(filterStackData, function(err, html) {
                    $refineContent = $(html);
                });

                var $sliNarrowHeading = $filterContainer.find('.sli_narrow');

                if ($sliNarrowHeading.length) {
                    $sliNarrowHeading.html($sliNarrowHeading.html().replace(':', ''));
                }

                return {
                    items: {
                        sectionTitle: $filterContainer.find('.sli_narrow'),
                        refineContent: $refineContent
                    }
                };
            },
            isRelatedProductsSectionPresent: function() {
                return $('#br_related_products').text().trim().length > 0 ? true : false;
            },
            relatedProductsSection: function() {
                return relatedProductsParser.parse($('#br_related_products'));
            },
            isRelatedSearchesPresent: function() {
                return $('#br-related-searches-widget').length ? true : false;
            },
            relatedSearches: function() {
                var searchData = [];
                $('.br-related-query').map(function(i, suggestion) {
                    return searchData.push($(suggestion).find('.br-related-query-link'));
                });
                return {
                    relatedSearchHeader: $('.br-related-heading').text(),
                    suggestions: searchData
                };
            },
            sortByPlpTwo: function() {
                return $('.sortBy').find('select');
            },

            pagination: function(context) {
                return $('#sli_pagination_header').addClass('u-visually-hidden');
            },
            requiredScripts: function() {
                return $('#mainContent').find('script');
            },
            paypalImg: function() {
                return $('#paypalNowAcceptingFooter img').attr('x-src');
            }

        }
    };
});
