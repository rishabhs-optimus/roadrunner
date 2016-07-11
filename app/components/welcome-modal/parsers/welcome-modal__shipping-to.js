define(['$'], function($) {
    var _parse = function($container) {

        return {
            title: $container.find('#title').find('#headline'),
            subTitle: $container.find('#subheadline'),
            salespoint: $container.find('#sellspoint').find('ul'),
            notshipLink: $container.find('#notshipLink').html()
        };
    };

    return {
        parse: _parse
    };
});
