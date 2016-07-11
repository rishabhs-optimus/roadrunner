define(['$'], function($) {

    var _styleForm = function() {

        var $orderStatusForm = $('.t-order-status-form').find('#orderStatusForm');
        var $forgotLink = $orderStatusForm.find('p a');

        $orderStatusForm.find('.required').addClass('u-text-error');
        $orderStatusForm.find('.spot.actions').addClass('u-margin-top-lg');
        $forgotLink.parent().addClass('c-text-content u-margin-top-lg').insertAfter('.spot.actions');
        $forgotLink.wrap('<strong />');
    };

    var orderStatusFormUI = function() {
        console.log('orderStatusForm UI');

        _styleForm();
        // Add any scripts you would like to run on the orderStatusForm page only here
    };

    return orderStatusFormUI;
});
