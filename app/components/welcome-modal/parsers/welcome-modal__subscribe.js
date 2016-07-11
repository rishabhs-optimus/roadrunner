define(['$'], function($) {
    var _parse = function($welcomePanel) {

        // Remove default styling of elements.
        $welcomePanel.removeAttr('style');
        $welcomePanel.find('[style]').removeAttr('style');

        // Wrap inner content in div for styling purposes.
        $welcomePanel.wrapInner('<div class="c-welcome-subscribe" />');

        // Added different classes for styling purposes.
        $welcomePanel.addClass('pinny c-sheet c--dialog');
        $welcomePanel.find('.c-welcome-subscribe').addClass('pinny__wrapper');

        $welcomePanel.find('h1').addClass('c-heading c--2 u-margin-bottom-sm');
        $welcomePanel.find('h2').addClass('c-heading c--5 u-margin-bottom-md');

        $welcomePanel.find('.gwt_welcome_window_close').addClass('c-sheet__header-close')
            .html('<svg class="c-icon c--large" title="Closes"><title>Close</title><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-close"></use></svg>');
        $welcomePanel.find('button')
            .addClass('c-button c--full-width c--primary u-margin-top-md')
            .append('<svg class="c-icon" data-fallback="img/png/arrow-right.png"><title>arrow-right</title><use xlink:href="#icon-arrow-right"></use></svg>');

        $welcomePanel.find('.gwt_content_spot_2').addClass('u-text-custom');
        $welcomePanel.find('.gwt_confirmation_div').hide();
    };

    return {
        parse: _parse
    };
});
