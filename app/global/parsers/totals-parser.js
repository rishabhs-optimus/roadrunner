define([
    '$',
    'translator'
], function($, translator) {

    var _parse = function($totalTable) {
        return {
            ledgerEntries: $totalTable.find('tr').map(function(i, row) {
                var $row = $(row);
                if ($row.hasClass('promoRow')) {
                    return {
                        description: $row.find('.promoColor').first().remove().text().trim(),
                        tooltipContent: $row.find('[id*="PromoDesc"]').remove().removeClass(),
                        number: $row.find('.amount, .last').text().trim()
                    };
                }
                return {
                    description: $row.find('.qty').text(),
                    number: $row.find('.last').text(),
                    entryModifierClass: $row.is(':last-of-type') ? 'c--total c--bordered' : ''
                };
            })
        };
    };

    return {
        parse: _parse
    };
});
