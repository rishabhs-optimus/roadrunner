define([
    '$',
    'sheet-top',
    'translator',
    'dust!components/notification/partials/error-item',
    'dust!components/notification/partials/success-item',
    'pinny'
],
function($, sheetTop, translator, ErrorItemTemplate, SuccessItemTemplate) {

    var $notificationPinny = $('.js-notification-pinny');
    var $notificationPreview = $notificationPinny.find('.js-notification-preview');
    var $notificationPreviewContent = $notificationPreview.find('.js-notification');
    var $fullNotification = $notificationPinny.find('.js-full-notification');
    var $fullNotificationContent = $fullNotification.find('.js-notification');
    // var $errorIcon = $fullNotification.find('.js-error-icon');

    var resetPinny = function() {
        $fullNotification.children().removeClass('c--active');
    };

    var unlockPage = function() {
        // We want the page to function normally with the error notification open
        // So un-lock lockup when the error pinny opens.
        $notificationPinny.parent().lockup('unlock');
    };

    var showExpandableContent = function($content) {
        var $preview = $(this);
        $notificationPreview.addClass('js--expand');
        $notificationPreview.addClass('c--active');
        // jQuery's class functions don't work on SVGs
        $notificationPreview.find('.c-icon')[0].classList.remove('c--active');
        $fullNotification.children().removeClass('c--active');
        $fullNotification.html($content.html());
    };

    var showSingleMessage = function($message) {
        $notificationPreview.removeClass('c--active');
        $fullNotification.html($message);
        $fullNotification.children().addClass('c--active');
    };

    var showSingleError = function($errors) {

        new ErrorItemTemplate({errors: $errors, isErrorIcon: true, className: 'c-single-notification'}, function(err, html) {
            showSingleMessage($(html));
        });
    };

    var showMultipleErrors = function($errors) {
        $errors.map(function(i) {
            if ($(this).html() === '' ) {
                $(this).hide();
            }
        });
        new ErrorItemTemplate({errors: $errors, isErrorIcon: false, className: 'c-multiple-notifications'}, function(err, html) {
            showExpandableContent($(html));
        });

    };

    var triggerError = function($errorContainer) {

        var $errors = $errorContainer.children();
        $fullNotification.addClass('c--error');

        // Remove empty div with no errors
        $errors = $errors.filter(function() {
            return (!!$(this).text().trim());
        });

        if (!$errors.length) {
            return;
        }

        if ($errors.length === 1) {
            showSingleError($errors.first());
        } else {
            showMultipleErrors($errors);
        }

        // Make sure to show "You've got the following errors" text
        $notificationPinny.find('.c-notification-title')
            .prop('hidden', false);

        $notificationPinny.pinny('open');
    };

    var triggerSuccessMessage = function(message) {
        new SuccessItemTemplate({message: message}, function(err, html) {
            showSingleMessage($(html));
            $notificationPinny.pinny('open');

            // Don't need "You've got the following errors" text
            $notificationPinny.find('.c-notification-title')
                .prop('hidden', true);
        });
    };

    var initPinny = function() {
        $notificationPinny.pinny({
            effect: sheetTop,
            zIndex: 1000, // Match our standard modal z-index from our CSS ($z4-depth)
            coverage: '',
            shade: false,
            structure: false,
            closed: resetPinny,
            opened: unlockPage,
            cssClass: 'c-notification-pinny'
        });
    };

    var bindEvents = function() {
        $notificationPreview.on('click', function(e) {
            var $preview = $(this);
            var $previewShowHideText = $preview.find('.js-notification__show-hide-text');
            if ($preview.hasClass('js--expand')) {
                $fullNotification.children().toggleClass('c--active');
                // jQuery's toggle class function doesn't work on SVGs
                $preview.find('.c-icon')[0].classList.toggle('c--active');
                if ($previewShowHideText.text() === 'hide') {
                    $previewShowHideText.text(translator.translate('show'));
                } else {
                    if ($previewShowHideText.text() === 'show') {
                        $previewShowHideText.text(translator.translate('hide'));
                    }
                }
            }
        });

        $('body').on('click', '.js-notification-close', function(e) {
            $notificationPinny.pinny('close');
        });
    };

    var handleErrors = function() {
        if (event.animationName === 'errorAdded' && !$('.gwt_confirmation_div').length) {
            var $errorElements = $('.errortxt');
            $errorElements.parents('.c-box-row').addClass('c--error-row');
            $errorElements.removeAttr('style');
            triggerError($('.gwt-csb-error-panel').addClass('u-visually-hidden'));
        }
    };

    var defaultErrorHandler = function() {
        document.addEventListener('animationStart', handleErrors);
        document.addEventListener('webkitAnimationStart', handleErrors);
    };

    // Set usesDefault to true if errors are found in
    // #gwt-error-placement-div .gwt-csb-error-panel
    var init = function(useDefault) {
        initPinny();
        bindEvents();

        defaultErrorHandler();
    };

    return {
        init: init,
        triggerError: triggerError,
        triggerSuccessMessage: triggerSuccessMessage
    };
});
