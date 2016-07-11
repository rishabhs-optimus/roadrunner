define([
    '$',
    'global/baseView',
    'dust!pages/customer-service/customer-service',
    'dust!pages/customer-service/partials/terms',
    'global/includes/top-nav/top-nav-context',
    'pages/customer-service/parsers/terms'
],
function(
    $,
    BaseView,
    template,
    TermsTemplate,
    topNav,
    Terms
) {
    var _getSubTemplateName = function() {
        var subTemplateModifier = /\/(.*)\/content/.exec(location.pathname);
        // To return t--order-form instead of t--undefined on order form page
        var isOrderForm = false;
        if (location.search.indexOf('_ORDER_FORM') > 1) {
            isOrderForm = true;
        }
        if (!subTemplateModifier && !isOrderForm) {
            return;
        }
        if (isOrderForm) {
            return 'order-form';
        }

        subTemplateModifier = subTemplateModifier[1].replace(' ', '-').replace('/', '');

        return subTemplateModifier;
    };

    var _selectorMatch = function(selector, count) {
        return $(selector).length === count;
    };

    var _orderInformation = function($context) {
        var $orderFormHeader = $context.find('h2:contains("Order Form")');
        var $link = $orderFormHeader.next().remove().find('a');
        $link.contents().wrapAll('<div class="c-arrange__item">');
        $('<div class="c-arrange__item c--shrink u-margin-start-md u-margin-end-lg">' +
            '<svg class="c-icon" data-fallback="img/png/pdf.png">' +
            '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-pdf">' +
            '</use></svg></div>').insertBefore($link.find('.c-arrange__item'));
        $link.contents().wrapAll('<div class="c-arrange c--align-middle">');
        $link.insertAfter($orderFormHeader);
    };

    var _conditionOfUse = function($context, skip) {
        var data = Terms.parse($context, skip);
        new TermsTemplate(data, function(err, html) {
            $context.html(html);
        });
    };

    var _shippingInformation = function($context) {
        var $tollFreeParagraph = $context.find('p').last();
        var $taxParagraph = $tollFreeParagraph.prev().prev();

        $tollFreeParagraph.contents().eq(2).replaceWith($tollFreeParagraph.contents().eq(2).text() + ' ');
        $taxParagraph.contents().eq(0).replaceWith($taxParagraph.contents().eq(0).text() + ' ');
    };

    return {
        template: template,
        extend: BaseView,
        includes: {
            topNav: topNav
        },

        preProcess: function(context) {
            if (BaseView.preProcess) {
                context = BaseView.preProcess(context);
            }

            // Hard code title
            if (_getSubTemplateName() === 'returns-and-exchgs') {
                $('.customer-service-left-col').find('h1').first().before($('<h1>Returns & Exchanges</h1>' +
                  '<span class="t-customer-service__guarantee">' + $('#guarantee_box').find('img').first().attr('alt') + '</span>'));
            }
        },

        postProcess: function(context) {
            if (BaseView.postProcess) {
                context = BaseView.postProcess(context);
            }

            // add sub-template class
            $('body').addClass('t--' + context.subTemplateName);
        },

        context: {
            templateName: 'customer-service',
            subTemplateName: function() {
                return _getSubTemplateName();
            },
            isSizeChart: function() {
                return $('h1.inner:contains("Sizing Chart")').length > 0;
            },
            pageTitle: function() {
                return $('.customer-service-left-col').find('h1').first().remove().text();
            },
            leftContent: function() {
                var $leftContent = $('.customer-service-left-col').addClass('u-margin-bottom-lg');
                $leftContent.map(function(_, content) {
                    var $content = $(content);
                    if (_selectorMatch('h2:contains("Order Form")', 1)) {
                        _orderInformation($content);
                    } else if (_selectorMatch('h1:contains("Conditions of Use")', 1) || _selectorMatch('h2:contains("Consumer Privacy")', 1)) {
                        _conditionOfUse($content, 0);
                    } else if (_selectorMatch('h2:contains("Information we collect about you")', 1)) {
                        _conditionOfUse($content, 1);
                    } else if (_selectorMatch('p:contains("Standard Shipping service")', 1)) {
                        _shippingInformation($content);
                    }
                });
                return $leftContent;
            },
            sizeChartInfo: function() {
                // Remove image from page
                var $sizeChartContent = $('.customer-service-left-col').has('img[alt="sizing chart"]');

                return $sizeChartContent.map(function(_, content) {
                    var $content = $(content);
                    var $links = $content.find('a');

                    // Remove the image
                    $content.find('img').remove();

                    // Remove the | seperator
                    $content.find('p').last().contents()[$content.find('p').last().contents().index($content.find('p a').last()) - 1].remove();

                    $links.map(function(_, link) {
                        var $link = $(link);

                        $link.attr('data-href', $link.attr('onclick'));
                        $link.removeAttr('onclick')
                        .removeAttr('href')
                        .addClass('js-size-char-link c-button c--secondary c--full-width c--thick-border c--short u-margin-bottom-lg')
                        .wrap('<div class="c-arrange__item" />');

                        return $link;
                    });

                    $sizeChartContent.find('.c-arrange__item').wrapAll('<div class="c-arrange c--gutters" />');

                    // $links.addClass('c-button c--yellow js-size-char-link');
                    return $content.find('p');
                });
            },
            sizeChartTitle: function() {
                return $('<div class="js-size-chart-title"/>');
            },
            sizeChartContent: function() {
                return $('<div class="js-size-chart-content"/>');
            }
        }

        /**
         * If you wish to override preProcess/postProcess in this view, have a look at the documentation:
         * http://adaptivejs.mobify.com/v1.0/docs/views
         */
    };
});
