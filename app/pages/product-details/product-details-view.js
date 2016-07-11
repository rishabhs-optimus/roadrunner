define([
    '$',
    'translator',
    'global/baseView',
    'dust!pages/product-details/product-details',
    'global/parsers/breadcrumb-parser',
],
function($, Translator, BaseView, template, Breadcrumb) {

    return {
        template: template,
        extend: BaseView,
        context: {
            templateName: 'product-details',
            breadcrumbs: function(context) {
                return {
                    breadcrumbLink: Breadcrumb.parseTranslated(context.hiddenData.container.find('#breadcrumbs_ul'))
                };
            },
            productTitle: function() {
                return $('.prod_title h1').text();
            },
            productItemId: function() {
                return $('.prod_itemid').text();
            },
            priceSection: function() {
                return $('.prod_select_title3');
            },
            colorHeading: function() {
                return $('.prod_select_title').first().text();
            },
            colorChoices: function() {
                return $('#ref2QIColorCont');
            },
            productSize: function() {
                return $('#selSizeTitle').text();
            },
            productTabs: function() {
                debugger;
                var _items = [];
                _items.push({
                sectionTitle: $('#grp_1Tab'),
                content: $('#grp_1')
                });

                // _items.push({
                // sectionTitle: $('<div class="c-review-head js-review-head">Product Reviews</div>'),
                // bellowsItemClass: 'js-reviews-bellows c-reviews-bellows'
                // });

                var _bellows = {
                class: 'js-product-bellows',
                items: _items
                };

                return {
                bellows: _bellows
                };

            },
            // magnifikImage: functi on(context) {
            //     var $container;
            //     new LoadingTemplate(true, function(err, html) {
            //         $container = $(html);
            //     });
            //     return {
            //         bodyContent: $($container[0].outerHTML + '<img class="js-magnifik-image c-magnifik-image" src=""/>')
            //     };
            // }
        }
    };
});
