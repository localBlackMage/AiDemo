describe('Life Controller', function () {
    'use strict';

    var ctrl, scope, ScreenSize, Utils, MathUtils, DrawUtils, GridService, LifeCell;

    beforeEach(function () {
        module('aidemo.life');

        inject(function ($controller, $rootScope, _ScreenSize_, _Utils_, _MathUtils_, _DrawUtils_, _GridService_, _LifeCell_, $injector) {
            scope = $rootScope.$new();
            ScreenSize = $injector.get('ScreenSize');
            Utils = $injector.get('Utils');
            MathUtils = $injector.get('MathUtils');
            DrawUtils = $injector.get('DrawUtils');
            GridService = $injector.get('GridService');
            LifeCell = _LifeCell_;

            ctrl = $controller('LifeController', {
                $scope: scope,
                Utils: Utils,
                MathUtils: MathUtils,
                DrawUtils: DrawUtils,
                GridService: GridService,
                ScreenSize: ScreenSize,
                LifeCell: LifeCell
            });
        });

        spyOn(scope, '$emit');
    });

    it("should have certain properties on the ctrl", function () {
        expect(ctrl.BACK_COLOR).toBe("#555555");
        expect(ctrl.GRID_COLOR).toBe("#8EAEC9");
        expect(ctrl.generation).toBe(0);
        expect(ctrl.step).toBe(1);
        expect(ctrl.pause).toBeTruthy();
        expect(ctrl.gridObj.grid).toBeDefined();
        expect(ctrl.gridObj.grid.length).toBe(0);
        expect(ctrl.gridObj.tileSize).toBe(10);
        expect(ctrl.cumulativeTime).toBe(0);
    });

    it("should generate grid columns", function () {
        var numCols = 2, row = 1;

        spyOn(MathUtils, 'getRandomNumber').and.callFake(function (min, max) {
            expect(min).toBe(0);
            expect(max).toBe(1);

            return 0.1;
        });

        var result = ctrl.generateGridColumns(numCols, row);

        expect(result.length).toBe(2);

        expect(result[0].box.x).toBe(0);
        expect(result[0].box.y).toBe(10);
        expect(result[0].box.width).toBe(10);
        expect(result[0].box.height).toBe(10);
        expect(result[0].status).toBe(LifeCell.ALIVE);
        expect(result[0].DEAD_COLOR).toBe(ctrl.BACK_COLOR);

        expect(result[1].box.x).toBe(10);
        expect(result[1].box.y).toBe(10);
        expect(result[1].box.width).toBe(10);
        expect(result[1].box.height).toBe(10);
        expect(result[1].status).toBe(LifeCell.ALIVE);
        expect(result[1].DEAD_COLOR).toBe(ctrl.BACK_COLOR);

        expect(MathUtils.getRandomNumber.calls.count()).toBe(2);
    });

    it("should generate a grid", function () {
        ctrl.box = {
            width: 20,
            height: 20
        };

        spyOn(ctrl, 'generateGridColumns').and.callFake(function (cols, row) {
            expect(cols).toBe(2);
            return [{}, {}];
        });

        spyOn(GridService, 'fillGridNeighbors').and.callFake(function (grid, noDiagonal) {
            expect(grid).toBe(ctrl.gridObj.grid);
            expect(noDiagonal).toBeFalsy();
        });

        ctrl.generateGrid();

        expect(ctrl.gridObj.grid.length).toBe(2);

        expect(ctrl.generateGridColumns.calls.count()).toBe(2);
    });

    it("should move the grid to the next generation", function () {
        ctrl.generation = 0;

        ctrl.gridObj.grid = [[
            new LifeCell({
                box: {
                    x: 0, y: 0, width: 10, height: 10
                },
                status: LifeCell.ALIVE, DEAD_COLOR: ctrl.BACK_COLOR
            })
        ]];

        spyOn(GridService, 'deepCopyGrid').and.callThrough();

        spyOn(ctrl.gridObj.grid[0][0], 'setStatus').and.callThrough();

        spyOn(scope, '$apply').and.callFake(function () {
        });

        ctrl.nextGeneration();

        expect(GridService.deepCopyGrid).toHaveBeenCalled();
        expect(ctrl.gridObj.grid[0][0].setStatus).toHaveBeenCalled();
        expect(scope.$apply).toHaveBeenCalled();
    });

    it("should update", function () {
        ctrl.pause = true;

        spyOn(ctrl, 'nextGeneration').and.callFake(function () {
        });

        ctrl.update();

        expect(ctrl.nextGeneration.calls.count()).toBe(0);

        ctrl.pause = false;
        ctrl.step = Number.MAX_VALUE;
        ctrl.lastTime = new Date().getTime();

        ctrl.update();

        expect(ctrl.nextGeneration.calls.count()).toBe(0);

        ctrl.step = 0;
        ctrl.lastTime = 0;

        ctrl.update();

        expect(ctrl.nextGeneration.calls.count()).toBe(1);
        expect(ctrl.cumulativeTime).toBe(0);
    });

    it("should reset", function () {
        ctrl.generation = 1;

        spyOn(ctrl, 'generateGrid').and.callFake(function () {
        });

        ctrl.reset();

        expect(ctrl.generateGrid.calls.count()).toBe(1);
        expect(ctrl.generation).toBe(0);
    });

    it("should toggle pause", function () {
        ctrl.pause = false;
        ctrl.gridObj.grid = [{}];

        spyOn(ctrl, 'generateGrid').and.callFake(function () {
        });

        ctrl.pauseToggle();

        expect(ctrl.generateGrid.calls.count()).toBe(0);
        expect(ctrl.pause).toBeTruthy();

        ctrl.gridObj.grid = [];

        ctrl.pauseToggle();

        expect(ctrl.generateGrid.calls.count()).toBe(1);
        expect(ctrl.pause).toBeFalsy();
    });

    it("should spawn a cell", function () {
        ctrl.gridObj.grid = [[
            new LifeCell({
                box: {
                    x: 0, y: 0, width: 10, height: 10
                },
                status: LifeCell.ALIVE, DEAD_COLOR: ctrl.BACK_COLOR
            })
        ]];

        spyOn(ctrl.gridObj.grid[0][0], 'setStatus').and.callFake(function(status){
            expect(status).toBe(LifeCell.ALIVE);
        });

        ctrl.spawnCell(0, 0);

        expect(ctrl.gridObj.grid[0][0].setStatus.calls.count()).toBe(1);
    });

    it("should handle a touch event", function () {
        var event = {
            offsetX: 1,
            offsetY: 1
        };

        ctrl.gridObj.grid = [];
        ctrl.pause = false;

        spyOn(ctrl, 'spawnCell').and.callFake(function(x, y) {
            expect(x).toBe(0);
            expect(y).toBe(0);
        });

        ctrl.touch(event);

        expect(ctrl.spawnCell).not.toHaveBeenCalled();

        ctrl.gridObj.grid = [[]];
        ctrl.pause = false;

        ctrl.touch(event);
        expect(ctrl.spawnCell).toHaveBeenCalled();
    });
});
