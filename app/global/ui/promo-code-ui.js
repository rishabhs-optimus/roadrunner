define([
    '$'
], function($) {

    var _updatePromoContainer = function() {
        var $promoContainer = $('.js-promo-container');
        var $appliedContainer = $('.js-applied-promo');
        var $promoEditButton = $promoContainer.find('.edit-promo-link').addClass('u--bold u-text-capitalize');

        // Add edit button
        if ($appliedContainer.length) {
            $appliedContainer.find('.c-ledger__description').append($promoEditButton);
        }
    };


    var _overrideDesktop = function() {
        var _editOnClick = window.editOnClick;
        window.editOnClick = function() {
            _editOnClick.apply(this, arguments);
            $('.js-promo-container').removeAttr('hidden');
        };

        var _changeZipCode = window.showZipCodeForm;

        window.showZipCodeForm = function() {
            _editOnClick.apply(this, arguments);
            $('.js-shipping-container').removeAttr('hidden');
        };
    };

    var _init = function() {
        // _updatePromoContainer();
        _overrideDesktop();
    };

    return {
        init: _init
    };
});
