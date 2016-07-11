define(['$'], function($) {


    var mystore = function() {

        var $myStores = $('#myStoreSelector');
        $myStores.find('span').hide();
        $myStores.find('a').text('My Store');
        return $myStores;

    };

    var parse = function() {

        var $myAccount = $('#myAccount a');
        var $orderStatus = $('#orderStatus a');
        var $giftregistry = $('#giftregistry a');
        var $myStore = mystore();

        var myAccountLinks = [];

        $myAccount.length && myAccountLinks.push($myAccount.clone().text('Account Settings & Info'));
        $orderStatus.length && myAccountLinks.push($orderStatus);
        $giftregistry.length && myAccountLinks.push($giftregistry);
        $myStore.length && myAccountLinks.push($myStore);

        return {
            myAccountLinks: myAccountLinks
        };
    };

    return {
        parse: parse
    };
});
