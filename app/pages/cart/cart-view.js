define([
    '$',
    'global/baseView',
    // 'dust!pages/cart/cart',
    // 'translator',
    // 'global/parsers/cart-order-summary-parser',
    // 'global/parsers/recently-viewed-parser',
    // 'global/parsers/cart-item-parser',
    // 'global/parsers/related-products',
    // 'pages/cart/parsers/empty-cart',
    // 'pages/cart/parsers/cart-breadcrumb',
    // 'pages/cart/parsers/cart-keycode'

],
function($, BaseView, template, translator, orderSummaryParser, recentlyViewedParser, cartItemParser, relatedProductsParser, emptyCartParser, cartBreadcrumb, keycodeParser) {

    return {
        // template: template,
        // extend: BaseView,
        // context: {
        //     templateName: 'cart',
        //     pageTitle: function() {
        //         return $('#mainContent').children('h1').attr('title');
        //     },
        //     inputs: function() {
        //         return $('#container').children('input[type="hidden"]');
        //     },
        //     requiredLabels: function() {
        //         return $('#gwt_order_item_uber_disp_strings');
        //     },
        //     qtyForm: function() {
        //         return $('#ItemQuantityUpdateForm');
        //     },
        //     promoCodeForm: function() {
        //         return $('#PromotionCodeForm');
        //     },
        //     estimateShippingForm: function() {
        //         return $('#EstimateShippingForm');
        //     },
        //     giftFlagForm: function() {
        //         return $('#ItemGiftFlagUpdateForm');
        //     },
        //     cartForm: function() {
        //         return $('#ShopCartForm');
        //     },
        //     isCartEmpty: function() {
        //         return $('#cartEmpty');
        //     },
        //     emptyCart: function(context) {
        //         return $('#cartEmpty').length ? emptyCartParser.parse($('#mainContent')) : null;
        //     },
        //     analyticsData: function(context) {
        //         return context.cartForm.find('#analyticsDataShop5');
        //     },
        //     hiddenInputs: function(context) {
        //         return context.cartForm.find('input[type="hidden"]');
        //     },
        //     cartItems: function(context) {
        //         return cartItemParser.parse(context.cartForm.find('.itemline'));
        //     },
        //     cartCount: function(context) {
        //         return context.cartItems.length;
        //     },
        //     ctas: function(context) {
        //         var $checkoutButton = context.cartForm.find('.button.primary:not(.checkout-with-paypal-button)');
        //         var $checkoutPaypal = context.cartForm.find('.checkout-with-paypal-button');
        //         var $contShoppingButton = context.cartForm.find('.button.secondary');
        //
        //         $checkoutButton.addClass('c-button c--primary c--full-width u-margin-bottom-sm');
        //         $contShoppingButton.addClass('c-button c-continue-shopping c--full-width c--secondary');
        //
        //         $checkoutButton.find('span');
        //         $contShoppingButton.find('span').html(translator.translate('continue_shopping_cart'));
        //         return {
        //             checkoutButton: $checkoutButton,
        //             checkoutPaypal: $checkoutPaypal,
        //             continueShoppingButton: $contShoppingButton
        //         };
        //     },
        //     totals: function(context) {
        //         var $totalsContainer = context.cartForm.find('.totals');
        //         var $grandTotal =  $totalsContainer.find('.totalPrice').remove();
        //         return orderSummaryParser.parse($totalsContainer.find('table'), $grandTotal, context.cartForm.find('.promoCode'));
        //     },
        //     relatedProducts: function() {
        //         return relatedProductsParser.parse($('#br_related_products'));
        //     },
        //     mayAlsoLike: function() {
        //         return $('#gwt_recommendations_cart_1');
        //     },
        //     recentlyViewedProducts: function() {
        //         return recentlyViewedParser.parse($('#gwt_recently_viewed'), $('#gwt_international_conversion_rate'), $('#gwt_international_currency_indicator'));
        //     },
        //     errorMessages: function() {
        //         return $('#gwt-error-placement-div');
        //     },
        //     cartItemBreadcrumb: function() {
        //         return !$('#cartEmpty').length ? cartBreadcrumb.parse($('#mainContent')) : null;
        //     },
        //     freeGiftLabels: function() {
        //         return $('#gwt_free_gift_labels');
        //     },
        //     freeGiftWithPurchase: function() {
        //         return $('#gwt_free_gifts_with_purchase');
        //     },
        //     freeSubsriptionLabels: function() {
        //         return $('#gwt_free_subscription_labels');
        //     }
        // }

    };
});
