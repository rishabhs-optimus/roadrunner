define([
    '$',
    'components/sheet/sheet-ui',
    'translator'
], function($, sheet, translator) {


    var $signInPinny = $('.js-delete-personalization-pinny');

    var _appendRow = function($container, $label, $input, isCheckbox, $additionalLink) {
        var $row = $('<div class="c-field c-box c-arrange c--align-middle">');
        $input.attr('placeholder', $label.text().replace('*', '').trim());
        if (isCheckbox) {
            // Reverse the order
            $row.append($input);
            $row.append($label.addClass('c-field__label u-padding-top u-padding-bottom u--tight'));
        } else {
            $row.append($label.addClass('c-field__label u-medium-width u-padding-left-extra-tight'));
            $row.append($input);
        }

        if ($additionalLink && $additionalLink.length) {
            $label.wrap('<div class="c-field__top">');
            $label.after($additionalLink.addClass('c-field__info'));
        }

        $container.append($('<div class="c-box-row c-sign-in-pop-up-fields">').append($row));
    };

    var _bindModalEvents = function() {
        $('.js-sign-in, .js-reset-pw').on('click', function(e) {
            $('.js-sign-in-pinny__body').find('.errortxt').parent().addClass('c--error');
        });
        $('.js-close-modal, .js-reset-pw').on('click', function(e) {
            $('.pinny__close').trigger('click');
        });
    };

    var _transformSignInModal = function($content) {
        var $mainTable = $content.find('table .form');
        $content.find('tr').map( function(_, item) {
            var $item = $(item);
            if (!$item.find('td').text().length && !$item.find('td').children().children().length) {
                $item.addClass('u-visually-hidden');
            }
        });
        var $primaryButton = $mainTable.find('.button.primary');
        var $secondaryButton = $mainTable.find('.button.secondary');
        $content.find('.button.primary').addClass('c-button c--primary c--full-width u-margin-top-md js-reset-pw');
        $content.find('button.secondary').addClass('c-button c--secondary c--full-width u-margin-top-md js-close-modal');

        if (!$content.find('.button.primary').text().trim() &&
            !$content.find('button.secondary').text().trim()) {
            $content.find('.button.primary').closest('tr').addClass('u-visually-hidden');
        }
    };

    var _transformForgotPWModal = function($content) {
        var $emailRow = $('<div class="c-field">');
        var $emailLabel = $content.find('#emailBoxLabel');
        var $introNote = $emailLabel.prev();

        $emailLabel.addClass('c-field__label');
        $emailRow.append($emailLabel.add($content.find('#emailbox')));
        $introNote.after($('<div class="c-field__row">').append($emailRow));

        $content.find('.c-field__row').addClass('u-margin-top-md');
        $content.find('.c-field__row').next().addClass('c-field__caption');

        // transform Buttons
        $content.find('.button.primary').addClass('c-button c--primary c--full-width u-margin-top-md js-reset-pw');
        $content.find('button.secondary').addClass('u-visually-hidden js-close-modal');
    };

    var _showSignInModal = function($signInModal) {
        var $popupPanel = $('.ok-cancel-dlog');

        $popupPanel.hide();

        var title = $signInModal.find('.Caption').text();
        var $content = $signInModal.find('.dialogMiddle');

        _transformSignInModal($content);
        _bindModalEvents();

        $signInPinny.find('.c-sheet__title').html(title);
        $signInPinny.find('.js-delete-personalization-pinny__body').html($content);
        $signInPinny.pinny('open');
    };


    var _onSheetClose = function() {
        var $lockup = $('.lockup__container');
        // Remove the loader and revert back to the original btn text.

        if ($signInPinny.hasClass('js--forgot-pw')) {
            $signInPinny.removeClass('js--forgot-pw');
            // Click cancel button
            $signInPinny.find('.js-close-modal span').click();
            // Reset pinny markup.
            $signInPinny.parent().appendTo($lockup);
            $('.js-sign-in-shade').appendTo($lockup);
        }
    };

    var _initSheet = function() {
        sheet.init($signInPinny, {
            shade: {
                cssClass: 'js-sign-in-shade',
                opacity: '0.8'
            },
            close: _onSheetClose
        });
    };

    return {
        initSheet: _initSheet,
        showSignInModal: _showSignInModal
    };
});
