define([
    '$',
    'global/baseView',
    'dust!pages/product-details/product-details'
],
function($, BaseView, template) {


    var getProductSwatches = function($container) {
        return $container.find('.prod_select_con').map(function(_, item) {
            var $item = $(item);
            $item.find('.mSizeChart').find('a').text('Size Chart');
            $item.find('.prod_select_title, .prod_select_title2').wrapAll('<div class="c-swatches-heading" />');
            return {
                label: $(item).find('.prodSelectRefCon2').find('.c-swatches-heading'),
                swatches: $item.find('.prodSelectRefCon:not(.prodSelectRefCon2)')
            };
        });
    };

    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'product-details',
            productTitle: function() {
                return $('.prod_title h1').text();
            },
            productId: function() {
                return $('.prod_itemid').text();
            },
            priceSection: function() {
                return $('.prod_select_title3');
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
            steps: function() {
                var $form = $('#addToCartForm');
                return {
                    form: $form,
                    hiddenData: $form.find('#addToCartAttributes'),
                    swatchesContainer: getProductSwatches($form),
                    addToCart: $form.find('.addToCartCon')
                };
            },
            imageSection: function() {
                return $('#scene7DHTMLViewerFlyout').parent();
            },
            price: function() {
                return $('#ref2QIPriceTitleS');
            },
            overViewHidden: function() {
                return $('.prodOverview1, .prodOverview2');
            },
            addToCartDiv: function() {
                return $('#addToCartInfo');
            },
            cartSummary: function() {
                return $('#shoppingCartSummaryNew');
            },
            youMayLikeSection: function() {
                return $('#pdetails_suggestions');
            },
            overallRating: function() {
                var $rating = $('.pr-snippet');
                $rating.find('.pr-snippet-link').text('Read reviews');
                $rating.find('.pr-snippet-write-review').addClass('u-visually-hidden');
                return $rating;
            }
        }

        /**
         * If you wish to override preProcess/postProcess in this view, have a look at the documentation:
         * http://adaptivejs.mobify.com/v1.0/docs/views
         */
    };
});
