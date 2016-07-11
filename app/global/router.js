define([
    '$',
    'adaptivejs/router',
    'global/utils/template-reader',
    'pages/home/home-view',
    'pages/sign-in/sign-in-view',
    'pages/register/register-view',
    'pages/email-subscription/email-subscription-view',
    'pages/email-register/email-register-view',
    'pages/account-information/account-information-view',
    'pages/category-landing/category-landing-view',
    'pages/category-landing-2/category-landing-view',
    'pages/product-list/product-list-view',
    'pages/plp-br-seo/plp-br-seo-view',
    'pages/product-details/product-details-view',
    'pages/product-details-bundle/product-details-bundle-view',
    'pages/write-a-review/write-a-review-view',
    'pages/account-overview/account-overview-view',
    'pages/change-payment/change-payment-view',
    'pages/edit-card/edit-card-view',
    'pages/address-book/address-book-view',
    'pages/order-history/order-history-view',
    'pages/account-order-details/account-order-details-view',
    'pages/account-change-email/account-change-email-view',
    'pages/account-change-password/account-change-password-view',
    'pages/customer-service/customer-service-view',
    'pages/order-status-form/order-status-form-view',
    'pages/gift-card/gift-card-view',
    'pages/cart/cart-view',
    'pages/checkout-sign-in/checkout-sign-in-view',
    'pages/shipping-address/shipping-address-view',
    'pages/checkout-gift-options/checkout-gift-options-view',
    'pages/checkout-multi-address/checkout-multi-address-view',
    'pages/order-review-and-payment/order-review-and-payment-view',
    'pages/order-confirmation/order-confirmation-view',
    'pages/confirmation-details/confirmation-details-view',
    'pages/gift-card-balance/gift-card-balance-view'
],
function($, Router, JSONTemplate, Home, SignIn, Register, EmailSubscription, EmailRegister,
    AccountInformation, CategoryLanding, CategoryLandingPage2,
    ProductList, PlpBrSeo, ProductDetails, ProductDetailsBundle,
    WriteAReview, AccountOverview, ChangePayment, EditCard, AddressBook, OrderHistory,
    AccountOrderDetails, AccountChangeEmail, AccountChangePassword, CustomerService,
    OrderStatusForm, GiftCard, Cart, CheckoutSignIn, ShippingAddress, CheckoutGiftOptions, CheckoutMultiAddress,
    OrderReviewAndPayment, OrderConfirmation, ConfirmationDetails, GiftCardBalance) {

    var router = new Router();

    router
        .add(Router.selectorMatch('#wrappall'), Home)
        .add(Router.selectorMatch('#userLogonForm + #userLogonRegistration'), SignIn)
        .add(Router.selectorMatch('#userRegistrationForm'), Register)
        .add(Router.selectorMatch('.view-SLIBodyView'), ProductList)
        .add(Router.selectorMatch('#gwt_subcategories_dp'), CategoryLanding)
        .add(Router.selectorMatch('#gwt_show_bv_rating_on_cat_page'), CategoryLandingPage2)
        .add(Router.selectorMatch('#BVSubmissionContainer'), WriteAReview)
        //Unique selector match was not found
        .add(Router.urlMatch('/EmailSubscribeView'), EmailSubscription)
        .add(Router.urlMatch('pages.travelsmith-email.com'), EmailRegister)
        .add(Router.urlMatch('/AccountInformationView'), AccountInformation)
        // Currently there is no router to match therefore used url match.
        .add(Router.selectorMatch('#product_suggestions'), ProductDetails)
        .add(function() {
            // There are some bundle detail pdps that looks like a single detail pdp
            var $jsonScript = $('#gwt_bundledetail_json');
            if ($jsonScript.length) {
                var jsonData = JSONTemplate.parse($jsonScript);
                console.log(jsonData);

                if (jsonData.ensembleTemplateNumber === '3') {
                    return false;
                }

                return true;
            }
            return false;
        }, ProductDetailsBundle)
        .add(Router.selectorMatch('#gwt_bundledetail_json'), ProductDetails)
        .add(Router.urlMatch('/shop'), PlpBrSeo)
        .add(Router.selectorMatch('.overviewWrapper'), AccountOverview)
        .add(Router.urlMatch('/CreditCardView'), ChangePayment)
        .add(Router.urlMatch('/CreditCardEditView'), EditCard)
        .add(Router.selectorMatch('#gwt_address_display_panel'), AddressBook)
        .add(Router.selectorMatch('.view-OrderHistoryView'), OrderHistory)
        .add(Router.selectorMatch('.view-OrderDetailsView'), AccountOrderDetails)
        .add(Router.selectorMatch('.view-ChangeEmailView'), AccountChangeEmail)
        .add(Router.selectorMatch('.view-ChangePassword'), AccountChangePassword)

        // .add(Router.selectorMatch('#sideBox'), CustomerService);
        // Customer dont want everything to be mobified
        .add(Router.urlMatch(/about[-_]us/i), CustomerService)
        .add(Router.urlMatch('/contact-us/content'), CustomerService)
        .add(Router.urlMatch('/order-form/content'), CustomerService)
        .add(Router.urlMatch('/order-tracking/content'), CustomerService)
        .add(Router.urlMatch('/returns-and-exchgs/content'), CustomerService)
        .add(Router.urlMatch('/shipping-and-processing/content'), CustomerService)
        .add(Router.urlMatch('/your-privacy-rights/content'), CustomerService)
        .add(Router.urlMatch('/gift-services/content'), CustomerService)
        .add(Router.urlMatch('/sizing-chart/content'), CustomerService)
        .add(Router.urlMatch('/full-privacy/'), CustomerService)

        // Thanks Optimus but we cant use this since there are many outscoped page with this generic url
        // We have found this url match for order form page
        .add(Router.urlMatch('WCM_ORDER_FORM'), CustomerService)

        .add(Router.urlMatch(/RETURNS_AND_EXCHGS/i), CustomerService)
        .add(Router.urlMatch(/SHIPPING_AND_PROCESSING/i), CustomerService)
        .add(Router.urlMatch(/CONTACT_US/i), CustomerService)
        .add(Router.urlMatch(/SIZING_CHART/i), CustomerService)


        .add(Router.urlMatch('/gift-card'), GiftCard)
        .add(Router.selectorMatch('#gwt_gift_card_balance'), GiftCardBalance)

        .add(Router.urlMatch('/conditions-of-use/content'), CustomerService)
        .add(Router.urlMatch('CONDITIONS_OF_USE'), CustomerService)

        .add(Router.urlMatch('/OrderStatusView'), OrderStatusForm)
        .add(Router.selectorMatch('#guestLogon'), CheckoutSignIn)
       .add(Router.selectorMatch('.view-BillingShippingAddressDisplayView'), ShippingAddress)
       .add(Router.selectorMatch('.data.GiftWrap'), CheckoutGiftOptions)
       .add(Router.selectorMatch('.view-MultipleShippingAddressDisplayView'), CheckoutMultiAddress)
       .add(Router.selectorMatch('.view-OrderReviewDisplayView'), OrderReviewAndPayment)
       .add(Router.selectorMatch('.view-OrderConfirmationView'), OrderConfirmation)
       .add(Router.selectorMatch('.view-OrderConfirmationDisplayView'), ConfirmationDetails)
       .add(Router.selectorMatch('.view-ShoppingCartView'), Cart);

    return router;
});
