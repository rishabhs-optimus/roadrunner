define([
    '$',
    'global/baseView',
    'dust!pages/register/register',
    'components/button/parsers/button',
    'translator',
    'global/utils'
],
function($, BaseView, template, buttonParser, Translator, Utils) {

    return {
        template: template,
        extend: BaseView,

        context: {
            templateName: 'register',
            content: function(context) {
                return $('#mainContent');
            },
            pageTitle: function(context) {
                var $content = context.content;
                return $content.find('h1').attr('title');
            },
            form: function() {
                var $form = $('#userRegistrationForm');
                $('.data p:contains(password)')
                .addClass('spot c-box-row c-password-info')
                .insertAfter($form.find('.spot:contains(Re-enter Email Address)'));
                return $form;
            },
            errorContainer: function(context) {
                return context.form.find('#gwt-error-placement-div');
            },
            hiddenInputs: function(context) {
                return context.form.children('[type="hidden"]');
            },
            continueButton: function(context) {
                var $button = context.form.find('.button.primary');
                return {
                    buttonId : $button.attr('id'),
                    buttonText : $button.find('span').text(),
                    buttonType : $button.attr('type'),
                    buttonClass: 'c--primary c--full-width'
                };
                //return buttonParser.parse(context.form.find('.button.primary'));
                // return context.form.find('.button.primary').addClass('c-button c--primary c--full-width');
            },
            sendMeEmails: function(context) {
                var $sendMeEmailContainer = context.form.find('.spot.opt');
                var $input = $sendMeEmailContainer.find('input').remove();
                return {
                    input: $input,
                    inputId: $input.attr('id'),
                    label: $sendMeEmailContainer.text()
                };
            },
            description: function(context) {
                return context.form.find('.spot').not('.actions, .opt').map(function(i, row) {
                    var $row = $(row);
                    if ($row.is('p')) {
                        return $row;
                    }
                });
            },
            formRows: function(context) {
                return context.form.find('.spot').not('.actions, .opt').map(function(i, row) {
                    var $row = $(row);
                    var isInput;
                    if (!$row.is('p')) {
                        var id;
                        isInput = true;
                        var $required = $row.find('.required').addClass('c--shrink').remove();
                        var $label = $row.find('label').addClass('c-arrange__item c--shrink');
                        var labelText = $label.text();
                        var newLabel = labelText;
                        $label.attr('data-label', $label.text().replace('*', ''));
                        if (labelText.indexOf('Re-enter') >= 0) {
                            id = 'verifyLogonId';
                        } else {
                            id = 'logonId';
                        }
                        //Utils.editScriptAndUpdatePlaceholder($row, id, Translator.translate('email_placeholder'));
                    }

                    // Update Form Labels to match the invision
                    // newLabel && $label.text(Translator.translate(newLabel));
                    return {
                        inputScript: $row.find('script'),
                        required: $required,
                        input: $row.find('input'),
                        label: $label,
                        isInput: isInput
                    };
                });
            },
            getUserState: function() {
                return $('#gwt_user_state');
            }
        }
    };
});
