describe("MathUtils Service", function () {
    var MathUtils, $window, Vector;

    beforeEach(function () {
        module('aidemo.service.mathUtils', 'aidemo.models.vector', function ($provide) {
            $provide.value('$window', {
                alert: function(msg){}
            });
        });

        inject(function (_MathUtils_, _$window_, _Vector_) {
            MathUtils = _MathUtils_;
            $window = _$window_;
            Vector = _Vector_;
        });
    });

    it("should generate a random number", function () {
        var min = 0,
            max = 10,
            expected = 5,
            res;
        spyOn(Math, 'random').and.callFake(function () {
            return .5;
        });

        res = MathUtils.getRandomNumber(min, max);

        expect(Math.random.calls.count()).toEqual(1);
        expect(res).toEqual(expected);
    });

    it('should compare two objects and return whether they are the same or not as a boolean', function () {
        var objectOne = {
                position: new Vector()
            },
            objectTwo = {
                position: new Vector()
            };

        var resultsOne = MathUtils._isSameObject(objectOne, objectTwo),
            resultsTwo = MathUtils._isSameObject(objectOne, objectOne);

        expect(resultsOne).toBeFalsy();
        expect(resultsTwo).toBeTruthy();
    });

    it("should calculate if two objects are within tolerance distance of each other if they're not the same object", function () {
        var objectOne = {
                position: new Vector()
            },
            objectTwo = {
                position: new Vector({x: 1})
            },
            objectThree = {
                position: new Vector({x: 6})
            },
            objectFour = {},
            tolerance = 5;

        spyOn(MathUtils, "_isSameObject").and.callThrough();
        spyOn(objectOne.position, 'distance').and.callThrough();

        var resultsOne = MathUtils._isDistanceWithinTolerance(objectOne, objectOne, tolerance);
        expect(resultsOne).toBeFalsy();

        expect(MathUtils._isSameObject.calls.count()).toBe(1);

        var resultsTwo = MathUtils._isDistanceWithinTolerance(objectOne, objectTwo, tolerance);
        expect(resultsTwo).toBeTruthy();

        expect(MathUtils._isSameObject.calls.count()).toBe(2);
        expect(objectOne.position.distance.calls.count()).toBe(1);

        var resultsThree = MathUtils._isDistanceWithinTolerance(objectOne, objectThree, tolerance);
        expect(resultsThree).toBeFalsy();

        expect(MathUtils._isSameObject.calls.count()).toBe(3);
        expect(objectOne.position.distance.calls.count()).toBe(2);

        spyOn($window, 'alert').and.callFake(function(e){});

        var resultsFour = MathUtils._isDistanceWithinTolerance(objectOne, objectFour, tolerance);
        expect(resultsFour).toBeFalsy();

        expect(MathUtils._isSameObject.calls.count()).toBe(4);
        expect(objectOne.position.distance.calls.count()).toBe(3);
        expect($window.alert).toHaveBeenCalled();
    });

    it("should get the nearest objects to a given object", function () {
        var array = [
                {id: 1, position: new Vector({x: 10, y: 0})},
                {id: 2, position: new Vector({x: 30, y: 30})},
                {id: 3, position: new Vector({x: 70, y: 70})}
            ],
            origin = {position: new Vector({x: 40, y: 40})},
            tolerance = 20, res;

        spyOn(MathUtils, '_isDistanceWithinTolerance').and.callFake(function (ori, other, tol) {
            expect(ori).toBe(origin);
            expect(other.id).toBeDefined();
            expect(tol).toBe(tolerance);
            return other.id === 2;
        });

        res = MathUtils.getNearestObjects(array, origin, tolerance);

        expect(res).not.toContain(array[0]);
        expect(res).toContain(array[1]);
        expect(res).not.toContain(array[2]);
    });
});



