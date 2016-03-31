describe("AStar Service", function () {
    var GridService, $log, Utils, grid;

    beforeEach(function () {
        module('aidemo.service.gridService', 'aidemo.service.utils');

        inject(function (_GridService_, _$log_, _Utils_) {
            GridService = _GridService_;
            $log = _$log_;
            Utils = _Utils_;

            grid = [
                [{
                    id: 0, box: {}, stats: '', fillNeighbors: function (list) {
                    }
                }, {
                    id: 1, box: {}, stats: '', fillNeighbors: function (list) {
                    }
                }, {
                    id: 2, box: {}, stats: '', fillNeighbors: function (list) {
                    }
                }],
                [{
                    id: 3, box: {}, stats: '', fillNeighbors: function (list) {
                    }
                }, {
                    id: 4, box: {}, stats: '', fillNeighbors: function (list) {
                    }
                }, {
                    id: 5, box: {}, stats: '', fillNeighbors: function (list) {
                    }
                }],
                [{
                    id: 6, box: {}, stats: '', fillNeighbors: function (list) {
                    }
                }, {
                    id: 7, box: {}, stats: '', fillNeighbors: function (list) {
                    }
                }, {
                    id: 8, box: {}, stats: '', fillNeighbors: function (list) {
                    }
                }]
            ];
        });
    });

    it("should get neighbors for a given set of coordinates", function () {
        spyOn(_, 'isBoolean').and.callThrough();
        spyOn(Utils, 'isNullOrUndefined').and.callFake(function (item) {
            return false;
        });

        var results = GridService.getNeighborsForCoordinates(1, 1, grid, true);

        expect(results.length).toBe(4);
        expect(_.isBoolean.calls.count()).toBe(1);
        expect(Utils.isNullOrUndefined.calls.count()).toBe(4);


        results = GridService.getNeighborsForCoordinates(1, 1, grid, false);

        expect(results.length).toBe(8);
        expect(_.isBoolean.calls.count()).toBe(2);
        expect(Utils.isNullOrUndefined.calls.count()).toBe(12);
    });

    it("should fill grid neighbors for a given grid", function () {
        spyOn(_, 'isBoolean').and.callThrough();
        spyOn(_, 'isFunction').and.callThrough();
        spyOn(GridService, 'getNeighborsForCoordinates').and.callFake(function (x, y, nGrid, noDiag) {
            expect(nGrid).toBe(grid);
            expect(noDiag).toBeTruthy();
            return [];
        });

        spyOn(grid[0][0], 'fillNeighbors').and.callThrough();
        spyOn(grid[0][1], 'fillNeighbors').and.callThrough();
        spyOn(grid[0][2], 'fillNeighbors').and.callThrough();
        spyOn(grid[1][0], 'fillNeighbors').and.callThrough();
        spyOn(grid[1][1], 'fillNeighbors').and.callThrough();
        spyOn(grid[1][2], 'fillNeighbors').and.callThrough();
        spyOn(grid[2][0], 'fillNeighbors').and.callThrough();
        spyOn(grid[2][1], 'fillNeighbors').and.callThrough();
        spyOn(grid[2][2], 'fillNeighbors').and.callThrough();

        var results = GridService.fillGridNeighbors(grid, true);

        expect(results).toBe(grid);
        expect(_.isBoolean.calls.count()).toBe(1);
        expect(_.isFunction.calls.count()).toBe(9);
        expect(GridService.getNeighborsForCoordinates.calls.count()).toBe(9);
        expect(grid[0][0].fillNeighbors.calls.count()).toBe(1);
        expect(grid[0][1].fillNeighbors.calls.count()).toBe(1);
        expect(grid[0][2].fillNeighbors.calls.count()).toBe(1);
        expect(grid[1][0].fillNeighbors.calls.count()).toBe(1);
        expect(grid[1][1].fillNeighbors.calls.count()).toBe(1);
        expect(grid[1][2].fillNeighbors.calls.count()).toBe(1);
        expect(grid[2][0].fillNeighbors.calls.count()).toBe(1);
        expect(grid[2][1].fillNeighbors.calls.count()).toBe(1);
        expect(grid[2][2].fillNeighbors.calls.count()).toBe(1);
    });

    it("should create a deep copy of a grid", function () {
        var fakeObject = null,
            realObject = function (params) {
            };

        realObject = jasmine.createSpy('realObject');
        spyOn(_, 'isFunction').and.callThrough();
        spyOn(_, 'isBoolean').and.callThrough();
        spyOn($log, 'error').and.callFake(function (msg) {
            expect(msg).toBe("gridObjectType MUST be a function!");
        });
        spyOn($log, 'log').and.callFake(function (msg) {
            expect(msg).toBe(fakeObject);
        });
        spyOn(GridService, 'fillGridNeighbors').and.callFake(function (nGrid, noDiag) {
            expect(nGrid.length).toBe(3);
            expect(nGrid[0].length).toBe(3);
            expect(nGrid[1].length).toBe(3);
            expect(nGrid[2].length).toBe(3);
            expect(noDiag).toBeTruthy();

            return nGrid;
        });

        var results = GridService.deepCopyGrid(grid, fakeObject, true);

        expect(_.isFunction.calls.count()).toBe(1);
        expect($log.error.calls.count()).toBe(1);
        expect($log.log.calls.count()).toBe(1);
        expect(_.isBoolean.calls.count()).toBe(0);


        results = GridService.deepCopyGrid(grid, realObject, true);

        expect(_.isFunction.calls.count()).toBe(2);
        expect($log.error.calls.count()).toBe(1);
        expect($log.log.calls.count()).toBe(1);
        expect(_.isBoolean.calls.count()).toBe(1);

        expect(results.length).toBe(3);
        expect(results[0].length).toBe(3);
        expect(results[1].length).toBe(3);
        expect(results[2].length).toBe(3);
        expect(realObject.calls.count()).toBe(9);
    });
});