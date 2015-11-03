describe('Life Controller', function () {
    'use strict';

    var scope, Utils, MathUtils, DrawUtils, GridService, LifeCell;

    beforeEach(function () {
        module('aidemo.life');

        inject(function ($controller, $rootScope, _Utils_, _MathUtils_, _DrawUtils_, _GridService_, _LifeCell_, $injector) {
            scope = $rootScope.$new();
            Utils = $injector.get('Utils');
            MathUtils = $injector.get('MathUtils');
            DrawUtils = $injector.get('DrawUtils');
            GridService = $injector.get('GridService');
            LifeCell = _LifeCell_;

            $controller('LifeController', {
                $scope: scope,
                Utils: Utils,
                MathUtils: MathUtils,
                DrawUtils: DrawUtils,
                GridService: GridService,
                LifeCell: LifeCell
            });
        });

        spyOn(scope, '$emit');
    });

    it("should have certain properties on the scope", function () {
        expect(scope.BACK_COLOR).toBe("#555555");
        expect(scope.GRID_COLOR).toBe("#8EAEC9");
        expect(scope.generation).toBe(0);
        expect(scope.step).toBe(1);
        expect(scope.pause).toBeTruthy();
        expect(scope.gridObj.grid).toBeDefined();
        expect(scope.gridObj.grid.length).toBe(0);
        expect(scope.gridObj.tileSize).toBe(10);
        expect(scope.cumulativeTime).toBe(0);
    });

    it("should generate grid columns", function () {
        var numCols = 2, row = 1;

        spyOn(MathUtils, 'getRandomNumber').and.callFake(function (min, max) {
            expect(min).toBe(0);
            expect(max).toBe(1);

            return 0.1;
        });

        var result = scope.generateGridColumns(numCols, row);

        expect(result.length).toBe(2);

        expect(result[0].box.x).toBe(0);
        expect(result[0].box.y).toBe(10);
        expect(result[0].box.width).toBe(10);
        expect(result[0].box.height).toBe(10);
        expect(result[0].status).toBe(LifeCell.ALIVE);
        expect(result[0].DEAD_COLOR).toBe(scope.BACK_COLOR);

        expect(result[1].box.x).toBe(10);
        expect(result[1].box.y).toBe(10);
        expect(result[1].box.width).toBe(10);
        expect(result[1].box.height).toBe(10);
        expect(result[1].status).toBe(LifeCell.ALIVE);
        expect(result[1].DEAD_COLOR).toBe(scope.BACK_COLOR);

        expect(MathUtils.getRandomNumber.calls.count()).toBe(2);
    });

    it("should generate a grid", function () {
        scope.box = {
            width: 20,
            height: 20
        };

        spyOn(scope, 'generateGridColumns').and.callFake(function (cols, row) {
            expect(cols).toBe(2);
            return [{}, {}];
        });

        spyOn(GridService, 'fillGridNeighbors').and.callFake(function (grid, noDiagonal) {
            expect(grid).toBe(scope.gridObj.grid);
            expect(noDiagonal).toBeFalsy();
        });

        scope.generateGrid();

        expect(scope.gridObj.grid.length).toBe(2);

        expect(scope.generateGridColumns.calls.count()).toBe(2);
    });

    it("should move the grid to the next generation", function () {
        scope.generation = 0;

        scope.gridObj.grid = [[
            new LifeCell({
                box: {
                    x: 0, y: 0, width: 10, height: 10
                },
                status: LifeCell.ALIVE, DEAD_COLOR: scope.BACK_COLOR
            })
        ]];

        spyOn(GridService, 'deepCopyGrid').and.callThrough();

        spyOn(scope.gridObj.grid[0][0], 'setStatus').and.callThrough();

        spyOn(scope, '$apply').and.callFake(function () {
        });

        scope.nextGeneration();

        expect(GridService.deepCopyGrid).toHaveBeenCalled();
        expect(scope.gridObj.grid[0][0].setStatus).toHaveBeenCalled();
        expect(scope.$apply).toHaveBeenCalled();
    });

    it("should update", function () {
        scope.pause = true;

        spyOn(scope, 'nextGeneration').and.callFake(function () {
        });

        scope.update();

        expect(scope.nextGeneration.calls.count()).toBe(0);

        scope.pause = false;
        scope.step = Number.MAX_VALUE;
        scope.lastTime = new Date().getTime();

        scope.update();

        expect(scope.nextGeneration.calls.count()).toBe(0);

        scope.step = 0;
        scope.lastTime = 0;

        scope.update();

        expect(scope.nextGeneration.calls.count()).toBe(1);
        expect(scope.cumulativeTime).toBe(0);
    });

    it("should reset", function () {
        scope.generation = 1;

        spyOn(scope, 'generateGrid').and.callFake(function () {
        });

        scope.reset();

        expect(scope.generateGrid.calls.count()).toBe(1);
        expect(scope.generation).toBe(0);
    });

    it("should toggle pause", function () {
        scope.pause = false;
        scope.gridObj.grid = [{}];

        spyOn(scope, 'generateGrid').and.callFake(function () {
        });

        scope.pauseToggle();

        expect(scope.generateGrid.calls.count()).toBe(0);
        expect(scope.pause).toBeTruthy();

        scope.gridObj.grid = [];

        scope.pauseToggle();

        expect(scope.generateGrid.calls.count()).toBe(1);
        expect(scope.pause).toBeFalsy();
    });

    it("should spawn a cell", function () {
        scope.gridObj.grid = [[
            new LifeCell({
                box: {
                    x: 0, y: 0, width: 10, height: 10
                },
                status: LifeCell.ALIVE, DEAD_COLOR: scope.BACK_COLOR
            })
        ]];

        spyOn(scope.gridObj.grid[0][0], 'setStatus').and.callFake(function(status){
            expect(status).toBe(LifeCell.ALIVE);
        });

        scope.spawnCell(0, 0);

        expect(scope.gridObj.grid[0][0].setStatus.calls.count()).toBe(1);
    });

    it("should handle a touch event", function () {
        var event = {
            offsetX: 1,
            offsetY: 1
        };

        scope.gridObj.grid = [];
        scope.pause = false;

        spyOn(scope, 'spawnCell').and.callFake(function(x, y) {
            expect(x).toBe(0);
            expect(y).toBe(0);
        });

        scope.touch(event);

        expect(scope.spawnCell).not.toHaveBeenCalled();


        //scope.gridObj.grid = [[]];
        //scope.pause = true;
        //
        //scope.touch(event);
        //expect(scope.spawnCell).not.toHaveBeenCalled();


        scope.gridObj.grid = [[]];
        scope.pause = false;

        scope.touch(event);
        expect(scope.spawnCell).toHaveBeenCalled();
    });
});
