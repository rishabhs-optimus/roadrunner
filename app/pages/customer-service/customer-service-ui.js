define([
    '$',
    'global/includes/top-nav/top-nav-ui',
    // 'pages/product-details/ui/size-chart-ui'
], function(
    $,
    topNavUI) {

    var customerServiceUI = function() {
        // console.log('customerService UI');
        // topNavUI.init();
        // //sizeChartUI.initSheet();
        //
        // var $shippingTable = $('.t--shipping-and-processing').find('table');
        //
        // $shippingTable.addClass('c-table c--borderless');
        // $shippingTable.find('tbody').addClass('c-table__body');
        //
        // var urlRegex = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/;
        //
        // $('.js-size-char-link').on('click', function(e) {
        //     var urlMatch = urlRegex.exec($(e.target).attr('data-href'));
        //     var url = urlMatch[4] + urlMatch[6];
        //     $.ajax({
        //         url: url,
        //         complete: function(xhr) {
        //             var $sizeChartData = $(xhr.responseText);
        //             var $sizeChartPinny = $('.js-size-chart-pinny');
        //             var $sizeChartContent = $sizeChartData.filter('#size-charts-all');
        //
        //             $sizeChartPinny.pinny('open');
        //             sizeChartUI.init($sizeChartContent, $sizeChartPinny, url);
        //         }
        //     });
        // });
    };

    return customerServiceUI;
});
