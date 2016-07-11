define(['$', 'dust!components/loading-overlay/loading-overlay', 'hijax', 'scrollTo'], function($, LoadingTemplate, Hijax) {
    var overrideShowErrors = function() {
        var desktopShowErrorIDsAndPanel = window.showErrorIDsAndPanel;
        window.showErrorIDsAndPanel = function() {
            var result = desktopShowErrorIDsAndPanel.apply(this, arguments);
            var $errorPopup = $('#gwt-error-placement-div').attr('hidden', 'hidden');
            Adaptive.notification.triggerError($errorPopup.find('.gwt-csb-error-panel'));
            return result;
        };
    };
    var giftCardAnimation = function() {
        if (event.animationName === 'giftCardBalance') {
            var $pollTarget = $('.giftCardBalancePanel');
            $pollTarget.find('button').addClass('c-button c--primary c--full-width u-margin-top-lg u-margin-bottom-md');
        }
        if (event.animationName === 'giftCardBalanceLoading') {
            var $pollTarget = $('.gwt-please-wait-panel');
            var $container;
            new LoadingTemplate(true, function(err, html) {
                $container = $(html);
            });
            $pollTarget.empty();
            $pollTarget.append($container);
        }
    };

    var loaderHijax = function($container) {
        var hijax = new Hijax();
        hijax.set(
            'pleaseWailLoader', function(url) {
                return /GiftCardBalanceJSONView/.test(url);
            }, {
                complete: function() {
                    $.scrollTo($('html'));
                }
            }
        );
    };

    var giftCardBalanceUI = function() {
        overrideShowErrors();
        document.addEventListener('animationStart', giftCardAnimation);
        document.addEventListener('webkitAnimationStart', giftCardAnimation);
        loaderHijax();
    };

    return giftCardBalanceUI;
});
