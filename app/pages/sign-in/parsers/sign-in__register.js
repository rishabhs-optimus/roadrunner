define(['$'], function($) {

    // Get label and inputs
    var getFormFields = function($form) {
        return $form.find('.spot').map( function(_, item) {
            var $self = $(item);
            if (!$self.children().length) {
                return;
            }
            return {
                label: $self.find('label'),
                input: $self.find('input'),
                formScript: $self.find('script')
            };
        });
    };

    var _parse = function($form) {
        var $content = $form.find('.contentspot').find('p, ul');
        $content.addClass('t-sign-in__registration-list').find('li').wrapInner('<span class="t-sign-in__registration-list-item">');
        $content.find('li').find('strong')
            .prepend('<svg class="c-icon" data-fallback="img/png/check.png"><title>check</title><use xlink:href="#icon-check"></use></svg>');
        return {
            form: $form,
            hiddenFields: $form.find('input[type="hidden"]'),
            registerButton: $form.find('button').addClass('c-button c--full-width c--primary'),
            welcomeMsg: $form.find('.contentspot').contents().filter(function() {
                return this.nodeType === 3;
            }).text(),
            welcomeText: $form.find('.inst-copy').text(),
            registerContent: $content
        };
    };

    return {
        parse: _parse
    };
});
