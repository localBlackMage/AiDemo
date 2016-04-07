describe("ScreenSize Service", function () {
    'use strict';
    var ScreenSize, $window;

    beforeEach(function () {
        module('aidemo.service.screenSize');

        inject(function (_ScreenSize_, _$window_) {
            ScreenSize = _ScreenSize_;
            $window = _$window_;
        });
    });

    it("should return the width and height of the window", function () {
        var windowMock = {
            width:function(){},
            height:function(){}
        };

        spyOn(window, '$').and.callFake(function(element) {
            expect(element).toBe($window);
            return windowMock;
        });
        spyOn(windowMock, 'width').and.callFake(function() {
            return 10;
        });
        spyOn(windowMock, 'height').and.callFake(function() {
            return 20;
        });

        var viewport = ScreenSize.getViewPort();

        expect(viewport.width).toBe(10);
        expect(viewport.height).toBe(20);
    });
});