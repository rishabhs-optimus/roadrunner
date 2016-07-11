// NOTE: parser intended for the customer service side navigation
define(['$'], function($) {
    return {
        context: {
            topNav: function() {
                var $sideBox = $('#sideBox');
                return $sideBox.map(function(_, box) {
                    var $box = $(box);
                    var $content = $box.find('ul a');
                    var isGift = ($content.first().text() === 'Gifts');

                    if (isGift) {
                        $content.map(function(index, item) {
                            var $item = $(item);
                            // $item.wrap('<div class="c-top-nav-link"/>');
                            $item.contents().wrap('<div class="c-topnav-text c-arrange__item"/>');
                            $item.parent().wrap('<div class="c-stack__item c--xlarge"/>');

                            $item.contents().wrapAll('<div class="c-arrange c--align-middle" />');

                            return $item;
                        });
                    } else {
                        var includes = [
                            '/about-us/content',
                            '/contact-us/content',
                            '/order-form/content',
                            '/order-tracking/content',
                            '/returns-and-exchgs/content',
                            '/shipping-and-processing/content',
                            '/your-privacy-rights/content',
                            '/gift-services/content',
                            '/sizing-chart/content'
                        ];
                        // Icons for the links
                        var icons = [
                            'info',
                            'contact',
                            'ship-info',
                            'order',
                            'returns',
                            'shipping',
                            'privacy',
                            'gift',
                            'size-chart'
                        ];

                        // Filter content based on the mock, if customer wants more, comment this
                        $content = $content.filter(function() {
                            return $.inArray($(this).attr('href'), includes) > -1;
                        });

                        $content.map(function(index, item) {
                            var $item = $(item);
                            // $item.wrap('<div class="c-top-nav-link"/>');
                            $item.contents().wrap('<div class="c-topnav-text c-arrange__item"/>');
                            $item.parent().wrap('<div class="c-stack__item c--xlarge"/>');

                            $('<div class="c-topnav-icon c-arrange__item c--shrink u-margin-start-md u-margin-end-lg"/>').insertBefore($item.find('.c-topnav-text'));
                            $('<svg class="c-icon" data-fallback="img/png/' + icons[$.inArray($item.attr('href'), includes)] +  '.png"><use xlink:href="#icon-' + icons[$.inArray($item.attr('href'), includes)] + '"></use></svg>').appendTo($item.find('.c-topnav-icon'));

                            $item.contents().wrapAll('<div class="c-arrange c--align-middle" />');

                            return $item;
                        });
                    }

                    $box.find('.c-stack__item').wrapAll('<div class="c-stack u-margin-top-lg" />');

                    // TRAV-287: Remove nested links
                    $box.find('.group > ul').remove();
                    // $box.find('a').wrap('<div class="c-top-nav-link"/>');
                    // $box.find('a').contents().wrap('<div class="c-topnav-text"/>');
                    // $('<div class="c-topnav-icon"/>').insertBefore($box.find('.c-topnav-text'));

                    return {
                        headerContent: isGift ? 'Gift Cards' : ($box.find('h1').first().text() || 'Customer Service'),
                        content: {data: $box.find('.c-stack')}
                    };
                });
            }
        }
    };
});
