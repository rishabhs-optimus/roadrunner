define([
    '$',
    'global/utils',
    // 'global/includes/pdp-sections/ui/pdp-utils',
    // 'magnifik',
    // 'translator',
    // 'hijax',
    // 'bellows',
    // 'components/sheet/sheet-ui',
    // 'pages/product-details/ui/tell-a-friend-ui',
    // 'pages/product-details/ui/size-chart-ui',
    // 'pages/product-details/ui/personalization-ui',
    // 'pages/product-details/ui/international-shipping-msg-ui',
    // 'components/hide-reveal/hide-reveal-ui',
    // 'global/ui/suggested-products',
    // 'components/notification/notification-ui',
    // 'pages/product-details/ui/handle-modals-ui',
    // 'pages/product-details/ui/pdp-helpers-ui',
    // 'pages/product-details/ui/pdp-animation-handler-ui',
    // 'pages/product-details/ui/pdp-build-helpers-ui',
    // 'pages/product-details/ui/pdp-bind-events-helpers-ui',
    // 'pages/product-details-bundle/parsers/product-widget-parser',
    // 'dust!components/bellows/bellows',
    // 'dust!components/stepper/stepper',
    // 'pages/product-details/parsers/product-reviews-parser',
    // 'global/parsers/global-star-rating-parser',
    // 'components/pagination/parsers/reviews-pagination',
    // 'dust!components/pagination/partial/review-pagination',
    // 'dust!components/bellows/bellows',
    // 'dust!components/review/review',
    // 'dust!components/review/partials/review-signature',
    // 'global/parsers/bazaarvoice-signature-parser',
    // 'dust!components/star-rating/star-rating',
    // 'pages/product-details/ui/product-image-ui',
    // 'pages/product-details/ui/bazaar-voice-handler-ui'
], function($, Utils, pdpUtils, Magnifik, translator, Hijax, bellows, sheet,
    // UI
    TellAFriendUI, sizeChartUI, PersonalizationUI, HideRevealUI, InternationalShippingMsgUI, SuggestedProductsUI,
    // Helpers & Handlers UI
    NotificationUI, HandleModalsUI, HelpersUI, AnimationHandlerUI,
    BuildHelpersUI, BindEventsHelperUI, productWidgetParser, bellowsTmpl, stepperTmpl, ProductReviewsParser, RatingStarParser,
    ReviewsPaginationParser, PaginationTmpl, BellowsTmpl, ReviewTmpl, ReviewSignatureTmpl,
    BVSignatureParser, RatingStarTmpl, productImageUI, BazaarVoiceHandlerUI) {

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
        $('.bellows').bellows();
        // $('.magnifik').magnifik();
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

    var initProductWidgetDetailPinny = function() {
        $('body').on('click', '.js-product-detail-pinny', function() {
            var $self = $(this);

            var dataWidgetID = $self.attr('data-widget-id');
            var $productWidgetPinny = $('.' + dataWidgetID);

            if ($productWidgetPinny.parent('.pinny').length ) {
                $productWidgetPinny.pinny('open');
                return;
            }

            var productWidgetSheet = sheet.init($productWidgetPinny, {
                shade: {
                    opacity: 0.95,
                    color: '#fff'
                }
            });
            productWidgetSheet.open();
        });
    };

    var productWidget = function() {
        var bellowsData = productWidgetParser.parse($('.gwt-product-detail-widget'));
        bellowsTmpl({items: bellowsData}, function(err, renderedHtml) {
            if ($(renderedHtml).children().length > 0) {
                $('.c-product-widget-wrapper').removeAttr('hidden');
                $('.c-product-widget').html(renderedHtml);
                initPlugins();
            }

            var $stepper;
            stepperTmpl(true, function(err, renderedHtml) {
                $stepper = $(renderedHtml);
            });

            $('.c-product-widget').find('.js-widget-swatch').map(function(i, item) {
                var $self = $(item);
                var $options = $('.gwt-product-detail-widget-options-column')[i];
                var $quantity = $($options).next();
                $self.empty().append($options, $quantity);

                var $priceHolder = $self.find('.gwt-product-detail-widget-price-holder');

                // // TRAV-411: Change order of prices.
                var $priceNow = $priceHolder.find('.gwt-product-detail-widget-price-now');
                var $priceWas = $priceHolder.find('.gwt-product-detail-widget-price-was');
                $priceWas.before($priceNow);

                // TRAV-413: Prepare a second price container
                $self.find('.gwt-product-option-panel').children().eq(0).before('<div class="js-second-title-price"> <div class="js-second-title-price__price c-arrange"> </div> </div>');

                $self.find('.gwt-product-detail-widget-quantity-lbl').addClass('u-padding-left-tight c-product-detail-widget-label').after($stepper.clone());
                $self.find('.js-stepper-decrease').after($self.find('.gwt-product-detail-widget-quantity-panel-container'));
                $self.find('.gwt-product-detail-widget-options-column3').addClass('t-product-details__quantity c-box-row');
                $self.find('.csb-quantity-listbox').addClass('u-white');
                $self.find('.c-stepper').after($self.find('.gwt-product-detail-widget-title'));
                $self.closest('.bellows__content-wrapper').prev().find('.gwt-product-detail-widget-title')
                    .replaceWith($self.find('.gwt-product-detail-widget-price-holder'));

                // Shipping info and product link
                var $infoContainer = $('<div class="u-text-center u-margin-top-lgs">');
                $infoContainer.append($self.find('.gwt-product-detail-widget-options-column1 a'));
                $self.append($infoContainer);
            });
        });
        initProductWidgetDetailPinny();
    };

    var checkBoxWrapper = function() {
        $('.c-product-widget-wrapper').on('click', '.c-bellows__item', function() {
            var $this = $(this);
            $this.find('.c-checkbox').attr('checked', 'checked');
        });
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
                    BuildHelpersUI.buildAvaialabilityPanel($('.js-availability-info'), $('.gwt-product-detail-widget-single-availability-panel'));

                    //BazaarVoiceHandlerUI.transformReviewContent(Adaptive.$('#gwt-BVTabContainer'));
                    // Update DOM
                    HelpersUI.updateCTAs();
                    HelpersUI.updateMainImageSrc(Adaptive.$('.iwc-main-img-wrapper'));
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
                    productWidget();
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
                console.log(url);
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

    var buildReviewsBellows = function($reviewsContainer) {
        var $content = ProductReviewsParser.buildReviews($reviewsContainer);
        var $reviewsBellowsHeader = $('<span>');
        // review count isn't readily availble at this point, so there'll be a later function that will
        // update all review counts on the page
        $reviewsBellowsHeader.html('Reviews (<span class="js-review-count"></span>) <span class="js-overall-header-rating c-overall-header-rating"></span>');
        // append Read All and Write a Review links
        var $writeReviewLink = $('<button id="js-write-review" class="c-arrange__item c--shrink">');
        var $originalWriteButton = $reviewsContainer.find('.BVRRDisplayContentLinkWrite').find('a');
        $writeReviewLink.addClass('c-button c--link c--dark c--no-padding u-text-align-end').text('Review this product');

        var $reviewCount = $('<div class="t-product-details__product-review-count c-arrange__item u-padding-end-md">');
        $reviewCount.html('<span class="js-review-count"></span> Ratings');

        var $sortReviews = $reviewsContainer.find('.BVRRSortAndSearch');
        if ($reviewsContainer.find('.BVRRSortAndSearch').length > 0) {

            var $sortReviews = $reviewsContainer.find('.BVRRSortAndSearch');
            var $overallRatingImage = $('.BVRRRatingNormalImage:first').html();
            var $overallRatingText = $('.BVRRBuyAgainContainer:last').html();
            var $overallRatingNumber = $($overallRatingImage).attr('title').split('out')[0];
            var $overallRatingStars = RatingStarParser.parse($('#BVRRQuickTakeContentID .BVRRRatingNumber:first').text());
            var $overallRatingStarsImage = $('<div>');
            new RatingStarTmpl($overallRatingStars, function(err, html) {
                $overallRatingStarsImage.html(html);
            });
            var $overallRating =
                $('<div class="c-overall-rating u-border-neutral-40 u-padding"><span class="u--bold">Summary of Customer Ratings & Reviews</span><div class="u-margin-top-md c-rating-container">' +
                $overallRatingStarsImage.html() + '<div class="c-rating-count">' + $overallRatingNumber + '</div>' +
                '</div><div class="u-margin-top-md c-review__main">' + $overallRatingText + '</div>' + '</div>');

            $sortReviews.find('.BVRRDisplayContentSelect').wrap('<div class="c-select-wrapper c-select"></div>');
            $sortReviews.find('.BVRRSortSelectWidget').prepend('<span class="c-sort-by__label">Sort By</span>');
            $sortReviews.prepend($overallRating);

            var $reviewsTop = $('<div class="c-arrange c-review-container" />');
            $reviewsTop
                .append($reviewCount)
                .append($writeReviewLink);

            $content
                .prepend($sortReviews)
                .prepend($reviewsTop);

            var computerSVG = '<svg class="c-icon " data-fallback="img/png/computer.png"><title>Desktop</title><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-computer"></use></svg>';
            var $viewMore = $('<div class="t-product-details__check-desktop js-more-reviews-message u-margin-top-extra-lg" hidden>'
                + computerSVG
                + 'More reviews accessible from our desktop site</div>');
            $content.append($viewMore);
        } else {
            $content
                .append('<div class="js-write-first-review c-write-first-review"> Review this product </div>');
        }

        var bellowsItem = {
            sectionTitle: $reviewsBellowsHeader,
            content: $content
        };

        var data = {
            class: 'js-reviews-bellows u-border-top-remove c-reviews-bellows',
            items: bellowsItem,
            contentClass: 'u-padding-sides-0'
        };

        var $reviewsBellows = $('<div id="js-reviews-bellows" />');
        new BellowsTmpl(data, function(err, html) {
            var $reviews;
            $reviewsBellows.html(html);

            var $existingBellowsItem = $('#js-reviews-bellows');
            $('.c-bellows__list').find('iframe').parent().addClass('u-overflow-x');

            if ($existingBellowsItem.length) {
                $existingBellowsItem.find('.t-product-details__reviews-and-questions').replaceWith($reviewsBellows.find('.t-product-details__reviews-and-questions'));
            } else {
                $('.js-product-bellows').append($reviewsBellows);
            }

            $('.js-reviews-bellows').bellows();
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

    var updateWriteReviewLink = function($content) {
        // Update the write review link text.
        var $writeReview = $content.find('.BVRRRatingSummaryLinkWriteFirstPrefix').next();

        if ($writeReview.length) {
            $('.js-write-first-review').text($writeReview.text());
        }
    };


    var bindAddToCart = function() {
        $('.c-product-widget-wrapper').on('click', '.c-bellows__item', function() {
            var $this = $(this);
            var $parent = $this.parent();

            // This means the option is unchecked and we need to reset the qty value so
            // product won't get added to cart accidentally
            if (!$this.hasClass('bellows--is-opening') && !$this.hasClass('bellows--is-open')) {
                var $qtySelect = $this.find('.csb-quantity-listbox');
                var count = $qtySelect.find('option:first').val();

                $qtySelect.val(count).change();

                var evt = document.createEvent('HTMLEvents');
                evt.initEvent('change', false, true);
                $qtySelect[0].dispatchEvent(evt);
            }

            // Check if any of the options is checked and enable/disable the add to cart
            // button accordingly
            if ($parent.find('.bellows--is-opening, .bellows--is-open').length) {
                $('.js-enable-disable-button').find('button').removeClass('c--is-disabled');
            } else {
                $('.js-enable-disable-button').find('button').addClass('c--is-disabled');
            }
        });

        $('body').on('click', '.js-add-to-cart', function() {
            setTimeout(function() {
                var $error = $('.gwt-csb-error-panel');
                if ($error.length && $error.closest('.bellows__item:not(.bellows--is-open)').length) {
                    NotificationUI.triggerError($error);
                    $(document).trigger('addToCartError');
                }
            }, 500);
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
        //
        // bindThumbnails();
        // productImageUI.init();
        // changeRadioEvent();
        // pdpUtils.transformImageThumbnail();
        // pollForProductImage();
        // initHijax();
        // initBellows();
        //
        // HideRevealUI.init();
        //
        // var reviewSheet = sheet.init($('.js-product-review-pinny'));
        // var questionSheet = sheet.init($('.js-product-question-pinny'));
        // AnimationHandlerUI.bindAnimationListener();
        // HandleModalsUI.initSheets();
        // SuggestedProductsUI.init();
        // PersonalizationUI.init();
        // InternationalShippingMsgUI.init();
        // NotificationUI.init(true);
        // // TRAV-413: Leverage BindEventsHelperUI to populate second price
        // BindEventsHelperUI.bindProductImageOptionClick();
        // BindEventsHelperUI.bindCustomEvents();
        // bindAddToCart();
        // // paginationUI.init();
        //
        //
        // // Desktop Override
        // overrideShowErrors();
        // BazaarVoiceHandlerUI.init(reviewSheet, questionSheet);
    };

    return productDetailsUI;
});
