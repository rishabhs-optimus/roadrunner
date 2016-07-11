define(function() {
    var uid = 0;
    var loadingSpinnerTimer;
    var Utils = {
        // Define Utility functions here
        updateParentIframeHeight: function() {
            var actualHeight = $('body').height();
            parent.postMessage(actualHeight, '*');
        },
        updateFormLabels: function(labelText) {
            var desktopLabels = ['Re-enter Email Address',
            'Email Address', 'Password', 'Re-enter Password'];
            var mobileLabels = ['re_enter_email', 'email',
            'password', 're_enter_password'];

            var labelRegex;
            for (var i = 0; i < desktopLabels.length; i++) {
                // regex to match string from start to end
                labelRegex = new RegExp('^' + desktopLabels[i] + '$', 'i');
                if (labelRegex.test(labelText)) {
                    return mobileLabels[i];
                }
            }
        },
        debounce: function(fn, wait) {
            var timeout;

            return function() {
                var that = this;
                var args = arguments;

                var later = function() {
                    timeout = null;
                    fn.apply(that, args);
                };

                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        requestAnimationShim: (function() {
            var timeLast = 0;

            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
                var timeCurrent = (new Date()).getTime(),
                    timeDelta;

                /* Dynamically set delay on a per-tick basis to match 60fps. */
                /* Technique by Erik Moller. MIT license: https://gist.github.com/paulirish/1579671 */
                timeDelta = Math.max(0, 16 - (timeCurrent - timeLast));
                timeLast = timeCurrent + timeDelta;

                return setTimeout(function() { callback(timeCurrent + timeDelta); }, timeDelta);
            };
        })().bind(window),
        isEmptyNullOrUndefined: function(image) {
            var imageSrc = image.attr('src');
            return (imageSrc !== null && imageSrc !== '' && imageSrc !== undefined);
        },
        'showLoadingSpinner': function(t) {
            var timeout = t || 2000;

            var $loadingOverlay = $('.js-loading-overlay');
            if ($loadingOverlay.is(':visible')) return;

            $loadingOverlay.shade('open');

            $loadingOverlay.show();

            loadingSpinnerTimer = setTimeout(Utils.hideLoadingSpinner, timeout);
        },
        'hideLoadingSpinner': function(noOuterShade) {
            var $loadingOverlay = $('.js-loading-overlay');
            var $innerShade = $('.js-inner-shade');

            $loadingOverlay.shade('close');

            $loadingOverlay.hide();

            if (loadingSpinnerTimer) {
                clearTimeout(loadingSpinnerTimer);
            }
        },
        editScriptAndUpdatePlaceholder: function($scriptContainer, inputId,
            newPlaceholder) {
            var $emailScript = $scriptContainer.find('script');
            $emailScript.append('$(\'#' + inputId + '\').attr(\'placeholder\',\'' + newPlaceholder + '\')');
            $scriptContainer.find('script').remove().end()
                .append($emailScript);
        },

        getHighResolutionImage: function($image) {
            if (Utils.isEmptyNullOrUndefined($image)) {
                //updating scr to get high resolution images
                $image.attr('src', $image.attr('src').replace( /\?.+/, ''));
            }
            return $image;
        },
        getHighResolutionProductImage: function($image) {
            if (Utils.isEmptyNullOrUndefined($image)) {
                //updating scr to get high resolution images
                $image.attr('src', $image.attr('src').replace(/\?\$.+\$&/, '?scl=1&'));
            }
            return $image;
        },
        getNumberOfReviews: function($review) {
            if ($review.text() !== undefined && $review.text().trim() !== '') {
                return '(' + $review.text().match(/\d+/)[0] + ')';
            }
        },
        overrideDomAppend: function(selector, callback, argumentSelector) {
            var _appendChild = Element.prototype.appendChild;

            Element.prototype.appendChild = function() {
                if (jQuery(this).is(selector) || jQuery(arguments[0]).is(argumentSelector)) {
                    callback.apply(this, arguments);
                }

                return _appendChild.apply(this, arguments);
            };
        },
        overrideDomRemove: function(selector, callback, argumentSelector) {
            var _removeChild = Element.prototype.removeChild;

            Element.prototype.removeChild = function() {
                if (jQuery(this).is(selector) || jQuery(arguments[0]).is(argumentSelector)) {
                    callback.apply(this, arguments);
                }

                return _removeChild.apply(this, arguments);
            };
        },
        generateUid: function() {
            return uid++;
        },
        roundToTwoDecimals: function(num) {
            var rounded = Math.round(num * 100) / 100;
            return rounded.toFixed(2);
        },
        replaceWithPrototypeElements: function(desktopSelector) {
            // thanks to prototype, desktop events are not respected by jQuery
            // so we need to replace the original element to keep desktop events
            !!$('.js-needs-replace') && $('.js-needs-replace').filter(function() {
                return !$(this).closest(desktopSelector).length;
            }).each(function() {
                var $needsReplace = $(this);
                var selector = $needsReplace.attr('data-replace-id');
                var $original = $(desktopSelector).find('[data-replace-id="' + selector + '"]')
                                    .removeClass('js-needs-replace');

                $needsReplace.replaceWith($original);
            });
        },
        swapElements: function($el1, $el2) {
            var clonedElement1 = $el1.clone();
            var clonedElement2 = $el2.clone();

            $el2.replaceWith(clonedElement1);
            $el1.replaceWith(clonedElement2);
        },
        changeBellowsIcon: function($bellowsItem) {
            var $bellowIcon = $bellowsItem.find('.c-bellows__icon');
            if ($bellowsItem.is('.bellows--is-open, .bellows--is-opening')) {
                $bellowIcon.html('<svg class="c-icon js-product-bellows" data-fallback="img/png/minus.png"> <title>minus</title> <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-minus"></use></svg>');
            } else {
                $bellowIcon.html('<svg class="c-icon js-reviews-bellows u-no-border c-reviews-bellows" data-fallback="img/png/plus.png"> <title>plus</title> <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-plus"></use></svg>');
            }
        },
        wrapPhoneNumInAnchor: function($container) {
            var phoneRegex = /(?:(?:\+?\d*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?\b([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/gm;
            var isPhoneNum = phoneRegex.test($container.html());
            if (isPhoneNum) {
                $container.html(function(index, oldhtml) {
                    return oldhtml.replace(phoneRegex, '<a href="tel:$&">$&</a>');
                });
            }
        },
        replaceWithPrototypeElementsForCheckout: function(desktopSelector) {
            // thanks to prototype, desktop events are not respected by jQuery
            // so we need to replace the original element to keep desktop events
            jQuery('.js-needs-replace').filter(function() {
                return !jQuery(this).closest(desktopSelector).length;
            }).each(function() {
                var $needsReplace = jQuery(this);
                var selector = $needsReplace.attr('data-replace-id');
                var $original = jQuery(desktopSelector).find('[data-replace-id="' + selector + '"]')
                                    .removeClass('js-needs-replace');

                $needsReplace.replaceWith($original);
            });
        }
    };

    return Utils;

});
