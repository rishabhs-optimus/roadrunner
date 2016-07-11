define([
    '$',
    'global/includes/checkout-footer/parsers/checkout-footer-accordion'

],
function($, bellowsParser) {

    return {
        context: {
            phoneNumber: function() {
                return $('#phoneNumber img').attr('alt');
            },
            footerCopyRightText: function() {
                return $('#copyright .cr').text();
            },
            sourceCodeWrapper: function() {
                return $('[id="sourceCode"]:last').remove();
            },
            footerCredentials: function() {
                return $('#copyright .credentials');
            },
            footerLinksSection: function() {
                return bellowsParser.parse();
            }
        }
    };
});
