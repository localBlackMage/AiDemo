describe('Ant Controller', function () {
    'use strict';

    var scope, MathUtils, DrawUtils, Vector, Nest, Ant, Food;

    beforeEach(function () {
        module('aidemo.ant');

        inject(function ($controller, $rootScope, _MathUtils_, _DrawUtils_, _Vector_, _Nest_, _Ant_, _Food_, $injector) {
            scope = $rootScope.$new();
            MathUtils = $injector.get('MathUtils');
            DrawUtils = $injector.get('DrawUtils');
            Vector = _Vector_;
            Nest = _Nest_;
            Ant = _Ant_;
            Food = _Food_;

            $controller('AntController', {
                $scope: scope,
                MathUtils: MathUtils,
                DrawUtils: DrawUtils,
                Vector: Vector,
                Nest: Nest,
                Ant: Ant,
                Food: Food
            });
        });

        spyOn(scope, '$emit');
    });

    it("should have certain properties on the scope", function () {
        expect(scope.BACK_COLOR).toBe("#555555");
        expect(scope.GRID_COLOR).toBe("#8EAEC9");
        expect(scope.step).toBe(1.0);
        expect(scope.lastTime).toBe(0);
        expect(scope.cumulativeTime).toBe(0);

        expect(scope.environment.ants.length).toBe(0);
        expect(scope.environment.food.length).toBe(0);
        expect(scope.environment.pheromones.length).toBe(0);
        expect(scope.environment.nest).toBe(null);
    });

    it("should spawn food", function() {
        var call = 1;
        scope.box = {
            width: 100,
            height: 200
        };

        spyOn(MathUtils, 'getRandomNumber').and.callFake(function(min, max){
            expect(min).toBe(10);
            if(call===1){
                expect(max).toBe(scope.box.width - 10);
            }
            else if(call===2){
                expect(max).toBe(scope.box.height - 10);
            }
            call++;

            return 10;
        });

        var result = scope.spawnFood();

        expect(result instanceof Food).toBeTruthy();
        expect(result.position.x).toEqual(10);
        expect(result.position.y).toEqual(10);
        expect(MathUtils.getRandomNumber.calls.count()).toBe(2);
    });

    it("should spawn a nest", function() {
        var call = 1;
        scope.box = {
            width: 100,
            height: 200
        };

        spyOn(MathUtils, 'getRandomNumber').and.callFake(function(min, max){
            expect(min).toBe(10);
            if(call===1){
                expect(max).toBe(scope.box.width - 10);
            }
            else if(call===2){
                expect(max).toBe(scope.box.height - 10);
            }
            call++;

            return 10;
        });

        var result = scope.spawnNest();

        expect(result instanceof Nest).toBeTruthy();
        expect(result.position.x).toEqual(10);
        expect(result.position.y).toEqual(10);
        expect(MathUtils.getRandomNumber.calls.count()).toBe(2);
    });

    it("should instantiate an environment", function () {
        var randAmt = 8, nest = new Nest();

        spyOn(MathUtils, 'getRandomNumber').and.callFake(function (min, max) {
            expect(min).toBe(5);
            expect(max).toBe(10);

            return randAmt;
        });
        spyOn(scope, 'spawnFood').and.callFake(function(){
            return {};
        });
        spyOn(scope, 'spawnNest').and.callFake(function(){
            return nest;
        });

        scope.instantiate();

        expect(scope.environment.nest).toBe(nest);
        expect(scope.spawnFood.calls.count()).toBe(randAmt);
        expect(scope.environment.food.length).toBe(randAmt);

        expect(scope.spawnNest.calls.count()).toBe(1);
        expect(scope.active).toBeTruthy();
    });

    it("should clear the environment", function() {
        scope.environment = {
            ants: [{}],
            food: [{}],
            pheromones: [{}],
            nest: {}
        };

        scope.clear();

        expect(scope.environment.ants.length).toBe(0);
        expect(scope.environment.food.length).toBe(0);
        expect(scope.environment.pheromones.length).toBe(0);
        expect(scope.environment.nest).toBe(null);
        expect(scope.active).toBeFalsy();
    });

    it("should reset and restart", function() {
        spyOn(scope, 'clear').and.callThrough();
        spyOn(scope, 'instantiate').and.callThrough();

        scope.reset();

        expect(scope.clear).toHaveBeenCalled();
        expect(scope.instantiate).toHaveBeenCalled();
    });

    it("should call the environment's nest to spawn an ant and handle a null result", function() {
        scope.environment.nest = new Nest();
        spyOn(scope.environment.nest, 'attemptToSpawnAnt').and.callFake(function() {
            return null;
        });

        scope.spawnAnt();

        expect(scope.environment.nest.attemptToSpawnAnt).toHaveBeenCalled();
        expect(scope.environment.ants.length).toBe(0);
    });

    it("should call the environment's nest to spawn an ant and add it to the Ants array", function() {
        scope.environment.nest = new Nest();
        spyOn(scope.environment.nest, 'attemptToSpawnAnt').and.callFake(function() {
            return new Ant();
        });

        scope.spawnAnt();

        expect(scope.environment.nest.attemptToSpawnAnt).toHaveBeenCalled();
        expect(scope.environment.ants.length).toBe(1);
    });

    it("should update all ants", function() {
        var ants = [new Ant()];

        scope.environment.ants = ants;
        scope.environment.food = [{}];
        scope.environment.pheromones = [{}];
        scope.environment.nest = new Nest();

        spyOn(ants[0], 'update').and.callFake(function (params) {
            expect(params.box).toBe(scope.box);
            expect(params.ants).toBe(scope.environment.ants);
            expect(params.food).toBe(scope.environment.food);
            expect(params.pheromones).toBe(scope.environment.pheromones);
            expect(params.nest).toBe(scope.environment.nest);
        });

        scope.updateAnts();

        expect(ants[0].update).toHaveBeenCalled();
    });
    
    it("should update", function () {
        spyOn(scope, 'spawnAnt').and.callFake(function(){});
        spyOn(scope, 'updateAnts').and.callFake(function(){});

        scope.active = false;

        scope.update();

        expect(scope.spawnAnt.calls.count()).toBe(0);
        expect(scope.updateAnts.calls.count()).toBe(0);

        scope.active = true;
        scope.step = Number.MAX_VALUE;
        scope.lastTime = new Date().getTime();

        scope.update();

        expect(scope.spawnAnt.calls.count()).toBe(0);
        expect(scope.updateAnts.calls.count()).toBe(1);

        scope.active = true;
        scope.step = 0;
        scope.lastTime = 0;

        scope.update();

        expect(scope.spawnAnt.calls.count()).toBe(1);
        expect(scope.cumulativeTime).toBe(0);
        expect(scope.updateAnts.calls.count()).toBe(2);
    });
});
