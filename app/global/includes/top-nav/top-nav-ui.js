define(['$', 'components/sheet/sheet-ui'], function($, Sheet) {
    var init = function() {
        var $sheet = $('.js-top-nav');
        var sheet = Sheet.init($sheet);

        $('.js-top-nav-button').on('click', function() {
            sheet.open();
        });
    };

    return {
        init: init
    };
});
