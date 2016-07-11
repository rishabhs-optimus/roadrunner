define([
    'lib/viewMocker',
    'pages/gift-card/gift-card-view',
    'text!fixtures/gift-card.html',
    'chai'
],
function(test, view, fixture, chai) {
    var expect = chai.expect;

    test('gift-card view context', view, fixture, {
        'context contains the correct template name': function($, context) {
            var templateName = context.templateName;
            expect(templateName).to.equal('gift-card', 'gift-card context has correct template name');
        }
    });

    test('gift-card view DOM', view, fixture, {
        'adaptation adds the correct template class': function($) {
            var $body = $('body').last();

            expect($body.hasClass('t-gift-card')).to.be.true;
        }
    });
});
