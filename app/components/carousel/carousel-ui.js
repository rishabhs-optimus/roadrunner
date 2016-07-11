define([
    '$',
    'hijax',
    'components/carousel/parsers/carousel',
    'dust!components/carousel/carousel'
],
function($, Hijax, carouselParser, carouselTemplate) {

    // Create carousel structure
    var buildCarouselStructure = function($container) {
        var data = carouselParser.parse($container);
        carouselTemplate(data, function(err, html) {
            $('.js-carousel-wrapper').html(html);
        });
    };

    // setTimeout has been used as the image src is created by some desktop script
    // that takes some lag. Tried piolling also but could not get the src
    var carouselHijax = function($container) {
        var hijax = new Hijax();
        hijax.set(
            'recommendations', function(url) {
                return /RecommendationsJSONCmd/.test(url);
            }, {
                complete: function() {
                    setTimeout(function() {
                        buildCarouselStructure($container);
                    }, 1000);
                }
            }
        );
    };

    var init = function init($container) {
        carouselHijax($container);
    };

    return {
        init: init
    };
});
