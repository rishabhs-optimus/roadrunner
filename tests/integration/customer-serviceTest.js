define([
    'lib/viewMocker',
    'pages/customer-service/customer-service-view',
    'text!fixtures/customer-service.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('customer-service view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('customer-service', 'customer-service context has correct template name');
        }
    });

    test('customer-service view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-customer-service')).to.be.true;
        }
    });
});
