define([
    '$',
    'components/sheet/sheet-ui',
    'global/utils'
], function($, sheet, Utils) {

    var $addressPinny = $('.js-address-pinny');
    var $removeAddressPinny = $('.js-remove-address-pinny');
    var $addressShade;
    var $removeAddressShade;
    var $addressButton;

    var _closeCallback = function() { return;};

    var _addCloseCallback = function(cb) {
        _closeCallback = cb;
    };

    var _resetPinny = function() {
        var $lockup = $('.lockup__container');
        $addressPinny.parent().appendTo($lockup);
        $addressShade.appendTo($lockup);

        $addressPinny.pinny('close');
        _closeCallback();
    };

    var desktopCloseCallback = function(removedElement) {
        _resetPinny();
    };

    var _bindEvents = function() {
        // TODO: This line is hanging the browser on Multi Address page. To be reviewed again
        Utils.overrideDomRemove('', desktopCloseCallback, '.ok-cancel-dlog');

        $('body').on('click', '.js-address-pinny .pinny__close', function(e) {
            $addressPinny.find('.js-close-modal').click();
            $addressPinny.find('.js-close-modal span').click();
        });

        $('body').on('click', '.js-remove-address-pinny .pinny__close', function(e) {
            $removeAddressPinny.find('.js-close-modal').click();
            $removeAddressPinny.find('.js-close-modal span').click();
        });
    };

    var _transformContent = function($content) {
        var $mainTable = $content.find('.form');
        var $newContainer = $('<div>');

        // First name/middle initial needs to be grouped together
        $mainTable.find('.AddrMNameSpot').removeClass('spot').addClass('c-field');
        $mainTable.find('.AddrFNameSpot').after($mainTable.find('.AddrMNameSpot'));

        $newContainer.append($mainTable.find('.gwt-addr-edit-error-panel'));
        $newContainer.append($mainTable.find('#addr_addressTypeSpot .gwt-CheckBox'));
        $newContainer.append($mainTable.find('.group'));
        $newContainer.append($mainTable.find('.okCancelPanel').addClass('u-margin-top-md'));

        $mainTable.replaceWith($newContainer);

        // styling transformations
        $content.find('.required').addClass('u-text-error');
        $content.find('.miLabel').remove();
        //remove label of Street field
        var place = $content.find('.addrStreet2Spot').find('.gwt-RealLabel').text().match(/\(([^)]+)\)/);
        var $place = '';

        if (place && place.length >= 2) {
            $place = place[1];
        }

        $content.find('.extended-address').attr('placeholder', $place).html();
        $content.find('.addrStreet2Spot').find('.gwt-RealLabel').remove();
        $content.find('.addrStreet1Spot .gwt-RealLabel').text('Street Address');
        $content.find('.AddrCompanySpot .gwt-RealLabel').append('<div class="c-optional">optional</div>');
        $content.find('.addrPhone2Spot .gwt-RealLabel').append('<div class="c-optional">optional</div>');
        $content.find('.spot').addClass('c-field').wrap('<div class="c-field-row"></div>');
        // removes unnecessary "group" div
        $content.find('.c-field-row').unwrap();
        $content.find('.addrCitySpot').addClass('u-bleed-top');

        // template select fields: must reconstruct instead of running thru dust to preserve
        // events
        var $chevronIcon = $('.c-select__icon').clone();
        $content.find('select')
            .wrap('<div class="c-select"></div>')
            .parent()
            .append($chevronIcon);

        $content.find('.gwt-CheckBox')
            .addClass('c-field')
            .wrap('<div class="c-field-row"></div>');

        $content.find('.AddrFNameSpot')
            .closest('.c-field-row')
            .addClass('c--3-4')
            // move middle name into same field row as first name
            .append($content.find('.AddrMNameSpot'));

        $content.find('[id*="addr_phone"]').attr('type', 'tel');
        $content.find('#addr_zipbox').attr('type', 'tel');

        var $cancelButton = $content.find('.button.secondary').addClass('c-button c--outline');
        $content.find('.button.primary').html('<span>Continue</span>');
        $content.find('.button.primary')
            .addClass('c-button c--primary c--full-width js-continue-button')
            .after($cancelButton);
        $cancelButton.addClass('c--full-width u-margin-top-md js-close-modal');
    };

    var _transformRemoveAddressContent = function($content) {
        var $mainTable = $content.find('.form');
        var $newContainer = $('<div>');

        $newContainer.append($mainTable.find('.okCancelPanel').addClass('u-margin-top-md'));

        $mainTable.replaceWith($newContainer);
        // removes unnecessary "group" div
        $content.find('.c-field-row').unwrap();

        var $cancelButton = $content.find('.button.secondary').addClass('c-button c--secondary u-margin-bottom-lg c--outline js-cancel-button');
        $content.find('.button.primary')
            .addClass('c-button c--primary c--full-width js-ok-button')
            .after($cancelButton);
        $cancelButton.addClass('c--full-width u-margin-top-md js-close-modal');
    };

    var _transformSelect = function($content) {
        var $mainTable = $content.children('table');
        var $newContainer = $('<div>');
        var $select = $mainTable.find('.gwt-ListBox');
        var $addressContent = $mainTable.find('.gwt-addr-disp').parent();

        $select.wrap('<div class="c-select">');
        $select.after($('<svg class="c-icon-svg c-select__icon c--large" title="Arrow downs"><title>Arrow down</title><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-chevron-down"></use></svg>'));

        $addressContent.addClass('u-margin-top-md u-margin-bottom-md');

        $newContainer.append($select.parent());
        $newContainer.append($addressContent);
        $newContainer.append($mainTable.find('.primary').addClass('c-button c--primary c--full-width'));

        $mainTable.replaceWith($newContainer);
    };

    var _showModal = function($modal, isSelectAddress) {
        var $content = $modal.find('.dialogContent');
        var title = $modal.find('.Caption').text().toLowerCase();

        if (!$content.length || $content.parent().hasClass('pinny__content')) {
            return;
        }

        if (isSelectAddress) {
            _transformSelect($content);
        } else {
            _transformContent($content);
        }


        $addressPinny.find('.c-sheet__title').html(title);
        $addressPinny.find('.js-address-pinny__body').html($content);

        $modal.html($addressPinny.parent());
        $modal.append($addressShade);
        $addressPinny.pinny('open');
    };

    var _showRemoveAddressModal = function($modal) {
        var $content = $modal.find('.dialogContent');
        var title = $modal.find('.Caption').text().toLowerCase();

        if (!$content.length || $content.parent().hasClass('pinny__content')) {
            return;
        }

        _transformRemoveAddressContent($content);

        $removeAddressPinny.find('.c-sheet__title').html(title);
        $removeAddressPinny.find('.js-remove-address-pinny__body').html($content);

        $modal.html($removeAddressPinny.parent());
        $modal.append($removeAddressShade);
        $removeAddressPinny.pinny('open');
    };

    var _initSheet = function() {
        sheet.init($addressPinny, {
            coverage: '97%',
            shade: {
                cssClass: 'js-address-shade',
                zIndex: 100,
                color: '#fff',
                opacity: '0.8'// Match our standard modal z-index from our CSS ($z3-depth)
            },
            close: function() {
                $addressPinny.find('.js-close-modal').click();
                $addressPinny.find('.js-close-modal span').click();
            }
        });

        sheet.init($removeAddressPinny, {
            shade: {
                cssClass: 'js-remove-address-shade',
                zIndex: 100,
                color: '#000',
                opacity: '0.5'// Match our standard modal z-index from our CSS ($z3-depth)
            },
            close: function() {
                $removeAddressPinny.find('.js-close-modal').click();
                $removeAddressPinny.find('.js-close-modal span').click();
                $('.js-remove-address-shade.shade--is-open').remove();
            }
        });

        $removeAddressPinny.parent().addClass('c--dialog');

        $addressShade = $('.js-address-shade');
        $removeAddressShade = $('.js-remove-address-shade');

        _bindEvents();
    };

    return {
        initSheet: _initSheet,
        showModal: _showModal,
        showRemoveAddressModal: _showRemoveAddressModal,
        addCloseCallback: _addCloseCallback
    };
});
