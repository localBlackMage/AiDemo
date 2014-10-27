describe("MathUtils Tests", function () {
    beforeEach(module("DemoApp"));

    it("should generate a random number", function () {
        var min = 0, max = 10, expected = 5, res;
        spyOn(Math, 'random').and.callFake(function() { return .5; });

        res = MathUtils.getRand(min, max);

        expect(Math.random.calls.count()).toEqual(1);
        expect(res).toEqual(expected);
    });

    it("should calculate the distance between two vectors", function () {
        var vecOne = New(Vector, {x: 10, y: 5}),
            vecTwo = New(Vector, {x: 5, y: 10}),
            expected = vecOne.subNew(vecTwo).length(), res;

        res = MathUtils.distance(vecOne, vecTwo);

        expect(res).toEqual(expected);
    });

    it("should get the nearest items to a given point", function () {
        var array = [
                {pos:New (Vector, {x:10,y:0})},
                {pos:New (Vector, {x:30,y:30})},
                {pos:New (Vector, {x:70,y:70})}
            ],
            origin = {pos:New (Vector, {x:40,y:40})},
            tolerance = 20, res;

        res = MathUtils.getNearest(array, origin, tolerance);

        expect(res).not.toContain(array[0]);
        expect(res).toContain(array[1]);
        expect(res).not.toContain(array[2]);
    });

    it("should calculate a vector from a given angle", function () {
        var angle = 90, res,
            expected = New(Vector, {x: parseFloat(Math.sin(angle)), y: -parseFloat(Math.cos(angle))});

        res = MathUtils.angleToVector(angle);

        expect(res.x).toEqual(expected.x);
        expect(res.y).toEqual(expected.y);
    });

    it("should calculate an angle from a given vector", function () {
        var vec = New(Vector, {x:10,y:10}), res,
            expected = parseFloat(Math.atan2(vec.x, -vec.y));

        res = MathUtils.vectorToAngle(vec);

        expect(res).toEqual(expected);
    });
});