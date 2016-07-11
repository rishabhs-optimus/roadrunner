define([
    '$'
], function($) {


    var _parse = function($addressContainer, includeEdit, isButton) {
        var $name = $addressContainer.find('.fn');

        return {
            billingAddressClass: $addressContainer.attr('id'),
            sectionTitle: $addressContainer.find('h3').text(),
            edit: $addressContainer.find('button:first').text('Edit Address').addClass('u-unstyle u--bold'),
            editOnClick: $addressContainer.find('.button').first().attr('onclick'),
            select: $addressContainer.find('button:last').text('select').addClass('u-unstyle u--bold').removeClass('nodisplay'),
            name: $name.first().text(),
            company: $name.length > 1 ? $name.last().text() : '',
            street: $addressContainer.find('.street-address').text(),
            city: $addressContainer.find('.locality').text(),
            state: $addressContainer.find('.region').text(),
            postalCode: $addressContainer.find('.postal-code').text(),
            country: $addressContainer.find('.country').text(),
            phoneNumber: $addressContainer.find('.phone-number').text(),
            container: $addressContainer,
            isButton: isButton,
            showShippingLabel:  $addressContainer.is('#billingAddress') ? false : true
        };
    };

    return {
        parse: _parse
    };
});
