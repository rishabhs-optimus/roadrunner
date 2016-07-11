define(['$', 'translator'], function($, Translator) {
    var footerLinkItems = function() {
        var $accountLinks = $('#login, #myAccount, #orderStatus');
        var $welcomeUser = $('#welcome');
        var $content = $('<div />');
        var $list = $('<li />');

        // Signed in message
        if ($welcomeUser.text().trim().length > 0) {
            $list.clone().addClass('u-margin-bottom-md').text($welcomeUser.text()).appendTo($content);
        }

        // Desktop markup is reversed due to their CSS styles
        Array.prototype.reverse.apply($accountLinks);

        $accountLinks.each(function(index, item) {
            var $item = $(item);
            var $anchor = $item.find('a');

            if (/login/i.test($item.attr('id'))) {
                var data =  {
                    href: $anchor.attr('href'),
                    primaryClass: 'u-text-brand',
                    primaryAction: true,
                    primaryIconName: 'user',
                    primaryIconClass: 'u-margin-end-md',
                    primaryContent: $anchor.text()
                };

                window.dust.render('components/list-tile/list-tile', data, function(error, out) {
                    if (!error) {
                        $list.clone().append($(out).addClass('u-shift-start')).appendTo($content);
                    }
                });
            } else {
                $list.clone().append($anchor.clone()).appendTo($content);
            }
        });

        // Inject cart link to my account menu
        var cartData = {
            primaryAction: true,
            primaryIconName: 'cart',
            primaryIconClass: 'u-margin-end-md',
            primaryContent: Translator.translate('cart')
        };

        window.dust.render('components/list-tile/list-tile', cartData, function(error, out) {
            if (!error) {
                var $out = $(out);
                var $cartCount = $('<span class="t-header__cart-count js-cart-count u-margin-start-sm">0</span>');

                $out.find('.u--bold').append($cartCount);

                $list.clone().append($out.addClass('u-shift-start js-cart-toggle')).appendTo($content);
            }
        });

        return {
            sectionTitle: 'My Account/Orders',
            content: $content.contents()
        };
    };
    var parse = function() {

        return {
            items: footerLinkItems,
            accordionClass: 'c-footer-links'
        };
    };

    return {
        parse: parse
    };
});
