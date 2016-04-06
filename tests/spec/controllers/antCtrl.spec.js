describe('Ant Controller', function () {
    'use strict';

    var scope, ctrl, MathUtils, DrawUtils, Vector, Nest, Ant, Food;

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

            ctrl = $controller('AntController', {
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

    it("should have certain properties on the ctrl", function () {
        expect(ctrl.BACK_COLOR).toBe("#555555");
        expect(ctrl.GRID_COLOR).toBe("#8EAEC9");
        expect(ctrl.lastTime).toBe(0);

        expect(ctrl.environment.ants.length).toBe(0);
        expect(ctrl.environment.food.length).toBe(0);
        expect(ctrl.environment.pheromones.length).toBe(0);
        expect(ctrl.environment.nest).toBe(null);
    });

    it("should spawn food", function() {
        var call = 1;
        ctrl.box = {
            width: 100,
            height: 200
        };

        spyOn(MathUtils, 'getRandomNumber').and.callFake(function(min, max){
            expect(min).toBe(10);
            if(call===1){
                expect(max).toBe(ctrl.box.width - 10);
            }
            else if(call===2){
                expect(max).toBe(ctrl.box.height - 10);
            }
            call++;

            return 10;
        });

        var result = ctrl.spawnFood();

        expect(result instanceof Food).toBeTruthy();
        expect(result.position.x).toEqual(10);
        expect(result.position.y).toEqual(10);
        expect(MathUtils.getRandomNumber.calls.count()).toBe(2);
    });

    it("should spawn a nest", function() {
        var call = 1;
        ctrl.box = {
            width: 100,
            height: 200
        };

        spyOn(MathUtils, 'getRandomNumber').and.callFake(function(min, max){
            expect(min).toBe(10);
            if(call===1){
                expect(max).toBe(ctrl.box.width - 10);
            }
            else if(call===2){
                expect(max).toBe(ctrl.box.height - 10);
            }
            call++;

            return 10;
        });

        var result = ctrl.spawnNest();

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
        spyOn(ctrl, 'spawnFood').and.callFake(function(){
            return {};
        });
        spyOn(ctrl, 'spawnNest').and.callFake(function(){
            return nest;
        });

        ctrl.createEnvironment();

        expect(ctrl.environment.nest).toBe(nest);
        expect(ctrl.spawnFood.calls.count()).toBe(randAmt);
        expect(ctrl.environment.food.length).toBe(randAmt);

        expect(ctrl.spawnNest.calls.count()).toBe(1);
        expect(ctrl.active).toBeTruthy();
    });

    it("should clear the environment", function() {
        ctrl.environment = {
            ants: [{}],
            food: [{}],
            pheromones: [{}],
            nest: {}
        };

        ctrl.clear();

        expect(ctrl.environment.ants.length).toBe(0);
        expect(ctrl.environment.food.length).toBe(0);
        expect(ctrl.environment.pheromones.length).toBe(0);
        expect(ctrl.environment.nest).toBe(null);
        expect(ctrl.active).toBeFalsy();
    });

    it("should reset and restart", function() {
        spyOn(ctrl, 'clear').and.callThrough();
        spyOn(ctrl, 'createEnvironment').and.callThrough();

        ctrl.reset();

        expect(ctrl.clear).toHaveBeenCalled();
        expect(ctrl.createEnvironment).toHaveBeenCalled();
    });

    it("should call the environment's nest to spawn an ant and handle a null result", function() {
        ctrl.environment.nest = new Nest();
        spyOn(ctrl.environment.nest, 'updateTimeAndAttemptToSpawnAnt').and.callFake(function() {
            return null;
        });

        ctrl.spawnAnt(1);

        expect(ctrl.environment.nest.updateTimeAndAttemptToSpawnAnt).toHaveBeenCalled();
        expect(ctrl.environment.ants.length).toBe(0);
    });

    it("should call the environment's nest to spawn an ant and add it to the Ants array", function() {
        ctrl.environment.nest = new Nest();
        spyOn(ctrl.environment.nest, 'updateTimeAndAttemptToSpawnAnt').and.callFake(function() {
            return new Ant();
        });

        ctrl.spawnAnt(1);

        expect(ctrl.environment.nest.updateTimeAndAttemptToSpawnAnt).toHaveBeenCalled();
        expect(ctrl.environment.ants.length).toBe(1);
    });

    it("should update all ants", function() {
        var ants = [new Ant()],
            delta = 0.1;

        ctrl.environment.ants = ants;
        ctrl.environment.food = [{}];
        ctrl.environment.pheromones = [{}];
        ctrl.environment.nest = new Nest();

        spyOn(ants[0], 'update').and.callFake(function (params) {
            expect(params.box).toBe(ctrl.box);
            expect(params.ants).toBe(ctrl.environment.ants);
            expect(params.food).toBe(ctrl.environment.food);
            expect(params.pheromones).toBe(ctrl.environment.pheromones);
            expect(params.nest).toBe(ctrl.environment.nest);
        });
        spyOn(ants[0], 'attemptToSpawnPheromone').and.callFake(function (d) {
            expect(d).toBe(delta);
        });
        spyOn(ctrl, 'antTouchedEnvironment').and.callFake(function(ant) {
            expect(ant).toBe(ants[0]);
        });

        ctrl.updateAnts(delta);

        expect(ants[0].update).toHaveBeenCalled();
        expect(ants[0].attemptToSpawnPheromone).toHaveBeenCalled();
        expect(ctrl.antTouchedEnvironment).toHaveBeenCalled();
    });
    
    it("should update", function () {
        spyOn(ctrl, 'spawnAnt').and.callFake(function(){});
        spyOn(ctrl, 'updateAnts').and.callFake(function(){});

        ctrl.active = false;

        ctrl.update();

        expect(ctrl.spawnAnt.calls.count()).toBe(0);
        expect(ctrl.updateAnts.calls.count()).toBe(0);

        ctrl.active = true;
        ctrl.lastTime = new Date().getTime();

        ctrl.update();

        expect(ctrl.spawnAnt.calls.count()).toBe(1);
        expect(ctrl.updateAnts.calls.count()).toBe(1);

        ctrl.active = true;
        ctrl.lastTime = 0;

        ctrl.update();

        expect(ctrl.spawnAnt.calls.count()).toBe(2);
        expect(ctrl.updateAnts.calls.count()).toBe(2);
    });
});
