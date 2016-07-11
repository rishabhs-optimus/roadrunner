var selectors = {
    home: '.GUEST',
    menuButton: '.t-header__search-menu-shop',
    plpItem: '.c-banner-img-box .hero:nth-child(3) img',
};

var Home = function(browser) {
    this.browser = browser;
    this.selectors = selectors;
};

Home.prototype.navigateToPLP = function(browser) {
    this.browser
        .log('Navigating to PLP')
        .waitForElementVisible(selectors.plpItem)
        .click(selectors.plpItem)
        .waitUntilMobified()
        .waitForAjaxCompleted()
        .waitForAnimation();
    return this;
};

module.exports = Home;
