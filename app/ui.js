/**
 * Scripts required here will be combined into ui.js
 */

require([
    'global/ui',
    'pages/home/home-ui',
    'pages/sign-in/sign-in-ui',
    'pages/register/register-ui',
    'pages/account-information/account-information-ui',
    'pages/category-landing/category-landing-ui',
    'pages/category-landing-2/category-landing-ui',
    'pages/product-list/product-list-ui',
    'pages/plp-br-seo/plp-br-seo-ui',
    'pages/product-details/product-details-ui',
    'pages/product-details-bundle/product-details-bundle-ui',
    'pages/address-book/address-book-ui',
    'pages/order-history/order-history-ui',
    'pages/account-change-password/account-change-password-ui',
    'pages/account-change-email/account-change-email-ui',
    'pages/customer-service/customer-service-ui',
    'pages/order-status-form/order-status-form-ui',
    'pages/gift-card/gift-card-ui',
    'pages/cart/cart-ui',
    'pages/checkout-sign-in/checkout-sign-in-ui',
    'pages/shipping-address/shipping-address-ui',
    'pages/checkout-gift-options/checkout-gift-options-ui',
    'pages/checkout-multi-address/checkout-multi-address-ui',
    'pages/order-review-and-payment/order-review-and-payment-ui',
    'pages/order-confirmation/order-confirmation-ui',
    'pages/confirmation-details/confirmation-details-ui',
    'pages/email-subscription/email-subscription-ui',
    'pages/email-register/email-register-ui',
    'pages/gift-card-balance/gift-card-balance-ui',
    'pages/write-a-review/write-a-review-ui'
    // Add additional UI scripts here
],
function(
    globalUI,
    home,
    signIn,
    registerUI,
    accuntInformationUI,
    categoryLandingUI,
    categoryLandingUI2,
    productListUI,
    plpBrSeoUI,
    productDetailsUI,
    productDetailsBundleUI,
    addressBookUI,
    orderHistoryUI,
    acountChangePassword,
    accountChangeEmail,
    CustomerService,
    OrderStatusForm,
    GiftCard,
    cartUI,
    shippingAddressUI,
    checkoutGiftOptionsUI,
    checkoutMultiAddressUI,
    orderReviewAndPaymentUI,
    orderConfirmationUI,
    confirmationDetailsUI,
    EmailSubscriptionUI,
    EmailRegisterUI,
    giftCardBalanceUI,
    writeAReviewUI
) {

    // This file gets pre-loaded so we dont' want to explicitly execute
    //  anything here. Instead we will wait for a require statement run
    //  in our template

}, null, true); // relPath, forceSync
