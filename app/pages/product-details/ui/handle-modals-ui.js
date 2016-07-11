define([
    '$',
    'translator',
    // Utils
    'global/utils/ajax-reader',
    'pages/product-details/ui/wishlist-ui',
    'pages/product-details/ui/size-chart-ui',
    'pages/product-details/ui/sign-in-ui',
    'pages/product-details/ui/ask-a-specialist-ui',
    'pages/product-details/ui/personalization-delete-ui',
    'pages/product-details/ui/add-to-cart-ui',
    'pages/product-details/ui/pdp-helpers-ui',
    'pages/product-details/ui/more-information-ui',
    'pages/product-details-bundle/ui/product-detail-widget-ui',

], function($, Translator,
    AjaxReaderParser,
    wishlistUI, sizeChartUI, signInUI, askSpecialistUI, deletePersonalizationModalUI, addToCartUI,
    HelpersUI, moreInformationUI, productDetailWidgetUI) {

    var onSuccessMoreInfo = function(data) {
        moreInformationUI.parse(data);
    };

    var onErrorMoreInfo = function(data) {
        // Handler for error case
    };

    // Override more information links to display pinny instead of new tab popup
    var overrideMoreInfoPopups = function() {
        var _open = window.open;
        // TODO: Need to check if this is required in travelSmith.
        window.open = function(url) {
            AjaxReaderParser.parse(url, onSuccessMoreInfo, onErrorMoreInfo);
            var open = _open.apply(this, arguments);
            return open;
        };
    };

    var triggerModal = function() {
        if (event.animationName === 'modalAdded') {
            var $popupPanel = $('.gwt-PopupPanelGlass');
            var $askSpecialistModal = $('#gwt-site-feedback-modal');
            var $addWishlistModal = $('#gwt-add-to-gift-registry-modal');
            var $newWishlistModal = $('#gwt-wishlist-create-modal');
            var $signInModal = $('#gwt-sign-in-modal');
            var $forgotPasswordModal = $('#passwordReset');
            var $addedToWishlistModal = $('.gwt-added-to-wish-list-modal');
            var $addToCartModal = $('.gwt_addtocart_div');
            var $deletePersonalizationModal = $('.ok-cancel-dlog');

            if ($askSpecialistModal.length) {
                askSpecialistUI.showAskSpecialistModal($askSpecialistModal);
            } else if ($addWishlistModal.length && !$addWishlistModal.children('.c-sheet').length) {
                wishlistUI.showAddToWishlistModal($addWishlistModal);
            } else if ($newWishlistModal.length) {
                wishlistUI.showNewWishlistModal($newWishlistModal);
            } else if ($signInModal.length) {
                signInUI.showSignInModal($signInModal);
            } else if ($forgotPasswordModal.length) {
                signInUI.showForgotPasswordModal($forgotPasswordModal);
            }  else if ($addToCartModal.length) {
                addToCartUI.initAddToCartSheet();
            } else if ($addedToWishlistModal.length && !$('.js-notification-pinny').parent().hasClass('pinny--is-open')) {
                wishlistUI.triggerWishlistNotification($addedToWishlistModal);
            } else if ($deletePersonalizationModal.length) {
                // Handle Delete Modal
                deletePersonalizationModalUI.showSignInModal($deletePersonalizationModal);
            }
        }
    };

    var animationListener = function() {
        if (event.animationName === 'moreInformationPopup') {
            var src = jQuery('#colorbox').find('iframe').attr('src');
            AjaxReaderParser.parse(src, onSuccessMoreInfo, onErrorMoreInfo);
        }
    };

    var bindAnimationListener = function() {
        // Add event listeners for an welcome panel being added.
        document.addEventListener('animationStart', animationListener);
        document.addEventListener('webkitAnimationStart', animationListener);
    };

    var initSheets = function() {
        wishlistUI.initSheet();
        sizeChartUI.initSheet();
        signInUI.initSheet();
        askSpecialistUI.initSheet();
        deletePersonalizationModalUI.initSheet();
        productDetailWidgetUI.initSheet();
        // overrideMoreInfoPopups();
        bindAnimationListener();

        document.addEventListener('animationStart', triggerModal);
        document.addEventListener('webkitAnimationStart', triggerModal);

    };

    return {
        initSheets: initSheets
    };
});
