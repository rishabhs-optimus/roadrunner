var selectors = {
    pdpBody: '.t-product-details-page',
    productInfo: '.c-product-info',
    size: '.gwt-selection-chip-picker',
    sizeOption: function(position) {
        return '.gwt-selection-chip-picker .gwt-selection-chip-picker-option:nth-child( ' + position + ')';
    },
    color: '.gwt-image-picker',
    colorOption: function(position) {
        return '.gwt-image-picker .gwt-image-picker-option:nth-child(' + position + ')';
    },
    addItemButton: '.js-add-to-cart',
    miniCart: '.c-cart-modal',
    itemImage: '.js-cart-item__product-image',
    checkout: '.okCancelPanel button:nth-child(1)'
};

var PDP = function(browser) {
    this.browser = browser;
    this.selectors = selectors;
};

PDP.prototype.selectSize = function(sizePosition) {
    var self = this;
    this.browser
        .element('css selector', selectors.size, function(result) {
            if (result.value && result.value.ELEMENT) {
                self.browser
                    .log('Selecting one size')
                    .waitForElementVisible(selectors.size)
                    .click(selectors.sizeOption(sizePosition))
                    .waitForAjaxCompleted()
                    .waitForAnimation();
            }
        });
    return this;
};

PDP.prototype.selectColor = function(colorPosition) {
    var self = this;
    this.browser
        .element('css selector', selectors.color, function(result) {
            if (result.value && result.value.ELEMENT) {
                self.browser
                    .log('Selecting one color')
                    .waitForElementVisible(selectors.color)
                    .click(selectors.colorOption(colorPosition))
                    .waitForAjaxCompleted()
                    .waitForAnimation();
            }
        });
    return this;
};

PDP.prototype.addItemToCart = function(browser) {
    this.browser
        .log('Adding item to cart')
        .waitForElementVisible(selectors.addItemButton)
        .waitUntilMobified()
        .waitForAjaxCompleted()
        .click(selectors.addItemButton)
        .waitUntilMobified()
        .waitForAjaxCompleted()
        .waitForAnimation();
    return this;
};

PDP.prototype.navigateToCart = function(browser) {
    this.browser
        .log('Navigating to Cart')
        .waitForElementVisible(selectors.checkout)
        .click(selectors.checkout)
        .waitUntilMobified()
        .waitForAjaxCompleted()
        .waitForAnimation();
    return this;
};

module.exports = PDP;
