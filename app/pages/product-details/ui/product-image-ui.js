define([
    '$'
], function(
    $
) {
    var mainImageSetInitialized = false;

    var removeDuplicates = function(list) {
        var uniques = [];
        $.each(list, function(i, el) {
            if ($.inArray(el, uniques) === -1) {
                uniques.push(el);
            }
        });
        return uniques;
    };

    var parseImageSet = function(imageString) {
        var images = imageString.split(/[,;]/);
        return removeDuplicates(images);
    };

    var buildImageCarousel = function(imgData) {
        if (mainImageSetInitialized) {
            return;
        }

        mainImageSetInitialized = true;

        var images = parseImageSet(imgData[0].IMAGE_SET);

        if (images[0] === '') {
            return;
        }

        // remove duplicated images
        var formattedImages = images.filter(function(img) {
            return $('.js-product-image img[src="' + img.imageSrc + '"]').length === 0;
        });

        var $thumbnailContainer = $('.js-product-image-thumbnails .c-slideshow');
        $thumbnailContainer.addClass('c--small');
        $.each(formattedImages, function(_, imageUrl) {
            if (!$thumbnailContainer.find('img[src*="' + imageUrl + '"]').length) {
                var $slide = $('<li class="c-slideshow__slide">');
                $slide.append($('<img>').attr('src', 'http://travelsmith.scene7.com/is/image/' + imageUrl + '?$product_add_image$$wgis$'));
                $thumbnailContainer.append($slide);
            }
        });
    };

    var bindS7JsonResponse = function() {
        var pollingForFunctionInitialization = setInterval(function() {
            if (window.s7jsonResponse) {
                var originalFn = window.s7jsonResponse;

                window.s7jsonResponse = function() {
                    originalFn && originalFn.apply(this, arguments);
                    buildImageCarousel(arguments);
                };
                clearInterval(pollingForFunctionInitialization);
            }
        }, 500);
    };

    var init = function() {
        bindS7JsonResponse();
    };

    return {
        init: init
    };
});
