/**
 * Category Landing View
 */

define([
    '$',
    'translator',
    'global/baseView',
    'dust!pages/plp-br-seo/plp-br-seo',
    'pages/plp-br-seo/parsers/plp-br-seo__product-tile-parser'
],
function($, Translator, baseView, template, productTileParser) {
    return {
        template: template,
        extend: baseView,
        context: {
            templateName: 'plp-br-seo',
            heading: function() {
                return $('.sli_browse_head').text();
            },
            products: function() {
                return productTileParser.parse($('#sli_resultsSection_wrapper'));
            }
        }
    };
});
