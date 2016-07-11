define([
    '$',
    'pinny',
    'global/ui/cart-item-ui',
    'components/sheet/sheet-ui',
    'global/ui/tooltip-ui',
    'global/ui/carousel-ui'
],
function($, pinny, cartItemUI, sheet, tooltipUI, carouselUI) {

    var _initPlugins = function() {
        var $shippingPinny = $('.js-shipping-details-pinny');
        sheet.init($shippingPinny);
        $('.js-pinny-button').on('click', function() {
            var dataTarget = $(this).attr('data-target');
            $(dataTarget).pinny('open');
        });
    };

    var confirmationDetailsUI = function() {
        cartItemUI();
        tooltipUI();
        carouselUI.init($('#gwt_recommendations_order_confirmation_display_1'));
        _initPlugins();
    };

    return confirmationDetailsUI;
});
