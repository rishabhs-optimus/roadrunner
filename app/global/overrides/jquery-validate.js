define([
    '$'
], function($) {
    var validatedEvent = new Event('validated');

    // TODO: Refactor this in to a global location.
    var overrideShowLabel = function() {
        var oldFn = window.jQuery.validator.prototype.showLabel;

        if (oldFn) {
            window.jQuery.validator.prototype.showLabel = function(element, message) {
                var result = oldFn.apply(this, arguments);
                var $input = $(element);

                // Find the errors and move them.
                var $error = $(this.toShow[this.toShow.length - 1]).remove();
                var $field = $input.parents('.c-box-row').first();
                var $errorPlaceholder;

                $errorPlaceholder = $field.find('.c-box__error');
                $field.addClass('c--error-row');
                $field.find('label').addClass('errortxt');

                // Move the desktop error in to the correct placeholder.
                $errorPlaceholder
                    .empty()
                    .append($error.text())
                    .removeAttr('hidden');

                $input.closest('.c-form')[0].dispatchEvent(validatedEvent);

                return result;
            };
        }
    };

    var overrideHideErrors = function() {
        var oldFn = window.jQuery.validator.prototype.hideErrors;

        if (oldFn) {
            window.jQuery.validator.prototype.hideErrors = function() {
                var $field = this.toHide.parents('.c-box-row').first();
                var $errorPlaceholder;

                if ($(this.lastElement).is('.valid')) {
                    $field = $(this.lastElement).parents('.c-box-row').first();
                }

                $errorPlaceholder = $field.find('.c-box__error');
                $field.removeClass('c--error-row');
                $field.find('label').removeClass('errortxt');

                $errorPlaceholder
                    .empty()
                    .attr('hidden', 'hidden');

                if ($field.length) {
                    $field.closest('.c-form')[0].dispatchEvent(validatedEvent);
                }

                return oldFn.apply(this, arguments);
            };
        }
    };

    var overrideValidate = function() {
        // Run all your overrides here.
        overrideShowLabel();
        overrideHideErrors();

        // The validator breaks for our "email" type inputs. So we need to set up
        // the validation delegate over again for this input type.
        $('form').each(function() {
            var form = this;

            // Find a better way to do this than copying desktop code.
            window.jQuery(form).validateDelegate('input[type="email"]', 'focusin focusout keyup', function(e) {
                var validator = jQuery.data(this[0].form, 'validator');
                var eventType = 'on' + event.type.replace(/^validate/, '');

                validator.settings[eventType] && validator.settings[eventType].call(validator, this[0]);
            });
        });
    };

    return {
        init: overrideValidate
    };
});
