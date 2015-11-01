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
});
