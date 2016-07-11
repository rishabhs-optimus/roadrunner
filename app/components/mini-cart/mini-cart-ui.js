define([
    '$',
    'hijax',
    'components/sheet/sheet-ui',
    'dust!components/mini-cart/mini-cart'
],
function($, Hijax, Sheet, MiniCartTemplate) {

    // Initializes cart pinny
    var initCartPinny = function() {
        var $cartPinny = $('.js-cart-pinny');
        Sheet.init($cartPinny, {
            shade: {
                opacity: 0.9,
                color: '#fff'
            }
        });

        $('.js-cart-toggle').on('click', function(e) {
            $cartPinny.pinny('open');
        });
    };

    // Parse mini cart items
    var parseCartItems = function(items) {
        var $cartContent = $('.js-cart-contents');
        var templateContent = {
            cartItems: []
        };


        /*eslint-disable*/
        $.each(items, function(i, item) {
            item = item.pageProduct;
            var itemSelectValue;
            item.mfPartNumber = item.mfPartNumber.replace(' ','_');
            var imageBaseUrl = all.BASE_S7_URL + item.mfPartNumber;
            var images = [];
            // For generation product image using "product part number" and "product select value"
            if (item.itemSelectedOptions.length) {
                for (var i=0; i<item.itemSelectedOptions.length; i++) {
                    itemSelectValue = '_' + item.itemSelectedOptions[i].selectValue;
                    if (item.mfPartNumber.indexOf('GREEN') > 1) {
                        itemSelectValue = '_main';
                    }
                    images.push('<img src="' + imageBaseUrl + itemSelectValue + '" onerror="this.parentElement.removeChild(this);">');
                }
            } else {
                itemSelectValue = '_main';
                images.push('<img src="' + imageBaseUrl + itemSelectValue + '">');
            }

            images = images.join('');


            templateContent.cartItems.push({
                productImage: images,
                productName: item.prodName,
                qty: item.quantity,
                options: item.itemSelectedOptions.map(function(option) {
                    return {
                        name: option.optionName,
                        value: option.optionValue
                    };
                })
            });
        });
        /*eslint-enable*/

        return templateContent;
    };

    // Add minicart title
    var shoppingCartTransform = function() {
        var $miniCartTitle = $('.js-cart-title .c-sheet__title');
        var $cart = $('#shoppingCart');
        var $cartCount = $('.js-cart-count');
        var cartCount = '';

        if (!$cartCount.length) {
            return;
        }

        // Facing issue in using translation
        $miniCartTitle.text('Cart');
    };

    var animationListener = function() {
        if (event.animationName === 'shoppingCartAdded') {
            shoppingCartTransform();
        }
    };

    // Implemented hijax for mini cart
    var initHijaxProxies = function() {
        var hijax = new Hijax();

        hijax.set(
            'mini-cart-proxy',
            function(url) {
                return /MiniCartView/.test(url);
            },
            {
                receive: function(data, xhr) {
                    var items = $.parseJSON(data).items;
                    var $cartContent = $('.js-cart-contents');
                    var $cartCheckoutButton = $('.js-cart-checkout-button');
                    var templateContent = parseCartItems(items);
                    $('.js-cart-count').html(items.length);

                    new MiniCartTemplate(templateContent, function(err, html) {
                        $cartContent.html(html);
                    });
                    $cartCheckoutButton.html($cartContent.find('.js-mini-cart-checkout-button'));
                }
            }
        );
    };

    var bindEventHandlers = function() {
        document.addEventListener('animationStart', animationListener);
        document.addEventListener('webkitAnimationStart', animationListener);
    };
    return {
        initHijaxProxies: initHijaxProxies,
        initCartPinny: initCartPinny,
        bindEventHandlers: bindEventHandlers
    };
});
