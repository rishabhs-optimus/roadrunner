define([
    '$',
],
function($) {

    var animationListener = function() {

        if (event.animationName === 'reviewsContainer') {
            $('#BVSubmissionContainer').find('select').wrap('<div class="c-select"></div>');
            $('#BVRRFieldTextReviewUseremailID').attr('type', 'email');
            $('#BVRRSubmissionErrorID').insertBefore('#BVRRProductInformationID');
            $('.BVRRFieldFollowingText').on( 'click', function() {
                $('.BVRRFieldFollowingText').closest('label').trigger('click');
            });

        }
    };

    var bindAnimationListener = function() {
        // Add event listeners for an welcome panel being added.
        document.addEventListener('animationStart', animationListener);
        document.addEventListener('webkitAnimationStart', animationListener);
    };

    var writeAReviewUI = function() {
        bindAnimationListener();
    };


    return writeAReviewUI;
});
