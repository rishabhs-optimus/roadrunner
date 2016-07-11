var selectors = {
    plpBody: '#cbiBody',
    plpList: '.c-category-product',
    pdpItem: function(index) {
        return '.js-category-items .c-category-product__item:nth-child(' + index + ') img';
    },
    popup: '.gwt_welcome_window',
    closeBtn: '.gwt_welcome_window_close'
};

var PLP = function(browser) {
    this.browser = browser;
    this.selectors = selectors;
};

var randomNum = parseInt(Math.random() * 10 + 1);

PLP.prototype.navigateToPDP = function(browser) {
    this.browser
        .log('Navigating to PDP')
        .waitForElementVisible(selectors.pdpItem(randomNum))
        .log('Selecting Menu at index: ' + randomNum)
        .click(selectors.pdpItem(randomNum))
        .waitUntilMobified()
        .waitForAjaxCompleted()
        .waitForAnimation();
    return this;
};

PLP.prototype.closePopup = function(browser) {
    var self = this;
    this.browser
        .element('css selector', selectors.popup, function(result) {
            if (result.value && result.value.ELEMENT) {
                self.browser
                    .log('Closing Popup')
                    .waitForElementVisible(selectors.popup)
                    .click(selectors.closeBtn)
                    .waitForAjaxCompleted();
            }
        });
    return this;
};

module.exports = PLP;
