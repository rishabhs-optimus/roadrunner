define([
    '$'
], function($) {

    var splitValue = function(str) {
        var stringArray = [];
        var splitString = 'empty. ';
        var splitIndex = str.indexOf(splitString) + splitString.length;
        stringArray.push(str.substring(0, splitIndex));
        stringArray.push(str.substring(splitIndex));
        return stringArray;
    };

    var parse = function($container) {
        return {
            cartTitle: splitValue($container.find('#cartEmpty').html())[0],
            cartContent: splitValue($container.find('#cartEmpty').html())[1],
            shoppingBtn: $container.find('.spot button').addClass('c-button c--secondary'),

        };
    };

    return {
        parse: parse
    };
});
