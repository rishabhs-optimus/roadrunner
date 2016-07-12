define([
    '$',
    'translator',
    'global/baseView',
    'dust!pages/product-details/product-details',
    'global/parsers/breadcrumb-parser',
],
function($, Translator, BaseView, template, Breadcrumb) {

    var getFormFields = function($container) {
        return $container.find('.prod_select_con').map(function(_, item) {
            var $item = $(item);
            return {
                heading: $item.find('.prod_select_title').text(),
                selected: $item.find('.prod_select_title2').text(),
                choices: $item.find('.prodSelectRefCon')
            };
        });
    };

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
            addToCartForm: function() {
                var $addToCartForm = $('#addToCartForm');
                return {
                    form: $addToCartForm,
                    hiddenFields: $addToCartForm.find('[type="hidden"]'),
                    swatches: getFormFields($addToCartForm)
                };
            },
            productTabs: function() {
                var _items = [];
                // $('#product_desc_tabs').children().map(function(i, item) {
                //     var index = i + 1;
                //     var titleContainer = '#grp_' + index + 'Tab';
                //     var contentContainer = '#grp_' + index;
                //     var $content = $(contentContainer).removeAttr('style');
                //     _items.push({
                //         sectionTitle: $(titleContainer).removeAttr('style'),
                //         content: $('<div>').append($content.html())
                //     });
                // });

                _items.push({
                    sectionTitle: $('#grp_3Tab'),
                    content: $('#grp_3')
                });
                _items.push({
                    sectionTitle: $('#grp_1Tab'),
                    content: $('#grp_1')
                });
                _items.push({
                    sectionTitle: $('#grp_2Tab'),
                    content: $('#grp_2')
                });
                _items.push({
                    sectionTitle: $('#grp_4Tab'),
                    content: $('#grp_4')
                });


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
