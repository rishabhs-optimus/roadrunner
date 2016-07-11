define(['$'], function($) {
    var emailSubscriptionUI = function() {
        // Set iframe height
        // Listen to message from child window
        window.addEventListener('message', function(e) {
            $('.t-email-subscription__iframe-wrapper iframe').css('height', e.data + 'px');
        }, false);
    };

    return emailSubscriptionUI;
});
