define([
    '$'
], function($) {
    var parseFields = function($inputs) {
        return $inputs.map(function() {
            var $input = $(this);
            var $label = $input.siblings('label').length ? $input.siblings('label') : $input.parent().prev('p');
            var $labelElement = $('<label />');

            $labelElement.attr('for', $input.attr('id'))
                .html($label.text());


            if (/email/i.test($input.attr('id'))) {
                $input.attr('type', 'email');
            }

            return {
                isSelect: $input.is('select') ? true : null,
                isCheckRadio: $input.is('[type="checkbox"]') || $input.is('[type="radio"]') ? true : null,
                label: $label.length ? $labelElement : null,
                input: $input.removeAttr('style')
            };
        });
    };

    var parseFieldRows = function($fieldset) {
        // Parse the email inputs.
        var $fieldRows = $fieldset.children('.field, p');

        return $fieldRows.map(function() {
            var $fieldRow = $(this);
            var $fieldInputs = $fieldRow.find('input[type="text"], input[type="checkbox"], select');
            var fieldsData = parseFields($fieldInputs);

            return $fieldInputs.length ? {
                fields: fieldsData
            } : null;
        });
    };

    var parseFieldset = function($form) {
        var $fieldsets = $form.find('#sign-up, .update-interests, .birthday');

        return $fieldsets.map(function() {
            var $fieldset = $(this);
            var fieldRowsData = parseFieldRows($fieldset);
            var $textContentOnly = $fieldset.children('p').filter(function() {
                if (!$(this).children('input, select').length) {
                    return $(this);
                }
            });

            return {
                contents: $fieldset.children('h3').add($textContentOnly),
                fieldRows: fieldRowsData
            };
        });
    };

    var parse = function($container) {
        var $form = $container.is('form') ? $container : $container.find('form');
        var $hiddenInputs = $form.find('input[type="hidden"]');
        var $contents = $form.children('div:first');
        var $submitButton = $form.find('input[type="image"]');
        var fieldsetData = parseFieldset($form);

        return {
            intro: $form.siblings('.intro').addClass('u-margin-bottom-lg u-padding-bottom u-border-bottom'),
            element: $form.addClass('c-form'),
            fieldsets: fieldsetData,
            hiddenInputs: $hiddenInputs,
            footer: {
                buttons: [{
                    text: $submitButton.is('#update-prefs') ? 'Update My Preferences' : $submitButton.val(),
                    input: $submitButton
                }]
            }
        };
    };

    return {
        parse: parse
    };
});
