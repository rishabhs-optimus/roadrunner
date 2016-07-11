/**
 * Category Landing View
 */

define([
    '$',
    'global/baseView',
    'translator',
    'dust!pages/category-landing-2/category-landing',
    'components/breadcrumb/parsers/breadcrumb',
    'components/carousel/parsers/carousel',
    'components/pagination/parsers/clp-pagination'
],
function($, baseView, Translator, template, BreadcrumbParser, RelatedProductsParser, PaginationParser) {
    return {
        template: template,
        extend: baseView,
        context: {
            templateName: 'category-landing-2',
            breadcrumbLink: function() {
                return BreadcrumbParser.parse($('#breadcrumbs'));
            },
            isBreadCrumbPresent: function() {
                return $('#breadcrumbs').find('li').length > 2 ? true : false;
            },
            categoryHeader: function() {
                return $('#categoryHeader').addClass('c-category-header u-padding-top u-padding-bottom');
            },
            categoryItemsContainer: function() {
                return $('#gwt_products_display');
            },
            filters: function() {
                var $filterForm = $('#changepageSizeForm');
                var $sortBy = $filterForm.find('#sortBy');
                var sortByText = $filterForm.find('#sortBy option:first').text();
                $sortBy.find('option[value="NA"]').text(Translator.translate('default'));
                return {
                    filterFormHiddenFields: $filterForm.find('input[type="hidden"]'),
                    filterFormSortyBy: $sortBy,
                    filterFormSortyByLabel: sortByText
                };
            },
            filterForm: function() {
                return $('#changepageSizeForm');
            },
            topItemsPerPage: function(context) {
                return context.filterForm.find('#topItemsPerPage');
            },
            bottomItemsPerPage: function(context) {
                return context.filterForm.find('#bottomItemsPerPage');
            },
            enableViewLess: function(context) {
                return Number(context.filterForm.find('#topItemsPerPage').val()) === 0 ? true : false;
            },
            pagination: function(context) {
                return PaginationParser.parse(context.filterForm.find('#topPaginationList'));
            },
            isPaginationPresent: function(context) {
                return context.filterForm.find('#topPaginationList li');
            },
            isRelatedProductsSectionPresent: function() {
                return $('#br_related_products').text().trim().length > 0 ? true : false;
            },
            relatedProductsSection: function() {
                return RelatedProductsParser.parse($('#br_related_products'));
            },
            paypalImg: function() {
                return $('#paypalNowAcceptingFooter img').attr('x-src');
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
            userState: function() {
                return $('#gwt_user_state');
            },
            hiddenInputs: function() {
                return $('#container > input[type="hidden"]');
            }
        }
    };
});
