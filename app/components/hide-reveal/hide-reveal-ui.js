define([
    '$',
],
function($) {

    var init = function() {
        // Display all content when reveal link is clicked
        $('body').on('click', '.js-reveal-link', function() {
            var $this = $(this);
            var $container = $this.parents('.c-hide-reveal');
            $container.children('.js-content').removeClass('c--restricted-content');
            $this.addClass('u--hide');
            $container.children('.js-hide-link').removeClass('u--hide');
        });

        // Display restricted content when hide link is clicked
        $('body').on('click', '.js-hide-link', function() {
            var $this = $(this);
            var $container = $this.parents('.c-hide-reveal');
            $container.children('.js-content').addClass('c--restricted-content');
            $this.addClass('u--hide');
            $container.children('.js-reveal-link').removeClass('u--hide');
        });
    };

    var manageHideReveal = function($container) {
        $container.find('.c--restricted-content').removeClass('c--restricted-content');
        $container.map(function(_, item) {
            var $item = $(item);
            var height = $item.find('.c-hide-reveal__content').height();
            var $revealLink = $item.find('.c-hide-reveal__reveal-link');

            if (height && height <= 60) {
                $revealLink.addClass('u--hide');
            } else {
                $item.find('.c-hide-reveal__content').addClass('c--restricted-content');
                $revealLink.removeClass('u--hide');
                $item.find('.c-hide-reveal__hide-link').addClass('u--hide');
            }
        });
    };


    return {
        init: init,
        manageHideReveal: manageHideReveal
    };
});
