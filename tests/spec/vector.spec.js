describe("Vector Model", function () {
    var defaultVector = {x: 1, y: 1}, Vector;
    beforeEach(function () {
        module('aidemo.models.vector');

        inject(function (_Vector_) {
            Vector = _Vector_;
        });
    });

    it('should build a Vector object', function () {
        var vector = Vector.build(defaultVector);

        expect(vector.x).toBe(1);
        expect(vector.y).toBe(1);
    });

    it('should compare the x and y of two vectors and return whether or not both match', function () {
        var vectorA = new Vector(defaultVector),
            vectorB = new Vector(defaultVector),
            vectorC = new Vector();

        var resultA = vectorA.compare(vectorA),
            resultB = vectorA.compare(vectorB),
            resultC = vectorA.compare(vectorC);

        expect(resultA).toBeTruthy();
        expect(resultB).toBeTruthy();
        expect(resultC).toBeFalsy();
    });

    it("should instantiate properly", function () {
        var vecOne = new Vector(),
            vecTwo = new Vector({x: 1}),
            vecThree = new Vector({y: 1}),
            vecFour = new Vector({x: 1, y: 1});

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
        var vec = new Vector(defaultVector), res,
            expected = Math.sqrt(Math.pow(defaultVector.x, 2) + Math.pow(defaultVector.y, 2));

        res = vec.length();

        expect(res).toBe(expected);
    });

    it("should calculate it's magnitude (another name for length)", function () {
        var vec = new Vector(defaultVector), res;

        spyOn(vec, 'length').and.callFake(function () {
            return 1;
        });

        res = vec.magnitude();

        expect(res).toBe(1);
        expect(vec.length).toHaveBeenCalled();
    });

    it("should calculate it's normal", function () {
        var vec = new Vector(defaultVector), res, length = vec.length(),
            expected = new Vector({x: (defaultVector.x / length), y: (defaultVector.y / length)});

        res = vec.normalize();

        expect(res.x).toEqual(expected.x);
        expect(res.y).toEqual(expected.y);
    });

    it("should add two vectors and return a new instance", function () {
        var vecOne = new Vector(defaultVector),
            vecTwo = new Vector({x: -1, y: 2}), res,
            expected = {x: vecOne.x + vecTwo.x, y: vecOne.y + vecTwo.y};

        res = vecOne.addNew(vecTwo);

        expect(res.x).toEqual(expected.x);
        expect(res.y).toEqual(expected.y);
    });

    it("should add two vectors and mutate the original", function () {
        var vecOne = new Vector(defaultVector),
            vecTwo = new Vector({x: -1, y: 2}),
            expected = {x: vecOne.x + vecTwo.x, y: vecOne.y + vecTwo.y};

        vecOne.add(vecTwo);

        expect(vecOne.x).toEqual(expected.x);
        expect(vecOne.y).toEqual(expected.y);
    });

    it("should subtract two vectors and return a new instance", function () {
        var vecOne = new Vector(defaultVector),
            vecTwo = new Vector({x: -1, y: 2}), res,
            expected = {x: vecOne.x - vecTwo.x, y: vecOne.y - vecTwo.y};

        res = vecOne.subNew(vecTwo);

        expect(res.x).toEqual(expected.x);
        expect(res.y).toEqual(expected.y);
    });

    it("should subtract two vectors and mutate the original", function () {
        var vecOne = new Vector(defaultVector),
            vecTwo = new Vector({x: -1, y: 2}),
            expected = {x: vecOne.x - vecTwo.x, y: vecOne.y - vecTwo.y};

        vecOne.sub(vecTwo);

        expect(vecOne.x).toEqual(expected.x);
        expect(vecOne.y).toEqual(expected.y);
    });

    it("should multiply a vector by a scalar and return a new instance", function () {
        var vec = new Vector({x: 2, y: -2}), res, scalar = 4,
            expected = {x: vec.x * scalar, y: vec.y * scalar};

        res = vec.mulNew(scalar);

        expect(res.x).toEqual(expected.x);
        expect(res.y).toEqual(expected.y);
    });

    it("should multiply a vector by a scalar and mutate the original", function () {
        var vec = new Vector({x: 2, y: -2}), scalar = 4,
            expected = {x: vec.x * scalar, y: vec.y * scalar};

        vec.mul(scalar);

        expect(vec.x).toEqual(expected.x);
        expect(vec.y).toEqual(expected.y);
    });

    it("should divide a vector by a scalar and return a new instance", function () {
        var vec = new Vector({x: 2, y: -2}), res, scalar = 4,
            expected = {x: vec.x / scalar, y: vec.y / scalar};

        res = vec.divNew(scalar);

        expect(res.x).toEqual(expected.x);
        expect(res.y).toEqual(expected.y);
    });

    it("should divide a vector by a scalar and mutate the original", function () {
        var vec = new Vector({x: 2, y: -2}), scalar = 4,
            expected = {x: vec.x / scalar, y: vec.y / scalar};

        vec.div(scalar);

        expect(vec.x).toEqual(expected.x);
        expect(vec.y).toEqual(expected.y);
    });

    it('should convert an angle to a Vector object', function () {
        var vector = Vector.angleToVector(180);

        expect(vector.x).toBe(-1);
        expect(vector.y).toBe(0);
    });

    it('should convert a vector to an angle in radians', function () {
        var vector = new Vector(defaultVector),
            angle = vector.vectorToAngleRadians();

        expect(angle).toBe(45 * Math.PI / 180);
    });

    it('should convert a vector to an angle in degrees', function () {
        var vector = new Vector(defaultVector),
            angle = vector.vectorToAngleDegrees();

        expect(angle).toBe(45);
    });

    it("should calculate the distance between two vectors", function () {
        var vecOne = new Vector({x: 10, y: 5}),
            vecTwo = new Vector({x: 5, y: 10}),
            expected = Math.sqrt(Math.pow(vecOne.x - vecTwo.x, 2) + Math.pow(vecOne.y - vecTwo.y, 2)),
            res;

        res = vecOne.distance(vecTwo);

        expect(res).toEqual(expected);
    });

    //it('should dosomething', function () {
    //
    //});

    it("should return itself as a JSON object when converted to a string", function () {
        var vec = new Vector({x: 2, y: -2}), res,
            expected = {x: vec.x, y: vec.y};

        res = vec.toString();

        expect(res.x).toEqual(expected.x);
        expect(res.y).toEqual(expected.y);
    });
});