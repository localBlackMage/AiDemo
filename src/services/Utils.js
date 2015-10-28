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

                return {
                    isNullOrUndefined: isNullOrUndefined,
                    isGreaterThanOrNaN: isGreaterThanOrNaN
                };
            }
        ]);
})(angular);