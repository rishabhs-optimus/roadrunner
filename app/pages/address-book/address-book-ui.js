define([
    '$',
    'global/utils',
    'global/ui/address-modal-ui'
], function($, Utils, AddressModal) {

    var transformAddressBook = function() {
        var $container = $('#gwt_address_display_panel');

        $container.find('.gwt-addrbk-addritempanel').addClass('c-address-book__card');
        $container.find('.gwt-addrbk-addrlist').addClass('c-address-book__list');
        $container.find('.gwt-addrbk-addritem-btnpanel').addClass('c-address-book__button-list');
        $container.find('.gwt-addrbk-billshipind-off').remove();
        $container.find('.gwt-HTML').remove();
        $container.find('.gwt-addrbk-addrpanel').addClass('c-address-book__address');
        $container.find('.gwt-addrbk-addritem-btnpanel button').addClass('c-address-book__button');
        $container.find('.gwt-addrbk-addritem-btnpanel button + button').addClass('c-address-book__button-remove');

        $container.find('.gwt-addrbk-billshipind-on').each(function(i, tag) {
            var $tag = $(tag);
            $tag.find('span').removeAttr('style');
            $tag.addClass('c-address-book__default');
            $tag.closest('.gwt-addrbk-addritempanel').prepend($tag.parent());
        });
        var $addIcon = jQuery('<svg class="c-icon" data-fallback="img/png/plus.png"><title>plus</title><use xlink:href="#icon-plus"></use></svg>');

        // the decoration needs to happen after overrideDomAppend function is finished
        // since we're hooking onto the btn panel itself, it's not ready for the DOM yet
        setTimeout(function() {
            $container.find('.gwt-addrbk-btnpanel button').addClass('c-address-book__add');
            $addIcon.insertAfter($container.find('.gwt-addrbk-btnpanel button'));
        }, 10);
    };

    var _nodeInserted = function() {
        if (event.animationName === 'modalAdded') {
            var $editAddressModal = $('#editAddressModal');
            var $addAddressModal = $('#addAddressModal');
            var $removeAddressModal = $('#gwt-removeConfirmDlog-content_modal');

            if ($editAddressModal.length) {
                AddressModal.showModal($editAddressModal);
            } else if ($addAddressModal.length) {
                AddressModal.showModal($addAddressModal);
            } else if ($removeAddressModal.length) {
                AddressModal.showRemoveAddressModal($removeAddressModal);
            }
        }
    };

    var addressBookUI = function() {
        AddressModal.initSheet();
        Utils.overrideDomAppend('.gwt-addrbk-btnpanel', transformAddressBook);

        document.addEventListener('animationStart', _nodeInserted);
        document.addEventListener('webkitAnimationStart', _nodeInserted);
    };

    return addressBookUI;
});
