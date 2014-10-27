describe("Vector Tests", function () {
    var defVec = {x: 1, y: 1};
    beforeEach(module("DemoApp"));

    it("should instantiate properly", function () {
        var vecOne = New (Vector, {}),
            vecTwo = New (Vector, {x: 1}),
            vecThree = New (Vector, {y: 1}),
            vecFour = New (Vector, {x: 1, y: 1});

        expect(vecOne.x).toBe(0);
        expect(vecOne.y).toBe(0);

        expect(vecTwo.x).toBe(1);
        expect(vecTwo.y).toBe(0);

        expect(vecThree.x).toBe(0);
        expect(vecThree.y).toBe(1);

        expect(vecFour.x).toBe(1);
        expect(vecFour.y).toBe(1);
    });

    it("should calculate it's length", function () {
        var vec = New (Vector, defVec), res,
            expected = Math.sqrt(Math.pow(defVec.x, 2) + Math.pow(defVec.y, 2));

        res = vec.length();

        expect(res).toBe(expected);
    });

    it("should calculate it's normal", function () {
        var vec = New (Vector, defVec), scalar = 1, res, length = vec.length(),
            expected = New(Vector, {x: (this.x / length) * scalar, y: (this.y / length) * scalar});

        res = vec.normalize();

        expect(res.x).toEqual(expected.x);
        expect(res.y).toEqual(expected.y);
    });

    it("should add two vectors and return a new instance", function () {
        var vecOne = New (Vector, defVec),
            vecTwo = New (Vector, {x:-1, y:2}), res,
            expected = {x: vecOne.x + vecTwo.x, y: vecOne.y + vecTwo.y};

        res = vecOne.addNew(vecTwo);

        expect(res.x).toEqual(expected.x);
        expect(res.y).toEqual(expected.y);
    });

    it("should add two vectors and mutate the original", function () {
        var vecOne = New (Vector, defVec),
            vecTwo = New (Vector, {x:-1, y:2}),
            expected = {x: vecOne.x + vecTwo.x, y: vecOne.y + vecTwo.y};

        vecOne.add(vecTwo);

        expect(vecOne.x).toEqual(expected.x);
        expect(vecOne.y).toEqual(expected.y);
    });

    it("should subtract two vectors and return a new instance", function () {
        var vecOne = New (Vector, defVec),
            vecTwo = New (Vector, {x:-1, y:2}), res,
            expected = {x: vecOne.x - vecTwo.x, y: vecOne.y - vecTwo.y};

        res = vecOne.subNew(vecTwo);

        expect(res.x).toEqual(expected.x);
        expect(res.y).toEqual(expected.y);
    });

    it("should subtract two vectors and mutate the original", function () {
        var vecOne = New (Vector, defVec),
            vecTwo = New (Vector, {x:-1, y:2}),
            expected = {x: vecOne.x - vecTwo.x, y: vecOne.y - vecTwo.y};

        vecOne.sub(vecTwo);

        expect(vecOne.x).toEqual(expected.x);
        expect(vecOne.y).toEqual(expected.y);
    });

    it("should multiply a vector by a scalar and return a new instance", function () {
        var vec = New (Vector, {x: 2, y: -2}), res, scalar = 4,
            expected = {x: vec.x * scalar, y: vec.y * scalar};

        res = vec.mulNew(scalar);

        expect(res.x).toEqual(expected.x);
        expect(res.y).toEqual(expected.y);
    });

    it("should multiply a vector by a scalar and mutate the original", function () {
        var vec = New (Vector, {x: 2, y: -2}), scalar = 4,
            expected = {x: vec.x * scalar, y: vec.y * scalar};

        vec.mul(scalar);

        expect(vec.x).toEqual(expected.x);
        expect(vec.y).toEqual(expected.y);
    });

    it("should divide a vector by a scalar and return a new instance", function () {
        var vec = New (Vector, {x: 2, y: -2}), res, scalar = 4,
            expected = {x: vec.x / scalar, y: vec.y / scalar};

        res = vec.divNew(scalar);

        expect(res.x).toEqual(expected.x);
        expect(res.y).toEqual(expected.y);
    });

    it("should divide a vector by a scalar and mutate the original", function () {
        var vec = New (Vector, {x: 2, y: -2}), scalar = 4,
            expected = {x: vec.x / scalar, y: vec.y / scalar};

        vec.div(scalar);

        expect(vec.x).toEqual(expected.x);
        expect(vec.y).toEqual(expected.y);
    });

    it("should return itself as a JSON object when converted to a string", function () {
        var vec = New (Vector, {x: 2, y: -2}), res,
            expected = {x: vec.x, y: vec.y};

        res = vec.toString();

        expect(res.x).toEqual(expected.x);
        expect(res.y).toEqual(expected.y);
    });
});