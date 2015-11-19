describe('Flock Controller', function () {
    'use strict';

    var scope, MathUtils, DrawUtils, Vector, FlockEntity;

    beforeEach(function () {
        module('aidemo.flock');

        inject(function ($controller, $rootScope, _MathUtils_, _DrawUtils_, _Vector_, _FlockEntity_, $injector) {
            scope = $rootScope.$new();
            MathUtils = $injector.get('MathUtils');
            DrawUtils = $injector.get('DrawUtils');
            Vector = _Vector_;
            FlockEntity = _FlockEntity_;

            $controller('FlockController', {
                $scope: scope,
                MathUtils: MathUtils,
                DrawUtils: DrawUtils,
                Vector: Vector,
                FlockEntity: FlockEntity
            });
        });

        spyOn(scope, '$emit');
    });

    it("should have certain properties on the scope", function () {
        expect(scope.box).toBeDefined();
        expect(scope.BACK_COLOR).toBe("#555555");
        expect(scope.GRID_COLOR).toBe("#8EAEC9");
        expect(scope.entities.prey.length).toBe(0);
        expect(scope.entities.predators.length).toBe(0);

        expect(scope.preyAmount).toBe(200);
        expect(scope.predatorAmount).toBe(2);
        expect(scope.predatorStats.speed).toBe(0.7);
        expect(scope.predatorStats.cohesionWeight).toBe(.5);
        expect(scope.predatorStats.separateWeight).toBe(.5);
        expect(scope.predatorStats.alignWeight).toBe(.5);

        expect(scope.preyStats.speed).toBe(0.5);
        expect(scope.preyStats.cohesionWeight).toBe(.5);
        expect(scope.preyStats.separateWeight).toBe(.51);
        expect(scope.preyStats.alignWeight).toBe(.49);
        expect(scope.preyStats.avoidWeight).toBe(1.0);
        expect(scope.gameType).toBe('Wolves');
    });

    it("should update stats for a type of entity", function () {
        scope.entities.prey = [new FlockEntity()];

        spyOn(scope.entities.prey[0], 'updateStats').and.callFake(function (params) {
            expect(params.speed).toBe(scope.preyStats.speed);
            expect(params.cohesionWeight).toBe(scope.preyStats.cohesionWeight);
            expect(params.separateWeight).toBe(scope.preyStats.separateWeight);
            expect(params.alignWeight).toBe(scope.preyStats.alignWeight);
        });

        scope.updateStats(scope.preyStats, 'prey');

        expect(scope.entities.prey[0].updateStats).toHaveBeenCalled();
    });

    it("should update stats for prey when the preyStats object changes", function () {
        spyOn(scope, 'updateStats').and.callFake(function (val, type) {
            expect(val).toBe(scope.preyStats);
            expect(type).toBe('prey');
        });

        scope.$apply();

        scope.preyStats.speed = 3.0;

        scope.$apply();

        expect(scope.updateStats).toHaveBeenCalled();
    });

    it("should update stats for predators when the predatorStats object changes", function () {
        spyOn(scope, 'updateStats').and.callFake(function (val, type) {
            expect(val).toBe(scope.predatorStats);
            expect(type).toBe('predators');
        });

        scope.$apply();

        scope.predatorStats.speed = 3.0;

        scope.$apply();

        expect(scope.updateStats).toHaveBeenCalled();
    });

    it("should toggle the game type and call clear", function () {
        scope.gameType = 'Wolves';
        spyOn(scope, 'clear').and.callThrough();

        scope.toggleGameType();

        expect(scope.gameType).toBe('Zombies');
        expect(scope.clear).toHaveBeenCalled();

        scope.toggleGameType();

        expect(scope.gameType).toBe('Wolves');
        expect(scope.clear.calls.count()).toBe(2);
    });

    it("should reset the entities", function () {
        scope.entities = {
            prey: [{}],
            predators: [{}]
        };

        spyOn(scope, 'createPreyArray').and.callFake(function (amt) {
            expect(amt).toBe(scope.preyAmount);
            return [];
        });
        spyOn(scope, 'createPredatorsArray').and.callFake(function (amt) {
            expect(amt).toBe(scope.predatorAmount);
            return [];
        });

        scope.reset();

        expect(scope.createPreyArray).toHaveBeenCalled();
        expect(scope.createPredatorsArray).toHaveBeenCalled();

        expect(scope.entities.prey.length).toBe(0);
        expect(scope.entities.predators.length).toBe(0);
    });

    it("should create a FlockEntity", function () {
        var pv = {
            position: new Vector({x: 1, y: 2}),
            velocity: new Vector({x: 3, y: 4})
        };

        spyOn(DrawUtils, 'getRandomGreen').and.callThrough();

        var result = scope.createFlockEntity(scope.preyStats, pv, FlockEntity.PREY);

        expect(result.position).toBe(pv.position);
        expect(result.velocity).toBe(pv.velocity);
        expect(result.speed).toBe(scope.preyStats.speed);
        expect(result.cohesionWeight).toBe(scope.preyStats.cohesionWeight);
        expect(result.avoidWeight).toBe(scope.preyStats.avoidWeight);
        expect(result.separateWeight).toBe(scope.preyStats.separateWeight);
        expect(result.alignWeight).toBe(scope.preyStats.alignWeight);
        expect(result.type).toBe(FlockEntity.PREY);
        expect(result.color).toBeDefined();

        expect(DrawUtils.getRandomGreen).toHaveBeenCalled();
    });

    it("should create an array of prey FlockEntities", function () {
        var ent = new FlockEntity();

        scope.box = {
            width: 10,
            height: 10
        };

        spyOn(MathUtils, 'getRandomNumber').and.callFake(function (min, max) {
            return 0;
        });
        spyOn(scope, 'createFlockEntity').and.callFake(function (stats, pav, type) {
            expect(stats).toBe(scope.preyStats);
            expect(pav.position).toBeDefined();
            expect(pav.velocity).toBeDefined();
            expect(type).toBe(FlockEntity.PREY);

            return ent;
        });

        var results = scope.createPreyArray(1);

        expect(scope.createFlockEntity).toHaveBeenCalled();
        expect(MathUtils.getRandomNumber.calls.count()).toBe(4);

        expect(results.length).toBe(1);
        expect(results[0]).toBe(ent);
    });

    it("should create an array of predator FlockEntities", function () {
        var ent = new FlockEntity();

        scope.box = {
            width: 10,
            height: 10
        };

        spyOn(MathUtils, 'getRandomNumber').and.callFake(function (min, max) {
            return 0;
        });
        spyOn(scope, 'createFlockEntity').and.callFake(function (stats, pav, type) {
            expect(stats).toBe(scope.predatorStats);
            expect(pav.position).toBeDefined();
            expect(pav.velocity).toBeDefined();
            expect(type).toBe(FlockEntity.PREDATOR);

            return ent;
        });

        var results = scope.createPredatorsArray(1);

        expect(scope.createFlockEntity).toHaveBeenCalled();
        expect(MathUtils.getRandomNumber.calls.count()).toBe(4);

        expect(results.length).toBe(1);
        expect(results[0]).toBe(ent);
    });

    it("should update an entity", function () {
        var entity = new FlockEntity(),
            entities = [new FlockEntity(), new FlockEntity()];

        scope.entities.prey = entities;
        scope.entities.predators = entities;

        spyOn(entity, 'update').and.callFake(function (params) {
            expect(params.box).toBe(scope.box);
            expect(params.prey).toBe(entities);
            expect(params.predators).toBe(entities);
        });

        scope.updateEntity(entity);

        expect(entity.update).toHaveBeenCalled();
    });

    it("should update", function () {
        scope.entities = {
            predators: [{}],
            prey: [{}]
        };

        spyOn(scope, 'updateEntity').and.callFake(function (en) {
        });
        spyOn(scope, 'predatorsKillPrey').and.callFake(function () {
        });
        spyOn(scope, '$apply').and.callThrough();

        scope.update();

        expect(scope.updateEntity.calls.count()).toBe(2);
        expect(scope.predatorsKillPrey).toHaveBeenCalled();
        expect(scope.$apply).toHaveBeenCalled();
    });

    it("should kill prey as zombies", function () {
        var prey1 = new FlockEntity(),
            prey2 = new FlockEntity();
        scope.entities.prey = [prey1, prey2];
        scope.entities.predators = [];

        spyOn(scope, 'createFlockEntity').and.callFake(function (stats, obj, type) {
            expect(stats).toBe(scope.predatorStats);
            expect(obj).toBe(prey1);
            expect(type).toBe(FlockEntity.PREDATOR);
        });

        scope.killPreyZombies(scope.entities.prey[0]);

        expect(scope.entities.prey.length).toBe(1);
        expect(scope.entities.prey[0]).toBe(prey2);
        expect(scope.entities.predators.length).toBe(1);
        expect(scope.createFlockEntity).toHaveBeenCalled();
    });

    it("should kill prey as wolves", function () {
        var prey1 = new FlockEntity(),
            prey2 = new FlockEntity();
        scope.entities.prey = [prey1, prey2];

        scope.killPreyWolves(scope.entities.prey[0]);

        expect(scope.entities.prey.length).toBe(1);
        expect(scope.entities.prey[0]).toBe(prey2);
    });

    it("should have predators kill nearby prey", function () {
        scope.entities.prey = [
            new FlockEntity({})
        ];
        scope.entities.predators = [
            new FlockEntity({})
        ];
        scope.gameType = 'Wolves';

        spyOn(scope, 'killPreyWolves').and.callFake(function (deadPrey) {
            expect(deadPrey).toBe(scope.entities.prey[0]);
        });

        spyOn(scope, 'killPreyZombies').and.callFake(function (deadPrey) {
            expect(deadPrey).toBe(scope.entities.prey[0]);
        });

        spyOn(MathUtils, 'getNearestObjects').and.callFake(function (entities, entity, range) {
            expect(entities).toBe(scope.entities.prey);
            expect(range).toBe(7);

            return scope.entities.prey;
        });

        scope.predatorsKillPrey();

        expect(scope.killPreyWolves).toHaveBeenCalled();
        expect(scope.killPreyZombies).not.toHaveBeenCalled();


        scope.gameType = 'Zombies';

        scope.predatorsKillPrey();

        expect(scope.killPreyWolves.calls.count()).toBe(1);
        expect(scope.killPreyZombies).toHaveBeenCalled();
    });

    it("should clear entities", function () {
        scope.entities.prey = [{}];
        scope.entities.predators = [{}];

        scope.clear();

        expect(scope.entities.prey.length).toBe(0);
        expect(scope.entities.predators.length).toBe(0);
    });
});
