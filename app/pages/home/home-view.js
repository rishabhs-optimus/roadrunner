/**
 * Home View
 */

define([
    '$',
    'global/baseView',
    'dust!pages/home/home',
    'dust!components/promo-block/promo-block',
    'dust!components/promo-stack/promo-stack',
    'dust!components/promo-scroller/promo-scroller',
    'global/parsers/promo-block-parser',
    'global/parsers/promo-stack-parser',
    'global/parsers/promo-scroller-parser'
],
function(
    $,
    baseView,
    template,
    promoBlockTemplate,
    promoStackTemplate,
    promoScrollerTemplate,
    promoBlockParser,
    promoStackParser,
    promoScrollerParser
) {
    return {
        template: template,
        extend: baseView,
        context: {
            templateName: 'home',

            allPromos: function() {
                var $promos = $('[class*=promo]');

                return $promos.map(function(_, promo) {
                    var $promo = $(promo);
                    var promoType;
                    var content;

                    // TODO: when adding more promos, map types without if statements

                    if ($promo.is('.promo-block')) {
                        promoType = 'promo-block';
                        content = promoBlockParser.parse($promo);
                    } else if ($promo.is('.promo-stack')) {
                        promoType = 'promo-stack';
                        content = promoStackParser.parse($promo);
                    } else if ($promo.is('.promo-scroller')) {
                        promoType = 'promo-scroller';
                        content = promoScrollerParser.parse($promo);
                    }

                    return {
                        promoType: promoType,
                        content: content
                    };
                });
            }
        }

        /**
         * If you wish to override preProcess/postProcess in this view, have a
         * look at the documentation:
         *
         * http://adaptivejs.mobify.com/v1.0/docs/views
         */
    };
});
