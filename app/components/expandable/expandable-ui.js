define([
    '$'
], function($) {
    var HEIGHT_THRESHOLD = 150; // Hardcoding 150px as the height threshold

    var Expandable = function($el, options) {
        // TODO: Comeback to this later to fix why the $ is wrong
        $ = Adaptive.$;

        var self = this;
        self.$el = $el;

        self.checkOverflow();

        // $(window).on('resize', function() {
        //     self.checkOverflow();
        // });
    };

    Expandable.prototype.bindEvents = function() {
        var self = this;
        var $el = self.$el;
        var $viewMore = $el.find('.js-view-more');
        var $viewLess = $el.find('.js-view-less');

        $el.on('click', '.c-expandable__toggle .c-button', function() {
            // TODO: Animation for expanding/collapsing with Velocity?
            $el.find('.c-expandable__content')
                .toggleClass('c--overflow c--expand');

            if ($viewMore.prop('hidden')) {
                $viewMore.removeAttr('hidden');
                $viewLess.attr('hidden', 'hidden');

                // Scroll container back in place so user doesn't get lost
                if ($el.data('scroll-to') === true) {
                    $('html, body').animate({
                        scrollTop: $el.offset().top
                    }, 200);
                }
            } else {
                $viewLess.removeAttr('hidden');
                $viewMore.attr('hidden', 'hidden');
            }
        });
    };

    Expandable.prototype.checkOverflow = function() {
        var self = this;
        var $el = self.$el;

        var $innerContent = $el.find('.c-expandable__inner');
        var innerContentHeight = $innerContent.height();
        if (innerContentHeight > HEIGHT_THRESHOLD) {
            $el.find('.c-expandable__content').addClass('c--overflow');

            // Show toggle button
            $el.find('.c-expandable__toggle').removeAttr('hidden');

            this.bindEvents();
        }
    };

    return {
        init: function($el, options) {
            $el = $el || $('.c-expandable');
            // return $el.data('component') || $el.data('component', new Expandable($el, options));
            // IMPR-105: Always run constructor. Always.
            return $el.data('component', new Expandable($el, options));
        }
    };
});
