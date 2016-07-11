define([
    '$',
    'components/sheet/sheet-ui',
    'sheet-bottom',
    'global/utils',
    'translator',
    'hijax'
], function($, sheet, sheetBottom, Utils, Translator, Hijax) {

    var checkErrors = function() {
        var $errorContainer = $('.js-error-container');
        if ($errorContainer.children().length) {
            Adaptive.notification.triggerError($errorContainer);
        }
    };

    var passwordTransform = function($el) {
        var $passwordSheetEl = $('.js-forgot-password-panel');
        var $passwordPanel = $el;
        var passwordSheet = sheet.init($passwordSheetEl, {
            effect: sheetBottom,
            open: function() {
                $('.js-forgot-password-panel').parent().addClass('c-forgot-password-pinny c-full-size-pinny');
            },
            shade: {
                opacity: 0.9,
                color: '#fff'
            }
        });
        passwordSheet.setBody($el);
        passwordSheet.open();
    };

    var overrideForgotPassword = function() {
        $('#forgotpw').one('click', function() {
            var desktopShowForgotPasswordModal = window.showForgotPasswordModal;
            window.showForgotPasswordModal = function() {
                desktopShowForgotPasswordModal.apply(this, arguments);

                var $passwordModal = $('#passwordReset');
                var $header = $('<div class="c-sheet__header pinny__header">');
                var $closeButton = $passwordModal.find('.button.secondary');

                $passwordModal.removeAttr('style');

                $closeButton.addClass('c-sheet__header-close needsclick pinny__close js-forgot-pinny__close');
                $closeButton.find('span').html('<svg class="c-icon" title="delete"><title>delete</title><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-delete"></use></svg>');
                $passwordModal.addClass('c-password-reset-pinny c-sheet');
                $header.append('<div class="c-sheet__title">' + Translator.translate('forgot_password') + '</div>');
                $header.append($closeButton);

                // $closeButton.clone().insertAfter($passwordModal.find('.button.primary'));
                // $passwordModal.find('input').wrap('<div class="c-input c-arrange__item">')
                // .parent().prepend('<label class="c-input-label">Email<span class="u-text-error">*</span></label>');
                $passwordModal.find('#emailbox').attr('type', 'email');
                $passwordModal.find('.c-input').prev().addClass('c-box__label c-arrange__item c--shrink');
                $passwordModal.find('.c-input').prev().text(Utils.updateFormLabels($passwordModal.find('#emailBoxLabel').text()));
                $passwordModal.find('.c-input').next().remove();
                $passwordModal.find('#emailBoxLabel, .c-input').wrapAll('<div class="c-form-group"><div class="c-box-row"><div class="c-box c-arrange c--align-middle u-margin-top-lg u-margin-bottom-md"></div></div></div>');
                $passwordModal.find('input').attr('placeholder', $passwordModal.find('.note:contains(Example)').text());
                $passwordModal.find('.note:contains(Example)').remove();
                $passwordModal.find('.button.primary').addClass('c-button c--primary c--full-width u-margin-top-lg');
                $passwordModal.find('.dialogBottom').remove();

                $passwordModal.find('.note:contains(reset and sent)').addClass('note-header').text();
                $passwordModal.find('.note:contains(further assistance)').addClass('note-footer ');
                var $footerNote = $passwordModal.find('.note:contains(further assistance)');
                var $telephone = $footerNote.text().split(':');
                $passwordModal.find('.button').parent().after('<div class="u-margin-top-extra-lg note-footer">' + $telephone[0] + '</div>');
                $passwordModal.find('.note:contains(further assistance)').remove();
                var $callButton = '<a href="tel:' + $telephone[1] + '"><button class="c-button c--secondary c--full-width u-margin-top-12 "> ' + $telephone[1] + '</button></a>';

                $passwordModal.find('.note-footer').after($callButton);
                $passwordModal.html($passwordModal.find('.gwt-submit-cancel-dialog-content-panel'));
                $passwordModal.find('.gwt-submit-cancel-dialog-content-panel').wrap('<div class="c-inner-wrapper" />');
                $passwordModal.find('.c-inner-wrapper').prepend($header);

                $passwordModal.find('.c-input').prev().wrapInner('<label />');
                passwordTransform($passwordModal);
                $passwordModal.find('#emailBoxLabel').addClass('u--bold u-text-capitalize');
            };
        });
    };

    var transformForgotSuccess = function($container) {

        $container.find('.gwt-submit-cancel-dialog-button-panel').find('button').addClass('c-forgot-pinny-close').show().prop('disabled', false);
        $container.find('.gwt-submit-cancel-dialog-button-panel').find('button span').addClass('pinny__close');

        $container.find('.note-footer').html($container.find('.gwt-HTML p:last'));
    };

    var initHijaxProxies = function() {

        var hijax = new Hijax();

        hijax.set(
            'forgot-password-success',
            function(url) {
                return url.indexOf('ForgotPasswordInitiate') >= 0;
            },
            {
                complete: function(data, xhr) {
                    if (data.success === 'true') {
                        var $passwordReset = $('#passwordReset');
                        $passwordReset.removeAttr('style');
                        transformForgotSuccess($passwordReset);
                    }
                }
            }
        );
    };


    var tooltipUI = function() {
        overrideForgotPassword();
        checkErrors();
        initHijaxProxies();
    };

    return tooltipUI;
});
