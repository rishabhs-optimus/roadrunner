define(['$'], function($) {
    var parse = function($section) {
        var $heading = $section.find('p:first strong').remove().contents().unwrap();
        var $bellowsContent = $section.find('p');

        var $phone = $bellowsContent.filter('.c-footer-phone-number');
        if ($phone.length) {
            var phoneNumberText = $phone.text();
            var bracketContent = '<span class="c-bracket">(' + phoneNumberText.match(/\(([^)]+)\)/)[1] + ')</span>';
            var phoneNumber = phoneNumberText.match(/\d{3}-\d{3}-\d{4}/);
            $phone.html('<a href="tel:' + phoneNumber[0] + '">' + phoneNumber[0] + '</a>').addClass('u--bold').append(bracketContent);
        }

        return {
            items: {
                sectionTitle: $heading,
                content: $bellowsContent
            },
            accordionClass: 'c-footer-links'
        };
    };

    var parseCustomerServiceSection = function() {
        var $section = $('#footer_links').find('.columnA:first');
        $section.find('p:last').remove();
        $section.find('p:last').remove();
        $section.find('p').eq(1).addClass('c-footer-phone-number');

        return parse($section);
    };

    var parseAboutSection = function() {
        var $section = $('#footer_links').find('.columnA').eq(1);

        // TRAV-437: Keep only specific links
        var $contents = $section.find('p').remove();

        var $desiredLinks = $contents.filter(function(index, item) {
            var text = $(item).text();
            return text.indexOf('About') > -1 || text.indexOf('Privacy') > -1 || text.indexOf('Conditions') > -1;
        });

        $section.append($desiredLinks);

        return parse($section);
    };

    return {
        parseAboutSection: parseAboutSection,
        parseCustomerServiceSection: parseCustomerServiceSection
    };
});
