define([
    '$',
    'translator',
    'global/baseView',
    'dust!pages/product-details/product-details',
    'global/parsers/breadcrumb-parser',
],
function($, Translator, BaseView, template, Breadcrumb) {

    var getFormFields = function($container) {
        var $sizeChart = $container.find('.mSizeChart');
        $sizeChart.addClass('ref2QISwatch');
        $sizeChart.find('a').text('Size Chart');
        $('.fit_tip').addClass('c-fit-tip');
        return $container.find('.prod_select_con').map(function(_, item) {
            var $item = $(item);
            return {
                heading: $item.find('.prod_select_title'),
                selected: $item.find('.prod_select_title2'),
                choices: $item.find('.prodSelectRefCon:not(.prodSelectRefCon2)')
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
            hiddenContainer: function() {
                return $('.prodLeftCon, .prodRightCon2');
            },
            productTabs: function() {
                var _items = [];
                _items.push({
                    sectionTitle: $('#grp_3Tab').text(),
                    content: $('#grp_3').addClass('c-video-tab')
                });
                _items.push({
                    sectionTitle: $('#grp_1Tab').text(),
                    content: $('#grp_1')
                });
                _items.push({
                    sectionTitle: $('#grp_2Tab').text(),
                    content: $('#grp_2'),
                    bellowsItemClass: 'c-reviews-bellow'
                });
                _items.push({
                    sectionTitle: $('#grp_4Tab').text(),
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
            youMayLikeSection: function() {
                return $('#pdetails_suggestions');
            }
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
