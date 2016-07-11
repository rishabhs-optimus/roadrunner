define([
    '$',
    'translator',
    'global/includes/footer/parsers/footer-accordion',
    'global/includes/footer/parsers/myAccount-accordion'
],

function($, translator, bellowsParser, myAccountParser) {
    var parseIcons = function($socialElement, iconName, target) {
        return {
            href: $socialElement.find('a').attr('href'),
            altName: $socialElement.find('img').attr('alt'),
            iconName: iconName,
            className: 'c-social-link',
            target: target
        };
    };

    var getEmailSubscription = function() {
        var $emailSubscription = $('#email_signup_box #EmailSignUpForm');
        var $emailSigUpInputField = $emailSubscription.find('#emailSignUp').attr('type', 'email');
        $emailSigUpInputField.removeAttr('value');
        $emailSubscription.find('button').find('img').remove();
        $emailSigUpInputField.attr('placeholder', translator.translate('email-address')).addClass('c-email-subscription-placeholder');

        // TRAV-427
        // On some pages, such as the PDP, this form is included several times
        // If our form isn't the first in the DOM, form validation will fail
        // So remove all other email forms
        $('[id="EmailSignUpForm"]').not($emailSubscription).remove();

        return {
            form: $emailSubscription,
            hiddenFields: $emailSubscription.find('[type="hidden"]'),
            emailFieldLabel: $emailSubscription.find('#emailSignUp_label').addClass('u--hide'),
            emailFieldInput: $emailSigUpInputField,
            submitButton: $emailSubscription.find('button').attr('class')
        };
    };
    return {
        context: {
            footerLinksSection: function() {
                return $('#footer_links').length ? bellowsParser.parseCustomerServiceSection() : null;
            },
            aboutSection: function() {
                return $('#footer_links').length ? bellowsParser.parseAboutSection() : null;
            },
            emailSubscriptionFields: function() {
                return getEmailSubscription();
            },
            footerLogo: function() {
                var $href = $('.menuItem').has('img[alt="Travel Center"]');
                return {
                    href: $href.find('a').attr('href')
                };
            },
            socialLinks: function() {
                var $facebook = $('.social1:first');
                var $pinterest = $('.social2:last');
                var $twitter = $('.social1:last');
                var $socialLinks = [];

                $facebook.length && $socialLinks.push(parseIcons($facebook, 'facebook', ''));
                $twitter.length && $socialLinks.push(parseIcons($twitter, 'twitter', '_blank'));
                $pinterest.length && $socialLinks.push(parseIcons($pinterest, 'pinterest', '_blank'));

                return {
                    links: $socialLinks,
                    className: 'c-social-link',
                    target: '_blank'
                };
            },
            footerColumns: function() {
                var $terms = $('#links .columnA').find('[href="/conditions-of-use/content"]');
                var $privacy = $('#copyright_box').find('a');
                var $copyright = $('#copyright_box').find('p').text().match(/\d{4}/g);
                return {
                    terms: $terms,
                    privacy: $privacy,
                    copyright: $copyright
                };
            },
            sourceCodeWrapper: function() {
                return $('[id="sourceCode"]:last').remove();
            },
            myAccountAccordion: function() {
                return $('#myAccount').length ? myAccountParser.parse() : null;
            },
            fbIframe: function() {
                return $('#footerfblike');
            }
        }
    };
});
