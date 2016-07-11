define([
    '$'
], function($) {

    var parse = function($container) {

        var keycodeContainer = $container.find('.promoCode');

        return {
            keyCodeTag: function() {
                return keycodeContainer.find('#showPromoCodeInfo');
            },
            keyCodeLabel: function() {
                return keycodeContainer.find('#showPromoCodeInfo').text();
            },
            showPromoCodeInfoPopup: function() {
                return keycodeContainer.find('#showPromoCodeInfoPopup');
            },
            promoCode: function() {
                return keycodeContainer.find('#promoCode');
            },
            promoButton: function() {
                return keycodeContainer.find('#promoButton');
            },
            emptyPromoCodeError: function() {
                return keycodeContainer.find('#empty-error-message');
            },
            invalidPromoCodeError: function() {
                return keycodeContainer.find('#not-valid-error-message');
            },
            keycodeNote: function() {
                return keycodeContainer.find('.note').text();
            }

        };
    };

    return {
        parse: parse
    };
});
