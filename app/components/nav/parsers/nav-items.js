define(['$', 'translator'], function($, Translator) {

    // Get innerLinks (third Level navigation content)
    var getInnerLinks = function($innerLinks) {
        return $innerLinks.map(function() {
            var $innerLink = $(this);
            return {
                primaryContent: $innerLink.text(),
                href: $innerLink.attr('href'),
                primaryAction: true,
                primaryIconName: 'right'
            };
        });
    };

    var getBottomLinks = function() {
        var $signIn = $('#login');
        var $orderStatus = $('#orderStatus');
        var $giftCard = $('#links .columnA').find('[href="/gifts/gift-card"]');
        return {
            signIn: {
                primaryAction: true,
                primaryIconName: 'user',
                primaryContent: $signIn.find('a').text(),
                href: $signIn.find('a').attr('href')
            },
            orderStatus: {
                primaryAction: true,
                primaryIconName: 'order',
                primaryContent: $orderStatus.find('a').text(),
                href: $orderStatus.find('a').attr('href')
            },
            giftCard: {
                primaryAction: true,
                primaryIconName: 'card',
                primaryContent: $giftCard.text(),
                href: $giftCard.attr('href')
            },
        };
    };

    // Get sub categories (second Level navigation content)
    var getSubCategories = function($subCategories) {
        return $subCategories.map(function() {
            var $subCategory = $(this);
            var $subCategoryLink = $subCategory.children('a');
            var $innerLinks = $subCategory.find('> ul a');
            var hasInnerLinks = $subCategory.find('ul > li').length;
            return {
                subCategoryLink: {
                    primaryContent: $subCategoryLink.text(),
                    href: hasInnerLinks ? '' : $subCategoryLink.attr('href'),
                    primaryAction: 'true',
                    primaryIconName: 'right',
                    primaryContentClass: hasInnerLinks ? 'u--bold' : '',
                    back: {
                        primaryAction: true,
                        primaryIconName: 'left',
                        primaryContent: $subCategoryLink.text(),
                        secondaryAction: true,
                        secondaryIconName: 'delete',
                        secondaryIconClass: 'pinny__close'
                    }
                },
                innerLinks: getInnerLinks($innerLinks),
                viewAll: $subCategoryLink.text() ? {
                    primaryContent: Translator.translate('view_all') + $subCategoryLink.text(),
                    href: $subCategoryLink.attr('href'),
                    primaryAction: true,
                    primaryIconName: 'right',
                    primaryIconClass: 'c--small'
                } : false
            };
        });
    };

    // Get navigation items
    var getNavItems = function($categories) {

        // Removing last link to match the mockup.
        $categories.children('.menuItem').last().remove();
        var $navItems = $categories.children('.menuItem').map(function() {
            var $category = $(this);
            var $categoryLink = $category.children('a');
            // Change - Added View all category link at the end of second pane
            var $viewAllCategory = $category.clone().find('> ul').remove().end();
            $viewAllCategory.find('img.on').text(Translator.translate('view_all') + ' ' + $viewAllCategory.find('img.on').attr('alt'));
            var $subCategories = $viewAllCategory.add($category.find('> ul > .menuItem'));

            return {
                categoryLink: {
                    primaryAction: true,
                    primaryIconName: 'right',
                    primaryContent: $categoryLink.find('img.on').attr('alt'),
                    primaryContentClass: $subCategories.length ? 'u--bold' : '',
                    back: {
                        primaryAction: true,
                        primaryIconName: 'left',
                        primaryContent: $categoryLink.find('img.on').attr('alt'),
                        secondaryAction: true,
                        secondaryIconName: 'delete',
                        secondaryIconClass: 'pinny__close'
                    }
                },
                subCategories: getSubCategories($subCategories)
            };
        });

        return {
            shopText: Translator.translate('shop'),
            categories: $navItems,
            bottomLinks: getBottomLinks()
        };
    };

    return {
        parse: getNavItems
    };
});
