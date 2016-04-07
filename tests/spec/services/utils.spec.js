describe("Utils Service", function () {
    'use strict';
    var Utils;

    beforeEach(function () {
        module('aidemo.service.utils');

        inject(function (_Utils_) {
            Utils = _Utils_;
        });
    });

    it("should determine if an object is null or undefined", function () {
        var objA = {field: 0},
            objB = null,
            objC = undefined,
            resA, resB, resC;

        resA = Utils.isNullOrUndefined(objA);
        resB = Utils.isNullOrUndefined(objB);
        resC = Utils.isNullOrUndefined(objC);

        expect(resA).toBeFalsy();
        expect(resB).toBeTruthy();
        expect(resC).toBeTruthy();
    });

    it("should determine if an object is greater than a minimum or NaN", function () {
        var min = 5,
            objA = 6,
            objB = NaN,
            objC = 4,
            resA, resB, resC;

        resA = Utils.isGreaterThanOrNaN(objA, min);
        resB = Utils.isGreaterThanOrNaN(objB, min);
        resC = Utils.isGreaterThanOrNaN(objC, min);

        expect(resA).toEqual(true);
        expect(resB).toEqual(true);
        expect(resC).toEqual(false);
    });
});