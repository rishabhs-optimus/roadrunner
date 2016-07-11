/**
 * Account Overview View
 */

define([
    '$',
    'translator',
    'global/baseView',
    'dust!pages/account-overview/account-overview'
],
function($, Translator, baseView, template) {

    var iconMapping = {
        'Order History': 'order',
        'Change Email': 'user',
        'Change Password': 'password',
        'Change Payment Method': 'card',
        'Address Book': 'address',
        'Email Preferences': 'email_preferences'
    };

    var domParser = function($overviewContainer, context) {

        // fixing welcome message
        var $welcomeUserMessage =
            context.myAccountSection
                .find('.header')
                .find('script')
                .remove()
                .end();

        var welcomeMessage = $overviewContainer.find('p:contains(Welcome)');
        if ($overviewContainer.find('p').length === 1) {
            var $index = $overviewContainer.find('p').text().indexOf('You may');
            var $newText = $overviewContainer.find('p').text().slice(0, $index);
            welcomeMessage.html($newText);
        }

        $overviewContainer.find('p[style]').removeAttr('style').addClass('c-account-overview__user');

        return {
            userMessage: $welcomeUserMessage.text(),
            welcomeMessage: welcomeMessage,
            accessibleInfo: $('<p class="c-account-overview__info"></p>').html(Translator.translate('account_overview_text'))
        };
    };

    return {
        template: template,
        extend: baseView,
        context: {
            templateName: 'account-overview',
            resetPasswordSuccessMessage: function() {
                return $('#mainContent').find('.reset-password-msg');
            },
            myAccountSection: function() {
                return $('#sideBox .myAccount');
            },
            pageContent: function(context) {
                var $overviewContainer =  $('.overviewWrapper');
                return domParser($overviewContainer, context);
            },
            navigationOptions: function(context) {
                return context.myAccountSection.find('> li').not('.header').map(function(i, row) {
                    var $row = $(row);
                    if ($row.html().indexOf('My Lists') > -1) {
                        return;
                    }
                    var $list = $row.find('ul').remove();
                    return {
                        header: $row.text().replace(':', '').trim(),
                        options: $list.find('li').map(function(j, subRow) {
                            var $subRow = $(subRow);
                            $subRow.find('a').text($subRow.find('a').text().replace('Information', 'Method'));
                            return {
                                iconClass: iconMapping[$subRow.find('a').text()],
                                link: $subRow.find('a').addClass('c-account-overview__href')
                            };
                        })
                    };
                });
            }
        }
    };
});
