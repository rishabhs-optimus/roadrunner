define([
    '$',
    'global/baseView',
    'dust!pages/product-details-bundle/product-details-bundle',
    'global/utils/template-reader',
    'global/parsers/breadcrumb-parser',
    'pages/product-details/parsers/product-info-parser',
    'pages/product-details/parsers/product-tile-parser',
    'pages/product-details/parsers/product-share-parser',
    'global/parsers/related-searches-parser',
    'global/parsers/rating-star-parser',
    'dust!components/loading/loading',
    'descript',
],
function($, BaseView, template, JSONTemplate, Breadcrumb, ProductDetailParser,
    ProductTileParser, ProductShareParser, RelatedSearchesParser, RatingStarParser, LoadingTmpl, Descript) {

    var $facebookPdp = $('<svg class="c-icon" data-fallback="img/png/facebook.png"><title>facebook</title><use xlink:href="#icon-facebook"></use></svg>');
    var $twitterPdp = $('<svg class="c-icon" data-fallback="img/png/twitter.png"><title>twitter</title><use xlink:href="#icon-twitter"></use></svg>');
    var $pinterestPdp = $('<svg class="c-icon" data-fallback="img/png/pinterest.png"><title>pinterest</title><use xlink:href="#icon-pinterest"></use></svg>');
    var $googlePlusPdp = $('<svg class="c-icon" data-fallback="img/png/googleplus.png"><title>googleplus</title><use xlink:href="#icon-googleplus"></use></svg>');
    var $emailMessagePdp = $('<svg class="c-icon" data-fallback="img/png/email.png"><title>email</title><use xlink:href="#icon-email"></use></svg>');

    var bulidTabNameDictionary = function(pdpJSON) {
        var tabNames = {};
        // build tab name dictionary from JSON data
        $(pdpJSON.pageProduct.productAdditionalInfoTabs).filter(function() {
            return !!(this.tabName);
        }).each(function() {
            var tab = this;
            var id = tab.tabIdentifier.replace(/Tab Name/, 'Tab');
            if (tab.tabName.indexOf('Pacsafe') > 0) {
                tabNames[id] = 'Pacsafe Features';
            } else {
                tabNames[id] = tab.tabName;
            }
        });

        return tabNames;
    };

    var _updateMeasurementImg = function($tabContent) {
        var $popupLink = $tabContent.find('a');
        var newImage = $popupLink.attr('data-mobify-src');

        if (newImage) {
            var oldImageMatch = /'(\/.*\.gif)'/.exec($popupLink.attr('onclick'));
            if (oldImageMatch) {
                var newOnClick = $popupLink.attr('onclick').replace(oldImageMatch[1], newImage);
                $popupLink.attr('onclick', newOnClick);
            }
        }

    };

    var _decorateTabContents = function($tabContent) {
        if (!$tabContent.length) {
            return;
        }

        if ($tabContent.find('[onclick*="popups/measure"]').length) {
            _updateMeasurementImg($tabContent);
        }

        $tabContent.find('ul').addClass('c-list-bullets');
        $tabContent.find('a').addClass('needsclick');
        $tabContent.find('[href="#"]').removeAttr('href');
        $tabContent.find('br').remove();

        $tabContent.contents().filter(function() {
            return this.nodeType === 3;
        }).wrap('<p>');
    };

    var _appendTabItemsToBellows = function(_items, pdpJSON, tabNameDictionary) {
        // parse tab items into bellows items
        $(pdpJSON.pageProduct.productAdditionalInfoTabs).filter(function() {
            return !!(this.tabHtmlValue);
        }).each(function() {
            var tab = this;
            var $content = $('<div>');
            $content.html($('<div/>').html(tab.tabHtmlValue).text());

            _decorateTabContents($content);

            _items.push({
                sectionTitle: tabNameDictionary[tab.tabIdentifier],
                content: $content
            });
        });
    };

    var _findVideoData = function(pdpJSON) {
        var videoData = {};
        $.each(pdpJSON.pageProduct.descriptiveAttributes, function(_, attribute) {
            if (/video url/i.test(attribute.name)) {
                videoData.url = $('<div/>').html(attribute.value).text();
            } else if (/video.*image/i.test(attribute.name)) {
                videoData.image = attribute.value;
            }
        });
        return videoData;
    };

    return {
        template: template,
        extend: BaseView,

        preProcess: function(context) {
            if (BaseView.preProcess) {
                context = BaseView.preProcess(context);
            }
        },

        context: {
            templateName: 'product-details-bundle',
            hiddenData: function() {
                var $container = $('<div>');
                var $hiddenForm = $('form.hidden').remove();
                var $hiddenInputs = $('input[type="hidden"]');

                $container
                    .append($('.view-ProductDetailView'))
                    .append($hiddenInputs)
                    .append($hiddenForm);

                var $desktopDataContainer = $container.find('#gwt_bundledetail_json');

                var bundleJSON = JSONTemplate.parse($desktopDataContainer);
                var pdpJSON = bundleJSON.bundle[0];

                return {
                    container: $container,
                    pdp: $desktopDataContainer.remove(),
                    // used for other parsers below
                    JSONData: pdpJSON,
                    bundleData: bundleJSON,
                    videoData: _findVideoData(pdpJSON)
                };
            },
            breadcrumbs: function(context) {
                return {
                    breadcrumbLink: Breadcrumb.parseTranslated(context.hiddenData.container.find('#breadcrumbs_ul'))
                };
            },
            mainImage: function(context) {
                if (context.hiddenData.bundleData.bundleMfPartNumber !== 'null') {
                    return 'http://travelsmith.scene7.com/is/image/travelsmith/' + context.hiddenData.bundleData.bundleMfPartNumber + '?$product_main_V2$';
                }
                return 'http://travelsmith.scene7.com/is/image/travelsmith/' + context.hiddenData.JSONData.pageProduct.mfPartNumber + '_main?$product_main_V2$';
            },
            thumbnails: function(context) {
                var thumbnails =  {
                    slideshow: {
                        slides: [
                            {
                                slideContent: $('<img>').attr('src', context.mainImage)
                            }
                        ],
                        class: 'c--small'
                    }
                };

                if (context.hiddenData.videoData.image) {
                    thumbnails.slideshow.slides.push({
                        slideContent: $('<img>').attr('src', context.hiddenData.videoData.image),
                        class: 'js-video-thumbnail'
                    });
                }

                return thumbnails;
            },
            productInfo: function(context) {

                var pdpJSON = context.hiddenData.JSONData;
                var bundleJSON = context.hiddenData.bundleData;
                var title;
                $('p:empty').remove();

                if (bundleJSON) {
                    title = bundleJSON.bundleName;
                }
                return {
                    title: title || ProductDetailParser.parseTitle(pdpJSON.pageProduct),
                    // TRAV-348: Set review count to 0 initially while we wait for BV content to load in
                    starRating: {
                        modifierClasses: 'c--center',
                        rating: 0,
                        ratingStar: RatingStarParser.parse(0),
                        reviews: 0
                    },
                    skuId: pdpJSON.pageProduct.mfPartNumber,
                    shortDesciption: pdpJSON.pageProduct.shortDesc,
                    readMore: $('<p/>').html($('<div/>').html(pdpJSON.pageProduct.longDesc).text()).text().trim(),
                };
            },
            detailsContent: function(context) {
                return {
                    bodyContent: $('<p/>').html($('<div/>').html(
                        context.hiddenData.JSONData.pageProduct.longDesc
                    ).text())
                };
            },
            productTabs: function(context) {

                var pdpJSON = context.hiddenData.JSONData;
                var _items = [];

                var tabNames = bulidTabNameDictionary(pdpJSON);

                // _appendTabItemsToBellows(_items, pdpJSON, tabNames);

                // Change social icon for share this as per TRAV-182
                var $shareThisContainer = context.hiddenData.container.find('#social_plugins_wwcm');
                $shareThisContainer.find('.socialIconFacebook').html($facebookPdp);
                $shareThisContainer.find('.socialIconTwitter').html($twitterPdp);
                $shareThisContainer.find('.socialIconPinterest').html($pinterestPdp);
                $shareThisContainer.find('.socialIconGoogle').html($googlePlusPdp);
                $shareThisContainer.find('.socialIconEmail').html($emailMessagePdp);

                // Append Social share icons in Bellows
                _items.push({
                    sectionTitle: 'Share',
                    content: context.hiddenData.container.find('#social_plugins_wwcm').addClass('c-social-link-share').removeClass('nodisplay')
                });

                _items.push({
                    sectionTitle: $('<div class="c-review-head js-review-head">Product Reviews</div>'),
                    bellowsItemClass: 'js-reviews-bellows c-reviews-bellows'
                });

                var _bellows = {
                    class: 'js-product-bellows',
                    items: _items
                };

                return {
                    bellows: _bellows
                };
            },
            recentlyViewedProducts: function(context) {
                var $dataSourceContainer = context.hiddenData.container.find('#gwt_recently_viewed');
                if (!$dataSourceContainer.length) {
                    return;
                }
                var currencyConversion = context.hiddenData.container.find('#gwt_international_conversion_rate').val();
                var JSONData = JSONTemplate.parse($dataSourceContainer);

                if (!JSONData || !JSONData.products) {
                    return;
                }

                var parsedProducts = JSONData.products.map(function(product, _) {
                    return ProductTileParser.parseFromJSON(product, currencyConversion);
                });

                var scrollerData = {
                    slideshow: {
                        productTiles: parsedProducts
                    }
                };

                return scrollerData;
            },
            tellAFriendContainer: function() {
                return $('<div class="js-taf-content c-taf-content">');
            },
            moreInformationContainer: function() {
                return $('<div class="js-more-information-content">');
            },
            personalizationContainer: function() {
                return $('<div class="js-personalization-content t-product-details__personalize-content">');
            },
            suggestions: function(context) {
                return RelatedSearchesParser.parse(context.hiddenData.container.find('#br-related-searches-widget'));
            },
            magnifikImage: function(context) {
                var $container;
                new LoadingTmpl(true, function(err, html) {
                    $container = $(html);
                });
                return {
                    bodyContent: $($container[0].outerHTML + '<img class="js-magnifik-image c-magnifik-image" src=""/>')
                };
            }
        }
    };
});
