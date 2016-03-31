(function (ng) {
    'use strict';
    ng.module('aidemo.service.utils', [])
        .factory('Utils', [
            function () {
                var isNullOrUndefined = function (obj) {
                    return _.isUndefined(obj) || _.isNull(obj);
                };

                var isGreaterThanOrNaN = function (obj, min) {
                    return parseInt(obj, 10) > min || _.isNaN(parseInt(obj, 10));
                };

                var generateImageFromURLObject = function (urlObject, which) {
                    var image = new Image();
                    image.src = urlObject[which];
                    return image;
                };

                return {
                    isNullOrUndefined: isNullOrUndefined,
                    isGreaterThanOrNaN: isGreaterThanOrNaN,
                    generateImageFromURLObject: generateImageFromURLObject
                };
            }
        ]);
})(angular);