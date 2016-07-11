define(['$'], function($) {
    var _parse = function($bvContainer) {
        return {
            reviewDate: $bvContainer.find('.BVQAElapsedTime').text(),
            reviewerGender: $bvContainer.find('.BVQAContextDataValueGender').text(),
            reviewerAge: $bvContainer.find('.BVQAContextDataValueContainerAge').map(function(i, info) {
                var $info = $(info);
                return {
                    label: $info.find('.BVQAContextDataValuePrefix').text(),
                    value: $info.find('.BVQAContextDataValue').text()
                };
            }),
            signature: $bvContainer.find('.BVQASignature').map(function(i, signature) {
                var $signature = $(signature);
                return {
                    by: $signature.find('.BVQAWrittenBy').text(),
                    userLink: $signature.find('.BVQANickname').html(),
                    location: $signature.find('.BVQALocation').text(),

                };
            })
        };
    };

    return {
        parse: _parse
    };
});
