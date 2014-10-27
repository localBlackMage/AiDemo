describe("Utils Tests", function () {
    var grid = [
        [{id:0}, {id:1}, {id:2}],
        [{id:3}, {id:4}, {id:5}],
        [{id:6}, {id:7}, {id:8}]
    ];
    beforeEach(module("DemoApp"));

    it("should determine if an object is null or undefined", function () {
        var objA = {field:0}, objB = null, objC = undefined,
            resA, resB, resC;

        resA = IsNotNullOrUndefined(objA);
        resB = IsNotNullOrUndefined(objB);
        resC = IsNotNullOrUndefined(objC);

        expect(resA).toEqual(true);
        expect(resB).toEqual(false);
        expect(resC).toEqual(false);
    });

    it("should determine if an object is greater than a minimum or NaN", function () {
        var min = 5, objA = 6, objB = NaN, objC = 4,
            resA, resB, resC;

        resA = IsGreaterThanOrNaN(objA, min);
        resB = IsGreaterThanOrNaN(objB, min);
        resC = IsGreaterThanOrNaN(objC, min);

        expect(resA).toEqual(true);
        expect(resB).toEqual(true);
        expect(resC).toEqual(false);
    });

    it("should return an array of neighboring nodes on a grid including diagonals", function () {
        var x = 1, y = 1, xLen = 3, yLen = 3, res;

        res = getNeighbors(x, y, xLen, yLen, grid, false);

        expect(res).toContain(grid[0][0]);
        expect(res).toContain(grid[0][1]);
        expect(res).toContain(grid[0][2]);
        expect(res).toContain(grid[1][0]);
        expect(res).not.toContain(grid[1][1]);
        expect(res).toContain(grid[1][2]);
        expect(res).toContain(grid[2][0]);
        expect(res).toContain(grid[2][1]);
        expect(res).toContain(grid[2][2]);
    });

    it("should return an array of neighboring nodes on a grid excluding diagonals", function () {
        var x = 1, y = 1, xLen = 3, yLen = 3, res;

        res = getNeighbors(x, y, xLen, yLen, grid, true);

        expect(res).not.toContain(grid[0][0]);
        expect(res).toContain(grid[0][1]);
        expect(res).not.toContain(grid[0][2]);
        expect(res).toContain(grid[1][0]);
        expect(res).not.toContain(grid[1][1]);
        expect(res).toContain(grid[1][2]);
        expect(res).not.toContain(grid[2][0]);
        expect(res).toContain(grid[2][1]);
        expect(res).not.toContain(grid[2][2]);
    });

    it("should fill the neighbors of each node in a given grid", function () {
        var cellGrid = [
                [New (Cell, {}), New (Cell, {}), New (Cell, {})],
                [New (Cell, {}), New (Cell, {}), New (Cell, {})],
                [New (Cell, {}), New (Cell, {}), New (Cell, {})]
            ],
            res;
        spyOn(cellGrid[0][0], "fillNeighbors");
        spyOn(cellGrid[0][1], "fillNeighbors");
        spyOn(cellGrid[0][2], "fillNeighbors");
        spyOn(cellGrid[1][0], "fillNeighbors");
        spyOn(cellGrid[1][1], "fillNeighbors");
        spyOn(cellGrid[1][2], "fillNeighbors");
        spyOn(cellGrid[2][0], "fillNeighbors");
        spyOn(cellGrid[2][1], "fillNeighbors");
        spyOn(cellGrid[2][2], "fillNeighbors");

        res = fillNeighbors(cellGrid, false);

        expect(cellGrid[0][0].fillNeighbors.calls.count()).toEqual(1);
        expect(cellGrid[0][1].fillNeighbors.calls.count()).toEqual(1);
        expect(cellGrid[0][2].fillNeighbors.calls.count()).toEqual(1);

        expect(cellGrid[1][0].fillNeighbors.calls.count()).toEqual(1);
        expect(cellGrid[1][1].fillNeighbors.calls.count()).toEqual(1);
        expect(cellGrid[1][2].fillNeighbors.calls.count()).toEqual(1);

        expect(cellGrid[2][0].fillNeighbors.calls.count()).toEqual(1);
        expect(cellGrid[2][1].fillNeighbors.calls.count()).toEqual(1);
        expect(cellGrid[2][2].fillNeighbors.calls.count()).toEqual(1);
    });
});