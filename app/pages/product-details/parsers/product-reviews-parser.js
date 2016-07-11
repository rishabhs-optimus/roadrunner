define([
    '$',
    'dust!components/refine/refine',
    'global/parsers/rating-star-parser'
], function($, refineTemplate, RatingStarParser) {

    var $ratingsBreakdown;
    var $selectOptions;
    var $refineFilters;
    var $activeFilters;
    var $paginationCurrPage;
    var $paginationNextPage;
    var overAllRatingStars;
    var qualityRatingStars;
    var valueRatingStars;
    var secondaryRatingStars;

    // A little confusing here as we're mapping so the index we're passing it
    // here isn't going to count down from 5-1, instead  maps forward and is
    // 0 indexed thus: 0 = 5, 1 = 4, 2 = 3, 3 = 2, 4 = 1
    var _mapRatingOverviewStars = function(numStars) {
        if (numStars === 0) {
            return {
                justStars: true,
                ratingStar: [{ratingFilled: true}, {ratingFilled: true}, {ratingFilled: true}, {ratingFilled: true}, {ratingFilled: true}]
            };
        } else if (numStars === 1) {
            return {
                justStars: true,
                ratingStar: [{ratingFilled: true}, {ratingFilled: true}, {ratingFilled: true}, {ratingFilled: true}]
            };
        } else if (numStars === 2) {
            return {
                justStars: true,
                ratingStar: [{ratingFilled: true}, {ratingFilled: true}, {ratingFilled: true}]
            };
        } else if (numStars === 3) {
            return {
                justStars: true,
                ratingStar: [{ratingFilled: true}, {ratingFilled: true}]
            };
        } else {
            return {
                justStars: true,
                ratingStar: [{ratingFilled: true}]
            };
        }
    };

    var _getOverallRatingStars = function(stars) {

        if (stars.length) {
            // if rating = 3.4, i need [{filled}, {filled}, {filled}, {halfFilled}]
            var rating = parseFloat(stars);

            return {
                rating: rating,
                ratingStar: RatingStarParser.parse(rating),
            };
        }

        if (!stars.length) {
            var rating = 0;
            return {
                rating: rating,
                ratingStar: RatingStarParser.parse(rating),
            };
        }
    };


    var _getRefineMarkup = function($reviewsContainer) {
        var $refineMarkup;
        var refineData = {
            refine: $reviewsContainer.find('.BVRRQuickTakeContainer').map(function(_, container) {
                var $container = $(container);
                var $refineOptions = $container.find('li.BVRRTagFilter').map(function(_, filter) {
                    var $filter = $(filter);

                    return {
                        refineText: $filter.find('a').text(),
                        refineNumber: $filter.find('.BVRRNote').text(),
                        checked: $filter.hasClass('BVRRTagFilterOn')
                    };
                });

                return {
                    title: $container.find('.BVRRQuickTakeLabel').clone().find('span').remove().end().text(),
                    desktopClass: $container.clone().removeClass('BVRRQuickTakeContainer').attr('class'),
                    refineOptions: $refineOptions
                };
            })
        };

        refineTemplate(refineData, function(_, out) {
            $refineMarkup = $(out);
        });

        return $refineMarkup;
    };

    var parse = function($reviewsContainer, isModal) {
        var $reviews = $reviewsContainer.find('.BVRRContentReview').map(function(_, review) {
            var $review = $(review);
            var reviewDescription = $review.find('span.BVRRReviewText');
            var $reviewNumbers = $review.find('.BVRRReviewFeedbackSummaryContainer .BVRRNumber');
            var helpfulReviews = $reviewNumbers.first().text();
            var totalReviews = $reviewNumbers.last().text();
            var SecondaryStarConatiner = $review.find('.BVRRSecondaryRatingsContainer');
            var reviewsOverAllStars = $review.find('.BVRROverallRatingContainer').find('.BVRRRatingNumber').text();
            var reviewsQualityStars = SecondaryStarConatiner.find('.BVRRRatingQuality').find('.BVRRRatingNumber').text();
            var reviewsValueStars = SecondaryStarConatiner.find('.BVRRRatingValue').find('.BVRRRatingNumber').text();
            var sliderValue = $review.find('.BVRRRatingContainerSlider .BVRRRatingSliderImage').find('img').attr('src');
            var widthValue = typeof (sliderValue) !== 'undefined' ? sliderValue.match(/[1-5]/g)[0] : 0;
            var widthPercent;
            if (widthValue > 0) {
                widthPercent = widthValue * 20;
            }
            return {
                class: 'u-margin-top',
                desktopId: $review.attr('id'),
                reviewAuthor: $review.find('.BVRRNickname').parent(),
                reviewDate: $review.find('.BVRRReviewDate').first().text(),
                topContributorsMsg: $review.find('.BVRRBadge.BVRRReviewBadge'),
                reviewTitle: $review.find('.BVRRReviewTitle').text(),
                desc: {
                    bodyContent: reviewDescription,
                    class: 'u-padding-none u-margin-bottom-md'
                },
                reviewPros: $review.find('.BVRRReviewProsContainer').text(),
                reviewCons: $review.find('.BVRRReviewConsContainer').text(),
                footer: isModal,
                starRating: _getOverallRatingStars(reviewsOverAllStars),
                qualityRating: _getOverallRatingStars(reviewsQualityStars),
                valueRating: _getOverallRatingStars(reviewsValueStars),
                sizeSlider: $review.find('.BVRRRatingContainerSlider .BVRRRatingSliderImage'),
                widthPercent : widthPercent,
                numberHelpful: $reviewNumbers.length ? '(' + helpfulReviews + ')' : '(0)',
                numberNotHelpful: $reviewNumbers.length ? '(' + (totalReviews - helpfulReviews) + ')' : '(0)'
            };
        });

        $ratingsBreakdown = $reviewsContainer.find('.BVRRHistogramBarRow').map(function(idx, row) {
            var $row = $(row);

            return {
                percentage: $row.find('.BVRRHistAbsLabel').text(),
                numStars: $row.find('.BVRRHistStarLabelText').text(),
                stars: _mapRatingOverviewStars(idx)
            };
        });

        $selectOptions = $reviewsContainer.find('.BVRRSortAndSearch .BVRRDisplayContentSelect option').map(function(_, option) {
            var $option = $(option);

            return {
                optVal: $option.attr('value'),
                selected: $option.prop('selected'),
                text: $option.text(),
            };
        });

        $activeFilters = $reviewsContainer.find('.BVRRTagFilterOn');

        if ($reviewsContainer.find('.BVRRQuickTakeContainer').length) {
            $refineFilters = {
                class: 'js-refine-bellows c--light c--bordered u-margin-bottom-md',
                bellowsItemClass: 'u-no-border',
                items: {
                    sectionTitle: $activeFilters.length ? 'Refine ' + $activeFilters.first().find('.BVRRNote').text() : 'Refine',
                    itemOptions: {
                        isOpen: $('.js-refine-bellows').find('.bellows--is-open').length ? true : false
                    },
                    bellowsContent: _getRefineMarkup($reviewsContainer)
                }
            };
        }

        $paginationCurrPage = $reviewsContainer.find('.BVRRSelectedPageNumber');
        $paginationNextPage = $reviewsContainer.find('.BVRRPageNumber').last();
        overAllRatingStars = $reviewsContainer.find('.BVRRPrimaryRatingSummary .BVRROverallRatingContainer').find('.BVRRRatingNumber').text();
        secondaryRatingStars = $reviewsContainer.find('.BVRRPrimaryRatingSummary .BVRRSecondaryRatingsContainer');
        qualityRatingStars = secondaryRatingStars.find('.BVRRRatingQuality').find('.BVRRRatingNumber').text();
        valueRatingStars = secondaryRatingStars.find('.BVRRRatingValue').find('.BVRRRatingNumber').text();
        var sliderValue = $reviewsContainer.find('.BVRRRatingContainerSlider .BVRRRatingSliderImage').find('img').attr('src');
        var widthValue = typeof (sliderValue) !== 'undefined' ? sliderValue.match(/[1-5]/g)[0] : 0;
        var widthPercent;
        if (widthValue > 0) {
            widthPercent = widthValue * 20;
        }
        return {
            ratingsBreakdown: isModal ? false : {
                info: $ratingsBreakdown
            },
            reviews: $reviews,
            showModalBtn: !isModal,
            hr: !isModal,
            overallRating: _getOverallRatingStars(overAllRatingStars),
            filters: isModal,
            selectOptions: $selectOptions.length ? $selectOptions : '',
            pagination: isModal,
            isModal: isModal,
            currPage: $paginationCurrPage.length ? $reviewsContainer.find('.BVRRSelectedPageNumber').text() : '1',
            numPages: $paginationNextPage.length ? $reviewsContainer.find('.BVRRPageNumber').last().text() : '1',
            disableNext: $reviewsContainer.find('.BVRRNextPage').length ? false : true,
            disablePrev: $reviewsContainer.find('.BVRRPreviousPage').length ? false : true,
            refineFilters: $refineFilters,
            qualityRating: _getOverallRatingStars(qualityRatingStars),
            valueRating: _getOverallRatingStars(valueRatingStars),
            sizeSlider: $reviewsContainer.find('.BVRRRatingContainerSlider .BVRRRatingSliderImage'),
            widthPercent : widthPercent

        };
    };

    return {
        parse: parse
    };
});
