/**
 * BreadCrumb View
 */
define(['$'], function($) {
    var parse = function($breadcrumb) {
        var $previousPage = $breadcrumb.find('.current').prev();
        if (!$previousPage.length) {
            $breadcrumb.find('.sli_bct_separator').remove();
            $previousPage = $breadcrumb.find('.last').parent().prev();
        }
        return {
            href: $previousPage.find('a').attr('href'),
            title: $previousPage.find('a').text(),
            iconName: 'right'
        };

    };

    return {
        parse: parse
    };
});
