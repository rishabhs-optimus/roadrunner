/**
 * Account Information View
 */

define([
    '$',
    'global/baseView',
    'dust!pages/account-information/account-information'
],
function($, baseView, template) {

    var transformContainer = function($container) {
        var $arrowIcon = $('<svg class="c-icon" data-fallback="img/png/chevron-left.png"><title>chevron-left</title><use xlink:href="#icon-chevron-left"></use></svg>');
        $container.find('#gwt_billaddr_panel').addClass('js-form-container');
        $container.find('#gwt_shipaddr_panel').addClass('js-form-container');
        $container.find('#gwt_sameasbilling_cb').addClass('u-margin-top-sm');
        $container.find('.statePicker').addClass('c-select');
        $container.find('.miLabel').css('display', 'none');
        $container.find('#bill_reqdlabel').remove();
        $container.find('.accountInfoShippingForm>h3').addClass('c-accountInfoShippingForm');
        $container.find('.addrStateSpot div').append('<svg class="c-icon" data-fallback="img/png/carat-right.png"><title>carat-right</title><use xlink:href="#icon-carat-right"></use></svg>');
        return $container;
    };

    return {
        template: template,
        extend: baseView,
        context: {
            templateName: 'account-information',
            hiddenForm: function() {
                return $('#gwt_view_name').parent();
            },
            accountInfoContainer: function() {
                return transformContainer($('.account_info'));
            },
            pageTitle: function() {
                return $('.custom').attr('title');
            },
            pageInfo: function(context) {
                return context.accountInfoContainer.find('.inst-copy').remove();
            },
            hiddenLabels: function() {
                // Labels needed for desktop JS
                return $('#mainContent').children('.nodisplay, [id^="gwt_errmsg"], [id$="label"]');
            }
        }
    };
});
