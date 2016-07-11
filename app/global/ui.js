define([
    '$',
    'fastclick',
    'navitron',
    'components/mini-cart/mini-cart-ui',
    'components/sheet/sheet-ui',
    'bellows',
    'components/notification/notification-ui',
    'components/search-suggestions/search-suggestion-ui',
    'global/ui/back-to-top',
    'components/welcome-modal/welcome-modal-ui',

    'global/utils/selector-extensions'
],
function(
    $,
    fastclick,
    navitron,
    minicart,
    sheet,
    bellows,
    notification,
    searchSuggestionUI,
    backToTop,
    welcomeModal
) {
    // Intercept alert to display the errors using notification component
    var _interceptAlertForError = function() {
        var $onClickError = $('.c-email-subscription__form');
        $onClickError.on('click', 'button', function(event) {
            var _alert = window.alert;

            // Intercepting alert function to catch the error messages.
            window.alert = function(message) {

                // Create structure required by notifiation component
                var $errorContainer = $('<div><div class="js-error"></div></div>');
                $errorContainer.find('.js-error').append(message);
                Adaptive.notification.triggerError($errorContainer);

                // TODO: Handle multiple error case
            };
            /*eslint-enable */
        });
    };

    var _overrideValidateData = function() {
        var oldFn = window.validateData;

        window.validateData = function() {
            // Set focus on error to false to prevent fix position errors with the notice on iOS.
            window.validator_set_focus_on_failure = false; //eslint-disable-line

            // TRAV-164: Override scrollTo as in few cases scroll happens even if
            // validator_set_focus_on_failure is set to false
            var _scrollTo = window.scrollTo;
            window.scrollTo = function _scrollTo() {
            };

            var _results = oldFn.apply(this, arguments);
            // Reset the function after validation is performed
            setTimeout(function() {
                // This was running multiple times and overriding original
                // function with custom anonymous function
                if (_scrollTo.name.indexOf('_scrollTo') === -1) {
                    window.scrollTo = _scrollTo;
                }
            }, 100, _scrollTo);
            return _results;
        };
    };

    var _onGWTReady = function() {
        _overrideValidateData();
    };
    // Initiaizes Navigation and uses Navitrn plugin
    var _initNav = function() {
        var $nav = $('.js-nav').navitron({
            structure: false
        });

        // Make sure navitron panes are scrollable
        $nav.find('.navitron__content').addClass('pinny--is-scrollable');

        return $nav;
    };
    var _toggleIcon = function($item) {
        var $icon = $item.find('.c-bellows__header .c-icon');

        if ($item.hasClass('bellows--is-open')) {
            $icon.attr('data-fallback', 'img/png/minus.png');
            $icon.find('title').text('minus');
            $icon.find('use').attr('xlink:href', '#icon-minus');
        } else {
            $icon.attr('data-fallback', 'img/png/plus.png');
            $icon.find('title').text('plus');
            $icon.find('use').attr('xlink:href', '#icon-plus');
        }
    };
    var _initBellows = function() {
        $('.bellows:not(.js-manual-bellow-init)').bellows({
            singleItemOpen: false,
            duration: 200,
            easing: 'swing',
            opened: function(e, ui) {
                _toggleIcon(ui.item);
            },
            closed: function(e, ui) {
                _toggleIcon(ui.item);
            }
        });
    };

    var _initLeftNav = function() {
        var $leftNavSheetEl = $('.js-left-nav');
        var $headerItem = $('.t-header__row-item').children();
        var leftNavSheet = sheet.init($leftNavSheetEl, {
            shade: {
                opacity: 0.95
            },
            open: function() {
                $headerItem.addClass('c--depth-max');
            },
            close: function() {
                $headerItem.removeClass('c--depth-max');
            }
        });

        $('body').on('click', '.js-shop-nav', function() {
            leftNavSheet.open();
        });

    };

    var fixIOSScrollInPinny = function() {
        // We need to know when to do the scroll fix, and this is when options
        // change for a product.
        // FRGT-519: Repaint page on touchstart when repaint is needed.
        if (!$.os.ios) { return; }

        $('body')
            .on(
                'blur',
                '.c-sheet select, .c-sheet input',
                function() {
                    var $sheets = $('.c-sheet.pinny--is-open').filter(function() {
                        return $(this).find('input').length > 0;
                    });

                    $sheets.data('needsScrollFix', true);
                })
            .on(
                'touchstart',
                '.c-sheet',
                function() {
                    var $sheet = $(this);
                    var needsScrollFix = $sheet.data('needsScrollFix');

                    if (needsScrollFix) {
                        $sheet.css('border', 'solid 1px transparent');
                        $sheet.find('img, input').css('transform', 'translateZ(0)');

                        setTimeout(function() {
                            $sheet.css('border', 'solid 0px transparent');
                            $sheet.find('img, input').css('transform', '');
                        }, 500);

                        $sheet.data('needsScrollFix', false);
                    }
                });
    };

    var globalUI = function() {
        // Remove 300ms tap delay using FastClick
        fastclick.attach(document.body);

        // Initiaizes welcome modal popup
        welcomeModal.init();

        // Enable active states for CSS
        $(document).on('touchstart', function() {});

        _initNav();
        _initLeftNav();
        if (typeof gwtInitialized === 'undefined') {
            window.addEventListener('gwtLoadedEvent', function(e) {
                _onGWTReady();
            }, false);
        } else {
            _onGWTReady();
        }

        _overrideValidateData();

        //Search Suggestion initialization
        searchSuggestionUI.init();

        minicart.bindEventHandlers();
        minicart.initHijaxProxies();
        // Initializes Mini cart
        minicart.initCartPinny();

        // Add any scripts you would like to run on ALL pages here
        _interceptAlertForError();
        backToTop();
        Adaptive.notification = notification;
        Adaptive.notification.init();
        _initBellows();
        fixIOSScrollInPinny();
        // initLoadingSpinner();
    };

    return globalUI;

});
