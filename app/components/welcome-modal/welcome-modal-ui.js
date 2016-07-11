define([
    '$',
    'components/sheet/sheet-ui',
    'modal-center',
    'components/welcome-modal/parsers/welcome-modal__subscribe',
    'components/welcome-modal/parsers/welcome-modal__shipping-to',
    'dust!components/welcome-modal/partials/welcome-modal__shipping-to'
], function($, sheet, modalCenter, welcomeModalParser,
        shippingToParser, shippingToTemplate) {

    var welcomeMatTransform = function($el, parser, Template) {
        var $welcomeSheetEl = $('.js-welcome-panel');
        var $welcomePanel = $el;
        var templateData = parser.parse($welcomePanel);

        $welcomePanel.remove();

        var welcomeSheet = sheet.init($welcomeSheetEl, {
            effect: modalCenter,
        });

        if ($el.is('#modal')) {
            welcomeSheet.setTitle('<svg class="c-icon c-frontgate-logo" data-fallback="img/png/FG-logo.png"><title>FG-logo</title><use xlink:href="#icon-FG-logo"></use></svg>');
        } else {
            $('.c-welcome-panel').find('.pinny__header').hide();
        }

        new Template(templateData, function(err, html) {
            welcomeSheet.setBody(html);

            welcomeSheet.open();
        });

    };

    var animationListener = function() {
        if (event.animationName === 'welcomeMatAdded') {
            var $welcomePanel = $('#gwt_welcome_window');
            welcomeModalParser.parse($welcomePanel);
        } else if (event.animationName === 'shippingToPopup') {
            var $shippingTo = $('#tinycontent').find('#modal');
            welcomeMatTransform($shippingTo, shippingToParser, shippingToTemplate);
        }
    };


    var welcomePopup = function() {
        // Add event listeners for an welcome panel being added.
        document.addEventListener('animationStart', animationListener);
        document.addEventListener('webkitAnimationStart', animationListener);
    };

    return {
        init: welcomePopup
    };
});
