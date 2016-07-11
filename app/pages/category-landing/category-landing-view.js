/**
 * Category Landing View
 */

define([
    '$',
    'global/baseView',
    'dust!pages/category-landing/category-landing',
    'components/breadcrumb/parsers/breadcrumb',
    'components/carousel/parsers/carousel',
],
function($, baseView, template, breadcrumbParser, relatedProductsParser) {
    return {
        template: template,
        extend: baseView,
        context: {
            templateName: 'category-landing',
            categoryHeader: function() {
                return $('#breadcrumbs_ul > .current').text();
            },
            categoryProduct: function() {
                return $('#gwt_subcategories_dp').removeAttr('style');
            },
            paypalImg: function() {
                return $('#paypalNowAcceptingFooter img').attr('x-src');
            },
            breadcrumbLink: function() {
                return breadcrumbParser.parse($('#breadcrumbs'));
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
            description: function() {
                return  {body: $('#textfooter').find('p')};
            }
        }
    };
});
