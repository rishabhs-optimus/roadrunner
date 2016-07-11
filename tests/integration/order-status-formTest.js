define([
    'lib/viewMocker',
    'pages/order-status-form/order-status-form-view',
    'text!fixtures/order-status-form.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('order-status-form view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('order-status-form', 'order-status-form context has correct template name');
        }
    });

    test('order-status-form view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-order-status-form')).to.be.true;
        }
    });
});
