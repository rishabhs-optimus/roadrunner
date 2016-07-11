define(['$'], function($) {
    // Get button attributes
    var _parse = function($button) {
        return {
            buttonId: $button.attr('id'),
            buttonType: $button.attr('type'),
            buttonText: $button.text().trim(),
            buttonClass: $button.attr('class')
        };
    };

    return {
        parse: _parse
    };
});
