define([
    '$',
    'global/baseView',
    'dust!pages/sign-in/sign-in',
    'pages/sign-in/parsers/sign-in__sign-in',
    'pages/sign-in/parsers/sign-in__register',
    'dust!pages/sign-in/partials/sign-in__sign-in',
    'dust!pages/sign-in/partials/sign-in__register',
    'translator'
],
function($, BaseView, template, signInParser, registerParser, signInTemplate, registerTemplate, Translator) {

    var getLoginSection = function() {
        var $loginInForm = $('#userLogonForm');
        var $content;
        var data = signInParser.parse($loginInForm);

        signInTemplate(data, function(err, html) {
            $content = $(html);
        });

        return {
            title: Translator.translate('sign_in'),
            content: $content
        };
    };

    var getRegisterSection = function() {
        var $registerForm = $('#userLogonRegistration');
        var $content;
        var data = registerParser.parse($registerForm);

        registerTemplate(data, function(err, html) {
            $content = $(html);
        });

        return {
            title: Translator.translate('register'),
            content: $content
        };
    };

    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'sign-in',
            signInTabs: function() {
                var tabs = [];

                tabs.push(getLoginSection());
                tabs.push(getRegisterSection());

                return {
                    tabs: tabs
                };
            }
        }
    };
});
