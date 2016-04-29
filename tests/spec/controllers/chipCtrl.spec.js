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
});
