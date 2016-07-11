define([
    '$',
    'modal-center',
    'sheet-bottom',
    'sheet-left',
    'sheet-top',
    'sheet-right',
    'global/ui/pinny-effects/sheet-top-left',
    'global/ui/pinny-effects/sheet-top-right',

    // No Args
    'pinny'
], function($, modalCenter, sheetBottom, sheetLeft, sheetTop, sheetRight, sheetTopLeft, sheetTopRight, Pinny) {
    var defaults = {
        container: '#x-root',
        cssClass: 'c-sheet',
        structure: false,
        coverage: '87%',
        duration: '200',
        effect: modalCenter,
        zIndex: 1000, // Match our standard modal z-index from our CSS ($z4-depth),
        passive: true // A sheet is passive if it will close when clicked outside of the main body
    };

    var effects = {
        'modalCenter': modalCenter,
        'sheetBottom': sheetBottom,
        'sheetLeft': sheetLeft,
        'sheetTop': sheetTop,
        'sheetRight': sheetRight
    };

    var pinnyContentMaxHeight = function(pinnyInstance) {
        var windowHeight = $(window).height();
        var pinnyHeader = pinnyInstance.$pinny.find('.pinny__header');
        var pinnyFooter = pinnyInstance.$pinny.find('.pinny__footer');
        var pinnyHeaderHeight = pinnyHeader.length ? pinnyHeader.height() : 0;
        var pinnyFooterHeight = pinnyFooter.length ? pinnyFooter.height() : 0;
        var maxHeight;

        maxHeight = windowHeight - pinnyHeaderHeight - pinnyFooterHeight;
        pinnyInstance.$pinny.find('.pinny__content').css('max-height', maxHeight);
    };

    // TODO: Expand on these options and find a better way of including variable numbers of options.
    var _buildOptions = function($el, options) {
        var inlineOptions = {
            coverage: $el.data('coverage') ? $el.data('coverage') : undefined,
            duration: $el.data('duration') ? $el.data('duration') : undefined,
            passive: $el.data('passive') === false ? false : true,
            effect: effects[$el.data('effect')],
            cssClass: $el.data('css-class') ? $el.data('cssClass') : undefined
        };
        var combined = {};
        var dialogOptions = {};

        if ($el.data('css-class') !== undefined && $el.data('css-class').indexOf('dialog') !== -1) {
            dialogOptions = {
                opened: function() {
                    var pinnyInstance = this;

                    pinnyContentMaxHeight(pinnyInstance);

                    $(window).on('orientationchange', function() {
                        if (pinnyInstance.$pinny.hasClass('pinny--is-open')) {
                            pinnyContentMaxHeight(pinnyInstance);
                        }
                    });
                }
            };
        }

        $.extend(combined, defaults, options, inlineOptions, dialogOptions);

        return combined;
    };

    /**
     * Sheet constructor
     */
    var Sheet = function($el, options) {
        var self = this;
        var isOpen = false;
        var definedOptions = options;
        self.$el = $el;
        self.$bodyEl = $el.find('.c-sheet__body');

        // Get a complete list of options
        options = _buildOptions(self.$el, options);

        // TODO improve
        options.closed = function() {
            self.isOpen = false;
            // Add this for accessing the closed functionality in the page
            if (definedOptions && definedOptions.closed) {
                definedOptions.closed.apply(this, arguments);
            }
        };

        // Initialize plugin.
        self.$pinnyEl = self.$el.pinny(options);

        if (!options.passive) {
            // Set shade pointer events
            var $shade = self.$pinnyEl.parent().next('.shade');
            $shade.off('click');
        }
    };

    Sheet.prototype.open = function() {
        this.$el.pinny('open');
        this.isOpen = true;
    };

    Sheet.prototype.close = function() {
        this.$el.pinny('close');
        this.isOpen = false;
    };

    Sheet.prototype.toggle = function() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    };

    Sheet.prototype.getPlugin = function() {
        return this.$pinnyEl.data('pinny');
    };

    Sheet.prototype.setTitle = function(content) {
        this.$el.find('.c-sheet__title').html(content);
    };

    Sheet.prototype.getTitle = function() {
        return this.$el.find('.c-sheet__title').html();
    };

    Sheet.prototype.setBody = function(content) {
        this.$el.find('.c-sheet__body').html(content);
    };

    Sheet.prototype.getBody = function() {
        return this.$el.find('.c-sheet__body').html();
    };

    Sheet.prototype.setFooter = function(content) {
        this.$el.find('.c-sheet__footer').html(content);
    };

    Sheet.prototype.getFooter = function() {
        return this.$el.find('.c-sheet__footer').html();
    };

    Sheet.prototype.scrollToTop = function(callback) {
        var $body = this.$el.find('.c-sheet__body');

        $body.animate({scrollTop: '0px'}, callback);
    };

    return {
        init: function($el, options) {
            $el = $($el); // Recreate jQuery object with correct selector

            // If already initialized, return the instance; otherwise, create it
            // and expose it through `$('.c-tabs').data('component')`.
            return $el.data('component') || $el.data('component', new Sheet($el, options)).data('component');
        }
    };
});
