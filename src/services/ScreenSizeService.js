(function (ng) {
    'use strict';
    ng.module('aidemo.service.screenSize', [])
        .service('ScreenSize', ['$window',
            function ($window) {
                var self = this;

                /**
                 * Returns an object containing the width and height of the current window
                 * @returns {{width: number, height: number}}
                 */
                self.getViewPort = function () {
                    return {
                        width: $($window).width(),
                        height: $($window).height()
                    };
                };
            }
        ]);
})(angular);