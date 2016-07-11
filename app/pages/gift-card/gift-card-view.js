define([
    '$',
    'global/baseView',
    'dust!pages/gift-card/gift-card',
    'global/includes/top-nav/top-nav-context',
],
function($, BaseView, template, topNav) {
    return {
        template: template,
        extend: BaseView,
        includes: {
            topNav: topNav
        },

        context: {
            templateName: 'gift-card',
            pageTitle: function() {
                return 'Gift Cards';
            },
            contents: function() {
                var $giftContentsImages = $('.genericESpot').has('table').find('a').has('img');

                $giftContentsImages.last().addClass('t-gift-card__last-small-img');

                return $giftContentsImages;
            }
        }

        /**
         * If you wish to override preProcess/postProcess in this view, have a look at the documentation:
         * http://adaptivejs.mobify.com/v1.0/docs/views
         */
    };
});
