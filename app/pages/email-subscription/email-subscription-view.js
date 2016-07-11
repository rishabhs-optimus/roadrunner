/**
 * Email Subscription View
 */

define([
    '$',
    'global/baseView',
    'dust!pages/email-subscription/email-subscription'
],
function($, baseView, template) {
    var $heading = 'Email Subscribe';
    return {
        template: template,
        extend: baseView,
        context: {
            templateName: 'email-subscription',
            heading: function() {
                return $heading;
            },
            subscriptionContent: function() {
                return $('.data .default');
            },
            subscriptionForm: function() {
                return $('.emailSubscribeIframe');
            }
        }
    };
});
