define([
    '$',
    'translator',
    'components/hide-reveal/hide-reveal-ui',
    'dust!components/loading/loading',
    'dust!pages/product-details/partials/product-reviews',
    'dust!pages/product-details/partials/question-answer-modal',
    'pages/product-details/parsers/product-reviews-parser',
    'pages/product-details/parsers/product-qa-parser',
    'dust!pages/product-details/partials/ratings-breakdown',
    'global/parsers/rating-star-parser',
    'dust!components/bellows/bellows',
    'dust!components/star-rating/star-rating',
    'components/review-voter/review-voter-ui',
    'global/utils',
    'scrollTo'
], function($, Translator, hideRevealUI, LoadingTmp1, ProductReviewsTmpl, ProductQATmpl, ProductReviewsParser, ProductQAParser, RatingsBreakdownTmpl, RatingStarParser, BellowsTmpl, StarRatingTmpl, ReviewVoterUI, Utils) {
    var $reviewSheet;
    var $questionSheet;

    var bindQuestionEvents = function() {
        $('.js-answer-question-button').on('click', function(e) {
            var $question = $(e.target).parents('.c-question-tile');
            var $bvQuestion = $('#' + $question.data('target'));
            var originalLink = $bvQuestion.find('.BVQAAnswerQuestion a')[0];

            // The onclick handler only fires if we click it twice for some reason
            originalLink.click();
            originalLink.click();
        });

        // Update the voter for each answer shown,
        // as not all of the classes we needed were available on load
        $('body').on('click', '.js-question-header', function(e) {
            var $this = $(this);
            var $question = $(this).next().find('.c-question-tile');
            var $bvQuestion = $('#' + $question.data('target'));

            var $bvAnswers = $bvQuestion.find('.BVQAAnswer');

            $bvAnswers.each(function(_, answer) {
                var $bvAnswer = $(answer);
                var $answer = $question.find('[data-target="' + $bvAnswer.attr('id') + '"]');

                ReviewVoterUI.updateVote($bvAnswer, $answer);
            });
        });

        ReviewVoterUI.init();
    };

    var populateReviewsContent = function($reviewsContainer) {
        var rating = $reviewsContainer.find('.BVRRRatingNormalOutOf .BVRRRatingNumber').first().text();        var $reviewBellowsContent = $('.js-reviews-bellows .bellows__content');
        var $reviewModalContent = $('.js-product-review-pinny').find('.pinny__content');

        // Get markup of non modal product reviews
        new ProductReviewsTmpl(ProductReviewsParser.parse($reviewsContainer, false), function(_, out) {
            $reviewBellowsContent.html(out);
        });
        //hide more than four reviews if any
        $reviewBellowsContent.find('article').map(function(i, item) {
            var $item = $(item);
            if (i > 3) {
                $item.addClass('u-visually-hidden');
            }
        });
        // Get markup of modal product reviews
        new ProductReviewsTmpl(ProductReviewsParser.parse($reviewsContainer, true), function(_, out) {
            $reviewModalContent.html(out);
        });

        $('.js-reviews-bellows').bellows();
        $('.js-refine-bellows').bellows();
        hideRevealUI.manageHideReveal($('.c-review-card'));
    };

    var populateQAContent = function($qaContainer) {
        var $questionsBellowsContent = $('.js-qa-bellows .bellows__content');
        var $questionsModalContent = $('.js-product-question-pinny').find('.pinny__content');

        // Get markup of non modal product questions
        new ProductQATmpl(ProductQAParser.parse($qaContainer, false), function(_, out) {
            $questionsBellowsContent.html(out);
        });

        // Get markup of modal product questions
        new ProductQATmpl(ProductQAParser.parse($qaContainer, true), function(_, out) {
            $questionsModalContent.html(out);
        });

        $('.js-question-bellows').bellows({
            open: function(e, ui) {
                ui.item.find('.c-question-tile__answer-count').attr('hidden', 'hidden');
                ui.item.find('.c-question-tile__date').removeAttr('hidden');
            },
            close: function(e, ui) {
                ui.item.find('.c-question-tile__answer-count').removeAttr('hidden');
                ui.item.find('.c-question-tile__date').attr('hidden', 'hidden');
            }
        });
        $('.js-product-question-pinny .pinny__title').html($('.js-qa-head').first().clone());

        bindQuestionEvents();
    };

    var _updateReviewVotingStates = function() {
        var $reviewsModal = $('.js-product-review-pinny');

        // must check with desktop for active states on reviews since they're done dynamically
        $('.js-desktop-pdp').find('.BVRRContentReview').each(function(_, review) {
            var $desktopReview = $(review);
            var $modalReview = $reviewsModal.find('article[data-desktop-id="' + $desktopReview.attr('id') + '"]');

            // check state for helpful review
            if ($desktopReview.find('.BVRRReviewFeedbackLinkYes').hasClass('BVRRHidden')) {
                $modalReview.find('.js-helpful').removeClass('c--active').prop('disabled', true);
            }
            // check state for non helpful review
            if ($desktopReview.find('.BVRRReviewFeedbackLinkNo').hasClass('BVRRHidden')) {
                $modalReview.find('.js-not-helpful').removeClass('c--active').prop('disabled', true);
            }
            // check state for inappropriate review
            if ($desktopReview.find('.BVRRReviewFeedbackLinkInappropriate').hasClass('BVRRHidden')) {
                $modalReview.find('.js-offensive').removeClass('c--active').prop('disabled', true);
            }
        });
    };

    var _bindBVModuleLoad = function() {
        // BV requires in an "injection" module, which is responsible for setting .innerHTML = content
        // this will be equivalent to our hooks to Ajax calls where we can either take the content
        // or do our transformations after the .inject() runs
        var _override = window.$BV.Internal.define;
        window.$BV.Internal.define = function(a, b, c, moduleObject) {
            if (/^(injection)$/ig.test(arguments[0])) {
                var _moduleObject = moduleObject;
                moduleObject = function() {
                    _moduleObject.apply(this, arguments);

                    var _injectFunc = arguments[1].inject;
                    arguments[1].inject = function() {
                        _injectFunc.apply(this, arguments);

                        var appendToID = arguments[1];
                        var content = arguments[0];

                        if (/BVRRContainer/ig.test(appendToID)) {
                            // take the transformed container instead of the hidden desktop one
                            if ($(content).children().length > 0) {
                                populateReviewsContent(Adaptive.$(content));
                                // Utils.hideLoadingSpinner();

                                // Populate review elements at top of page
                                var $reviewCount = $(content).find('.BVRRCount span').first();

                                if ($reviewCount.length) {
                                    var productReviewsTitle = 'Product Reviews (' + $reviewCount.text() + ')';

                                    $('.js-review-head').text(productReviewsTitle);
                                    $('.js-product-review-pinny .pinny__title').text(productReviewsTitle);
                                    $('.js-review-this').text($reviewCount.text() + ' ' + Translator.translate('review_this'));
                                }
                                $('.js-overview-rating').html($('.js-overall-rating').first().find('.c-star-ratings__container').clone());
                            } else {
                                $('.js-reviews-bellows .bellows__content').html($('<div>Be the first to <span class="js-write-first-review u-text-underline">write a review</span></div>'));
                                $('.js-review-this').text('0' + '  ' + 'Reviews');

                            }

                            // Have to check with desktop markup the states of the reviews voting since they're done dynamically with BV api,
                            // don't have a hook for this so we'll just have to wait a second and a half and hope its ready by then..
                            setTimeout(_updateReviewVotingStates, 1500);
                        }

                        if (/BVQAContainer/ig.test(appendToID)) {
                            if ($(content).find('.BVQANoQuestions').length === 0) {
                                populateQAContent(Adaptive.$(content));
                                // Utils.hideLoadingSpinner();

                                var $questionCount = $(content).find('.BVQACount span').first();

                                if ($questionCount.length) {
                                    $('.js-qa-head').text('Product Q&A (' + $questionCount.text() + ')');
                                }
                            } else {
                                $('.js-qa-bellows .bellows__content').html($('<div>Be the first to <span class="js-write-first-question u-text-underline">ask a question</span></div>'));
                            }
                        }
                    };
                };
            }
            var e = _override(a, b, c, moduleObject);

            return e;
        };
    };

    var displayLoader = function() {
        new LoadingTmp1(true, function(err, html) {
            $(html).find('.u-visually-hidden').removeClass('u-visually-hidden');
            $('.js-product-reviews').html($(html));
        });
    };

    var _bindBVReviews = function() {
        var $body = $('body');

        $body.on('click', '.js-write-review', function(e) {
            e.preventDefault();
            $('#BVRRContainer').find('.BVRRDisplayContentLinkWrite a')[0].click();
        });

        $body.on('click', '.js-see-all-reviews', function() {
            $('.js-product-review-pinny').pinny('open');
        });

        $body.on('click', '.js-see-all-questions', function() {
            $('.js-product-question-pinny').pinny('open');
        });

        $body.on('click', '.js-ask-question', function(e) {
            var askQuestionButton = $('#BVQAContainer').find('#BVQAAskQuestionID a')[0];

            // Needs to be clicked twice for the onclick handler to fire
            askQuestionButton.click();
            askQuestionButton.click();
        });

        $body.on('change', '.js-product-reviews-select', function() {
            displayLoader();
            var $this = $(this);
            $('.BVRRSelect').val($this.find('option:selected').attr('value')).change();
        });

        $body.on('change', '.js-product-questions-select', function() {
            displayLoader();
            var $this = $(this);
            $('.BVQAToolbarSortSelect').val($this.find('option:selected').attr('value')).change();
        });

        $body.on('click', '.js-product-reviews-prev', function() {
            displayLoader();
            $('.BVRRPreviousPage a')[0].click();
            $reviewSheet.scrollToTop();
        });

        $body.on('click', '.js-product-reviews-next', function() {
            displayLoader();
            $('.BVRRNextPage a')[0].click();
            $reviewSheet.scrollToTop();
        });

        $body.on('click', '.js-product-questions-prev', function() {
            displayLoader();
            $('.BVQAPreviousPage a')[0].click();
            $questionSheet.scrollToTop();
        });

        $body.on('click', '.js-product-questions-next', function() {
            displayLoader();
            $('.BVQANextPage a')[0].click();
            Utils.showLoadingSpinner();
            $questionSheet.scrollToTop();
        });

        $body.on('change input keyup', '.js-questions-search', function() {
            $('#BVQASearchFormTextInputID').val($('.js-questions-search').val());
        });

        $body.on('submit', '.js-questions-search-form', function(e) {
            e.preventDefault();
            $('#BVQASearchFormSubmitButtonID')[0].click();
            Utils.showLoadingSpinner();
        });

        $body.on('click', '.js-questions-search-submit', function() {
            $('#BVQASearchFormSubmitButtonID')[0].click();
            Utils.showLoadingSpinner();
        });

        $body.on('click', '.js-close-search', function() {
            // Also needs to be clicked twice to fire...
            $('#BVQAPageTabBrowseID')[0].click();
            $('#BVQAPageTabBrowseID')[0].click();
            Utils.showLoadingSpinner();
        });

        $('.js-product-question-pinny .pinny__close').on('click', function() {
            // Reset the questions
            // Remove any search and go back to the first page
            $('#BVQAPageTabBrowseID')[0].click();
            $('#BVQAPageTabBrowseID')[0].click();
            $('.BVQAPageLink.BVQAPageNumber [title="1"]')[0].click();
        });

        $body.on('click', '.js-refine-option', function() {
            var $clickedEle = $(this);
            var $container = $clickedEle.closest('div');
            var containerClass = $container.data('desktopclass');
            var $desktopFilter = $('.js-desktop-pdp .' + containerClass).find('.BVRRTagFilter a').filter(function() {
                return $(this).text() === $clickedEle.parent().clone().find('span').remove().end().text().trim();
            });

            // fastclick seems to be bugging out clicking on these filters, we need to fire a click on a element that does nothing
            // first to get the click on the actual filter to fire properly
            $desktopFilter.parent()[0].click();
            $desktopFilter[0].click();

            Utils.showLoadingSpinner();
        });

        $body.on('click', '.js-review-this, .js-view-reviews', function() {
            var $reviewsBellows = $('.js-reviews-bellows');
            // Scroll to Reviews Bellows
            $.scrollTo($reviewsBellows);
            // Open Bellows for Reviews and Rating
            // This is required as SVG icon was not changing on call of Bellows open method
            if (!$reviewsBellows.hasClass('bellows--is-open')) {
                $reviewsBellows.find('.bellows__header').click();
            }
        });

        $body.on('click', '.js-write-first-review', function() {
            // fast click issue, need two clicks to trigger, so we'll send a click to a element which has no events on first
            $('.BVRRRatingSummaryLinkWriteFirst span')[0].click();
            $('.BVRRRatingSummaryLinkWriteFirst a')[0].click();
        });

        $body.on('click', '.js-write-first-question', function() {
            // fast click issue, need two clicks to trigger, so we'll send a click to a element which has no events on first
            $('.BVQANoQuestions .BVQATitle')[0].click();
            $('.BVQANoQuestions a')[0].click();
        });

        $body.on('click', '.js-helpful, .js-not-helpful, .js-offensive', function() {
            var $this = $(this);
            var $desktopEle = $('#' + $this.closest('article').data('desktop-id'));

            if (!$this.hasClass('c--active')) {
                return;
            }

            if ($this.hasClass('js-helpful')) {
                // fast click issue, need two clicks to trigger, so we'll send a click to a element which has no events on first
                $desktopEle.find('.BVRRReviewFeedbackLinkYes')[0].click();
                $desktopEle.find('.BVRRReviewFeedbackLinkYes a')[0].click();
            } else if ($this.hasClass('js-not-helpful')) {
                // fast click issue, need two clicks to trigger, so we'll send a click to a element which has no events on first
                $desktopEle.find('.BVRRReviewFeedbackLinkNo')[0].click();
                $desktopEle.find('.BVRRReviewFeedbackLinkNo a')[0].click();
            } else if ($this.hasClass('js-offensive')) {
                // fast click issue, need two clicks to trigger, so we'll send a click to a element which has no events on first
                $desktopEle.find('.BVRRReviewFeedbackLinkInappropriate')[0].click();
                $desktopEle.find('.BVRRReviewFeedbackLinkInappropriate a')[0].click();
            }
        });
    };

    var init = function(reviewSheet, questionSheet) {
        $reviewSheet = reviewSheet;
        $questionSheet = questionSheet;

        _bindBVModuleLoad();
        _bindBVReviews();
    };

    return {
        init: init
    };
});
