define(['$', 'translator'], function($, Translator) {

    // Modify text of options title ex - color, size etc to select a color, select a size
    var transformProductOptionsTitle = function($productOptionsTitle) {
        $productOptionsTitle.each(function(_, title) {
            var $title = $(title);
            var title = $title.text();
            if (!title.match(/select/i)) {
                $title.text(Translator.translate('select_a') + title.replace(':', ''));
            }

        });
    };

    var transformImageThumbnail = function() {
        var $pdpCarouselContent = $('#gwt-product-detail-left-panel');
        $pdpCarouselContent.find('.carousel').addClass('c-scroller__content');
        $pdpCarouselContent.find('.tilePanel').addClass('c-slideshow');
        $pdpCarouselContent.find('.iwc-thumbs-panel').addClass('c-scroller');
        $pdpCarouselContent.find('.carouselTile')
            .addClass('c-slideshow__slide');
        $pdpCarouselContent.find('.iwc-imagePanel').append('<span class="c-product-image__zoom-icon"></span>');
        $('.c-product-image__zoom-icon').html('<svg class="c-icon" data-fallback="img/png/zoom.png"><title>zoom</title><use xlink:href="#icon-zoom"></use></svg>');

        $pdpCarouselContent.find('.iwc-thumb-img').each(function(_, item) {
            var $item = $(item);
            var src = $item.attr('src');
            if (src && !/videothumb/.test(src)) {
                var highQualityImgSrc = $item.attr('src') + '$wgis$';
                $item.attr('src', highQualityImgSrc);
            }
        });

        // Modify text of options title ex - color, size etc
        transformProductOptionsTitle($('.gwt-product-options-panel-option-title'));
        // .html(function(i, oldHtml) {
        //     return (oldHtml.indexOf('Select') > -1) ? oldHtml : 'Select ' + oldHtml;
        // });
    };

    var centerZoomImg = function() {
        var $zoomImg = $('.js-magnifik-image');
        var loaded = function() {
            var width = $('.c-magnifik').prop('offsetWidth') / 2;
            $('.c-loading').hide();
            $zoomImg.fadeIn();
            $('.c-magnifik').prop('scrollLeft', width);
        };

        if ($zoomImg[0].complete) {
            loaded();
        } else {
            $zoomImg[0].addEventListener('load', loaded);
        }
    };

    var Utils = {
        transformImageThumbnail: transformImageThumbnail,
        centerZoomImg: centerZoomImg
    };

    return Utils;
});
