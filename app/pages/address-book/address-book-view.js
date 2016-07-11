/**
 * Address Book View
 */

define([
    '$',
    'global/baseView',
    'dust!pages/address-book/address-book',
    'translator'
],
function($, baseView, template, Translator) {

    return {
        template: template,
        extend: baseView,
        context: {
            templateName: 'address-book',
            breadcrumbLink: function() {
                return {
                    href: $('#myAccount a').attr('href'),
                    title: Translator.translate('account_overview')
                };
            },
            pageTitle: function() {
                return $('.custom').attr('title');
            },
            introText: function() {
                return $('.upper').text();
            },
            hiddenInputs: function() {
                return $('input[type="hidden"]');
            },
            hiddenData: function() {
                return $('div[id*="gwt"]');
            },
            addressContainer: function() {
                return $('#gwt_address_display_panel');
            },
            address: function() {
                return {
                    defaultBilling: $('.gwt-addrbk-billshipind-on'),
                    defaultShipping: $('.gwt-addrbk-billshipind-on'),
                    address: $('.gwt-addrbk-addrpanel'),
                    buttons: $('.gwt-addrbk-addritem-btnpanel button')
                };
            },
            addNewButton: function() {
                return $('.gwt-addrbk-btnpanel');
            }
        }
    };
});
