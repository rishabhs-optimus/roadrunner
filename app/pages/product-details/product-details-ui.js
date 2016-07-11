define([
    '$',
    'global/utils',
    'global/includes/pdp-sections/ui/pdp-utils',
    'magnifik',
    'translator',
    'hijax',
    'bellows',
    'components/sheet/sheet-ui',
    'pages/product-details/ui/tell-a-friend-ui',
    'pages/product-details/ui/size-chart-ui',
    'pages/product-details/ui/personalization-ui',
    'pages/product-details/ui/international-shipping-msg-ui',
    'components/hide-reveal/hide-reveal-ui',
    'global/ui/suggested-products',
    'components/notification/notification-ui',
    'pages/product-details/ui/handle-modals-ui',
    'pages/product-details/ui/pdp-helpers-ui',
    'pages/product-details/ui/pdp-animation-handler-ui',
    'pages/product-details/ui/pdp-build-helpers-ui',
    'pages/product-details/ui/pdp-bind-events-helpers-ui',
    'pages/product-details/parsers/product-reviews-parser',
    'dust!components/bellows/bellows',
    'dust!components/review/partials/review-signature',
    'global/parsers/bazaarvoice-signature-parser',
    'dust!components/review/review',
    'dust!components/pagination/partial/review-pagination',
    'components/pagination/parsers/reviews-pagination',
    'components/pagination/pagination-ui',
    'dust!components/star-rating/star-rating',
    'global/parsers/global-star-rating-parser',
    'pages/product-details/ui/product-image-ui',
    'pages/product-details/ui/bazaar-voice-handler-ui'
], function($, Utils, pdpUtils, Magnifik, translator, Hijax, bellows, sheet,
    // UI
    TellAFriendUI, sizeChartUI, PersonalizationUI, InternationalShippingMsgUI, HideRevealUI, SuggestedProductsUI,
    // Helpers & Handlers UI
    NotificationUI, HandleModalsUI, HelpersUI, AnimationHandlerUI,
    BuildHelpersUI, BindEventsHelperUI, ProductReviewsParser, BellowsTmpl, ReviewSignatureTmpl,
    BVSignatureParser, ReviewTmpl, PaginationTmpl, ReviewsPaginationParser, paginationUI,
    RatingStarTmpl, RatingStarParser, productImageUI, BazaarVoiceHandlerUI) {


    var overrideShowErrors = function() {
        var desktopShowErrorIDsAndPanel = window.showErrorIDsAndPanel;
        window.showErrorIDsAndPanel = function() {
            var result = desktopShowErrorIDsAndPanel.apply(this, arguments);
            var $errorPopup = $('#gwt-error-placement-div').attr('hidden', 'hidden');
            Adaptive.notification.triggerError($errorPopup.find('.gwt-csb-error-panel'));
            return result;
        };
    };

    var initPlugins = function() {
        $('.js-product-bellows').bellows({

            opened: function(e, ui) {
                HideRevealUI.manageHideReveal($('.c-review-card'));
            }
        });
        $('.bellows').bellows();
        //$('.magnifik').magnifik();
    };

    var magnifikPinny = function() {
        var $magnificPinnyEl = $('.js-magnifik');
        var magnificPinny = sheet.init($magnificPinnyEl, {
            shade: {
                opacity: 0.95,
                color: '#fff',
                zIndex: 2
            },
            open: function() {
                var imgSrc = $('.js-product-image')
                    .find('img').attr('src');
                var zoomQueryParam = '&hei=1395&wid=1116&op_sharpen=1&fit=fit';
                var zoomImageSrc = imgSrc + zoomQueryParam;
                $('.js-magnifik-image').attr('src', zoomImageSrc);
                $('.js-magnifik-image').hide();
                $('.c-loading').show();
            },
            opened: function() {
                pdpUtils.centerZoomImg();
            }
        });

        $('body').on('click', '.js-product-image', function(e) {
            magnificPinny.open();
        });
    };

    // Handles the icons displayed when bellow is open and closed
    var initBellows = function() {
        $('.c-product-detail-bellow').on('click', '.c-bellows__header', function(e) {
            var $target = $(this);
            var $icon = $target.find('.c-icon:first');

            if ($icon.find('title:first').text() === 'plus') {
                $icon.attr('data-fallback', 'img/png/minus.png');
                $icon.find('title').text('minus');
                $icon.find('use').attr('xlink:href', '#icon-minus');
            } else {
                $icon.attr('data-fallback', 'img/png/plus.png');
                $icon.find('title').text('plus');
                $icon.find('use').attr('xlink:href', '#icon-plus');
            }
        });
    };

    // not the best solution, but can't really find a function to hook onto
    // on when the script gets rendered
    var pollForProductImage = function() {
        var _poll = window.setInterval(function() {
            var $pollTarget = $('.iwc-main-img');
            if ($pollTarget.length && $pollTarget.attr('src')) {
                // wait for desktop scripts to execute first
                setTimeout(function() {
                    // build images-related stuff
                    BuildHelpersUI.buildProductImages();
                    BuildHelpersUI.buildSwatchesThumbnails();
                    BuildHelpersUI.buildPrice($('.js-pdp-price'), $('.gwt-product-detail-right-panel'));
                    BuildHelpersUI.buildProductMatrix($('.js-matrix-product-detail'), $('.gwt-matrix-product-detail-radion-buttons-panel'));
                    BuildHelpersUI.buildProductOptions();
                    // TRAV-274: Update availability panel selector
                    BuildHelpersUI.buildAvaialabilityPanel($('.js-availability-info'), $('.gwt-product-detail-widget-price-availability-panel, .gwt-product-detail-inventory'));

                    //BazaarVoiceHandlerUI.transformReviewContent(Adaptive.$('#gwt-BVTabContainer'));
                    // Update DOM
                    HelpersUI.updateCTAs();
                    HelpersUI.updateMainImageSrc(Adaptive.$('.iwc-main-img-wrapper'));
                    HelpersUI.updateCarouselAnchors();
                    magnifikPinny();
                    initPlugins();
                    // Bind Events
                    BindEventsHelperUI.bindEvents(false);
                    // Repalce with Prototype
                    Utils.replaceWithPrototypeElements($('.js-desktop-pdp'));
                    TellAFriendUI.init();
                    $('body').on('click', '.js-write-first-review', function(e) {
                        var evt = document.createEvent('HTMLEvents');
                        evt.initEvent('click', true, false);
                        $('#BVRRRatingSummaryLinkWriteFirstID a').trigger('click');
                        $('#BVRRRatingSummaryLinkWriteFirstID a')[0].dispatchEvent(evt);
                    });
                    HelpersUI.productDetailsDecorators();
                });

                window.clearInterval(_poll);
            }
        }, 300);
    };

    var initHijax = function() {
        var hijax = new Hijax();

        hijax.set(
            'tell-a-friend-proxy',
            function(url) {
                return url.indexOf('SendTellAFriendEmail') > -1;
            }, {
                complete: function(data, xhr) {
                    if (data.success === 'true') {
                        TellAFriendUI.closeModal();
                        Adaptive.notification.triggerSuccessMessage(translator.translate('share_successful'));
                    }
                }
            }
        );

        hijax.set(
            'size-chart-proxy',
            function(url) {
                return /sizechart/.test(url);
            },
            {
                complete: function(data, xhr) {
                    var $sizeChartData = $(data);
                    var $sizeChartPinny = $('.js-size-chart-pinny');
                    var $sizeChartContent = $sizeChartData.filter('#size-charts-all, #wrapper');

                    // Remove desktop CSS loaded in their modal
                    $('.gwt-DecoratedPopupPanel').find('link, style').remove();

                    $sizeChartPinny.pinny('open');
                    sizeChartUI.init($sizeChartContent, $sizeChartPinny, xhr.url);
                }
            }
        );

    };
    var buildQuestions = function($questionsContainer) {
        var $questions = $('<div>', {
            class: 't-product-details__reviews-and-questions u-padding-sides-md js-question'
        });

        var questionsBellowsData = {
            class: 't-product-details__questions-bellows c--blue js-questions-inner-bellows'
        };
        var questionsBellowsItems = [];

        $questionsContainer.find('.BVQAQuestionAndAnswers').map(function(i, question) {
            var $question = $(question);
            var $answersContainer = $('<div>', {
                class: 't-product-details__answers js-answer'
            });
            var $questionDetails = $('<div>', {
                class: 'c-card u-margin-bottom-md u-padding-sides-0'
            });
            var $originalAnswerButton = $('.BVQAAnswerQuestion a').eq(i);
            var $answerButton = $('<button>', {
                class:'js-answer c-button c--link c--dark c--no-padding u-margin-top-md',
                text: $originalAnswerButton.text(),
                'data-target': '.js-answer-' + i
            });
            var questionSignatureData = BVSignatureParser.parse($question.find('.BVQAQuestion'));

            $originalAnswerButton.addClass('js-answer-' + i);

            $questionDetails.append($('<p>').text($question.find('.BVQAQuestionDetails').text()));

            new ReviewSignatureTmpl({reviewDetails: questionSignatureData}, function(err, html) {
                $questionDetails.append(html);
            });

            $questionDetails.append($answerButton);

            $question.find('.BVQAAnswer').map(function(_, answer) {
                var $answer = $(answer);
                var data;
                var $wrapper = $('<div>', {
                    class: 'c-card c--grey u-margin-bottom-md'
                });
                var reviewNoteWorthies = [];
                var reviewTags = $answer.find('.BVQABadge').map(function(_, tag) {
                    var $tag = $(tag);
                    var text = $tag.attr('title');

                    if ($tag.is('.BVQACustomerServiceBadge')) {
                        text = 'Customer Service';
                    }

                    if (/Contributor(Label|Badge)/ig.test($tag.attr('class'))) {
                        reviewNoteWorthies.push($tag.text());
                        return;
                    }

                    return text;
                });

                var _reviewAdditional = {
                    reviewTag: reviewTags,
                    reviewNoteworthy: reviewNoteWorthies
                };

                data = {
                    reviewAdditional: _reviewAdditional,
                    reviewContent: $answer.find('.BVQAAnswerText, .BVQAQuestionDetails').text(),
                    reviewDetails: BVSignatureParser.parse($answer)
                };


                new ReviewTmpl(data, function(err, html) {
                    $wrapper.html(html);
                    $answersContainer.append($wrapper);
                });
            });

            var questionsBellowsItemData = {
                sectionTitle: $question.find('.BVQAQuestionSummary').text(),
                content: $questionDetails.add($answersContainer)
            };

            questionsBellowsItems.push(questionsBellowsItemData);
        });

        // build the FAQ bellows, with questions = header, answers = content
        questionsBellowsData.items = questionsBellowsItems;


        new BellowsTmpl(questionsBellowsData, function(err, html) {
            $questions.append(html);
        });

        return $questions;
    };

    var _bindBVLinks = function() {
        // Reviews
        $('body').on('click', '#js-write-review', function(e) {
            e.preventDefault();
            $('#BVRRContainer').find('.BVRRDisplayContentLinkWrite a')[0].click();
        });

        $('body').on('click', '.js-bv-bind', function(e) {
            var selector = $(this).attr('name');
            var parentSelector = $(this).attr('data-parent-selector');
            $(parentSelector).find('[name="' + selector + '"]')[0].click();
        });

        $('body').on('click', '.js-answer', function(e) {
            $($(this).attr('data-target'))[0].click();
        });

        $('body').on('click', '#js-write-question', function(e) {
            e.preventDefault();
            $('#BVQAContainer').find('a').filter(function() {
                return /bvShowContentOnReturnQA/ig.test($(this).attr('onclick'));
            }).first()[0].click();
        });
    };

    var _updateReviewCount = function() {
        setTimeout(function() {
            var $reviewCount = $('.js-review-count');
            var actualCount = $('#BVRRRatingSummaryLinkReadID .BVRRNumber').text();
            var countInt = parseInt(actualCount);

            if (!countInt > 0) {
                actualCount = 0;
            }

            if (!countInt || countInt <= 6) {
                $('.js-review-check-desktop').attr('hidden', 'true');
            }

            $reviewCount.text(actualCount);
            var $headerRating = $('.BVRRRatingNumber:first').text();
            var overallRatingStars = RatingStarParser.parse($headerRating);
            new RatingStarTmpl(overallRatingStars, function(err, html) {
                $('.js-overall-header-rating, .js-view-reviews').each(function(i, container) {
                    $(container).html(html);
                });
            });

        }, 500);
    };

    var updateWriteReviewLink = function($content) {
        // Update the write review link text.
        var $writeReview = $content.find('.BVRRRatingSummaryLinkWriteFirstPrefix').next();

        if ($writeReview.length) {
            $('.js-write-first-review').text($writeReview.text());
        }
    };

    var _sortPrices = function($prices) {
        // Takes a collection of price DOM elements
        // Modifies the DOM to sort the price elements from low to high
        $prices.sort(function(a, b) {
            var aNum = parseFloat($(a).text().match(/[+\-]?\d+(,\d+)?(\.\d+)?/)[0]);
            var bNum = parseFloat($(b).text().match(/[+\-]?\d+(,\d+)?(\.\d+)?/)[0]);
            if (aNum > bNum) {
                return 1;
            }
            if (aNum < bNum) {
                return -1;
            }
            return 0;
        });
        return $prices;
    };

    var changeRadioEvent = function() {
        $('body').on('change', '.c-matrix-detail-radio-button input[type="radio"]', function() {
            var $radioButton = $('.c-matrix-detail-radio-button');
            $radioButton.removeClass('c--current');
            $(this).closest('.c-matrix-detail-radio-button').addClass('c--current');

            setTimeout(function() {
                $('.js-stepper-decrease').next('.gwt-product-detail-widget-quantity-panel').filter(function() {
                    return !$(this).children().length;
                }).remove();
                $('.js-stepper-decrease').after($('.gwt-product-detail-widget-quantity-panel'));
                pdpUtils.transformImageThumbnail();

                // TRAV-320: Pull price data for Matrix PDPs from correctly updating data source
                var $pricePanel = $('.gwt-product-detail-widget').find('.gwt-price-panel').first();
                if ($pricePanel.length) {
                    var $container = $('.js-pdp-price');
                    // TRAV-320: Ensure price at top of page is also sorted
                    var _shouldSortPrices = false;
                    if ($pricePanel.find('.gwt-promo-discount-orginal-label').length) {
                        _shouldSortPrices = true;
                        Utils.swapElements($pricePanel.find('.gwt-promo-discount-orginal-label'), $pricePanel.find('.gwt-now-price-holder'));
                        Utils.swapElements($pricePanel.find('.gwt-promo-discount-was-label'), $pricePanel.find('.gwt-promo-discount-orginal-label'));
                    } else {
                        Utils.swapElements($pricePanel.find('.gwt-was-price-holder'), $pricePanel.find('.gwt-now-price-holder'));
                    }

                    if (_shouldSortPrices) {
                        // TRAV-320: Ensure prices are sorted from low to high
                        var $workingPricePanel = $pricePanel.clone();
                        var $workingPrices = $workingPricePanel.find('.gwt-HTML');
                        var $sortedPrices = _sortPrices($workingPrices);
                        $workingPrices.parent().html($sortedPrices);
                        $container.empty().append($workingPricePanel);
                    } else {
                        $container.empty().append($pricePanel);
                    }

                    // TRAV-274: Have second price display populated alongside page's
                    if ($('.js-second-title-price .js-second-title-price__price').length) {
                        var $decoratedPricePanel = $pricePanel.clone();
                        $decoratedPricePanel = $decoratedPricePanel.find('.gwt-HTML').addClass('c-arrange__item');
                        $decoratedPricePanel.filter('.gwt-now-price-holder').addClass('c-category-product__price-now');
                        $decoratedPricePanel.filter('.gwt-was-price-holder').addClass('c-category-product__price-was');
                        $decoratedPricePanel = _sortPrices($decoratedPricePanel);
                        $('.js-second-title-price .js-second-title-price__price').empty().append($decoratedPricePanel);
                    }
                }
            }, 100);
        });

        // trigger click
        $('body').on('click', '.c-matrix-detail-radio-button', function(e) {
            if ($(e.target).is('input[type="radio"]')) {
                return;
            }
            var evt = document.createEvent('HTMLEvents');
            evt.initEvent('click', true, false);
            $(this).find('input[type="radio"]').trigger('click').change();
            $(this).find('input[type="radio"]')[0].dispatchEvent(evt);

            HelpersUI.productDetailsDecorators();
        });

    };

    var bindThumbnails = function() {
        $('body').on('click', '.c-slideshow__slide', function() {
            var $this = $(this);
            if ($this.parents('.js-product-image-thumbnails').length) {
                var $mainImage = $('.js-product-image img');
                var $video = $('.js-product-image iframe');
                if ($this.hasClass('js-video-thumbnail')) {
                    $mainImage.attr('hidden', '');
                    $video.removeAttr('hidden');
                } else {
                    $mainImage
                        .attr('src', $this.find('img').attr('src'))
                        .removeAttr('hidden');
                    $video.attr('hidden', '');
                }

                $('.js-product-image-thumbnails .c-slideshow__slide').removeClass('c--selected');
                $this.addClass('c--selected');
            }
        });
    };

    var productDetailsUI = function() {
        bindThumbnails();
        productImageUI.init();
        pollForProductImage();
        initPlugins();
        initHijax();
        initBellows();
        HideRevealUI.init();
        changeRadioEvent();
        AnimationHandlerUI.bindAnimationListener();
        HandleModalsUI.initSheets();
        SuggestedProductsUI.init();
        PersonalizationUI.init();
        InternationalShippingMsgUI.init();
        NotificationUI.init(true);
        BindEventsHelperUI.bindProductImageOptionClick();
        BindEventsHelperUI.bindCustomEvents();
        HelpersUI.enableDisableAddToCartWishlist();
        paginationUI.init();

        var reviewSheet = sheet.init($('.js-product-review-pinny'), {

            opened: function() {
                HideRevealUI.manageHideReveal($('.c-review-card'));
            }
        });
        var questionSheet = sheet.init($('.js-product-question-pinny'));
        // Desktop Override
        overrideShowErrors();
        BazaarVoiceHandlerUI.init(reviewSheet, questionSheet);
    };

    return productDetailsUI;
});
