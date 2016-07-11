define([
    '$',
    'global/baseView',
    'dust!pages/email-register/email-register',

    // Parsers
    'pages/email-register/parsers/form'
],
function($, BaseView, template, formParser) {
    return {
        template: template,
        extend: BaseView,

        preProcess: function(context) {

            // Run the base view preProcess function if it exists
            if (BaseView.preProcess) {
                context = BaseView.preProcess(context);
            }

            // Remove inline styles from <body>
            $('body').removeAttr('style')
                .removeAttr('text')
                .removeAttr('bgcolor');

            return context;
        },

        context: {
            templateName: 'email-register',
            signupForm: function(context) {
                return $('form:first').length ? formParser.parse($('form:first')) : null;
            },
            thankyou: function(context) {
                var $body = context.body;
                var $form = $body.find('form:first');
                var $content = $body.find('p');

                if ($form.length) { return false; }

                $content.find('p:last-child').addClass('u-margin-bottom-0');

                return {
                    content: $content
                };
            }
        }
    };
});
