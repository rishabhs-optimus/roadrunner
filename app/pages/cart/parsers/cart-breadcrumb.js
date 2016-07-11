/**
 * BreadCrumb View
 */
define(['$'], function($) {
    var parse = function($breadcrumb) {
        var $previousPage = $breadcrumb.find('.actions .spot .button.secondary');

        return {
            href: $previousPage.attr('onclick').replace(/(window\.location=|')/g, ''),
            title: $previousPage.text(),
            iconName: 'right'
        };

    };

    return {
        parse: parse
    };
});
