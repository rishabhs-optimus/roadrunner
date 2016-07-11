define(['$'], function($) {

    var parse = function($container) {
        return {
            resultsCount: $container.find('.sli_bct_num_results').html(),
            totalCount: $container.find('.sli_bct_total_records').html(),
            separatorText: $container.find('span').remove().end().text().trim(),
            isLoading: false
        };
    };

    return {
        parse: parse
    };
});
