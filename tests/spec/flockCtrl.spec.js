describe('Flock Controller', function () {
    'use strict';

    var ctrl, scope, MathUtils, DrawUtils, Vector, FlockEntity;

    beforeEach(function () {
        module('aidemo.flock');

        inject(function ($controller, $rootScope, _MathUtils_, _DrawUtils_, _Vector_, _FlockEntity_, $injector) {
            scope = $rootScope.$new();
            MathUtils = $injector.get('MathUtils');
            DrawUtils = $injector.get('DrawUtils');
            Vector = _Vector_;
            FlockEntity = _FlockEntity_;

            ctrl = $controller('FlockController', {
                $scope: scope,
                MathUtils: MathUtils,
                DrawUtils: DrawUtils,
                Vector: Vector,
                FlockEntity: FlockEntity
            });
        });

        spyOn(scope, '$emit');
    });

    it("should have certain properties on the controller", function () {
        expect(ctrl.box).toBeDefined();
        expect(ctrl.BACK_COLOR).toBe("#555555");
        expect(ctrl.GRID_COLOR).toBe("#8EAEC9");
        expect(ctrl.entities.prey.length).toBe(0);
        expect(ctrl.entities.predators.length).toBe(0);

        expect(ctrl.preyAmount).toBe(200);
        expect(ctrl.predatorAmount).toBe(2);
        expect(ctrl.predatorStats.speed).toBe(0.7);
        expect(ctrl.predatorStats.cohesionWeight).toBe(.5);
        expect(ctrl.predatorStats.separateWeight).toBe(.5);
        expect(ctrl.predatorStats.alignWeight).toBe(.5);

        expect(ctrl.preyStats.speed).toBe(0.5);
        expect(ctrl.preyStats.cohesionWeight).toBe(.5);
        expect(ctrl.preyStats.separateWeight).toBe(.51);
        expect(ctrl.preyStats.alignWeight).toBe(.49);
        expect(ctrl.preyStats.avoidWeight).toBe(1.0);
        expect(ctrl.gameType).toBe('Wolves');
    });

    it("should update stats for a type of entity", function () {
        ctrl.entities.prey = [new FlockEntity()];

        spyOn(ctrl.entities.prey[0], 'updateStats').and.callFake(function (params) {
            expect(params.speed).toBe(ctrl.preyStats.speed);
            expect(params.cohesionWeight).toBe(ctrl.preyStats.cohesionWeight);
            expect(params.separateWeight).toBe(ctrl.preyStats.separateWeight);
            expect(params.alignWeight).toBe(ctrl.preyStats.alignWeight);
        });

        ctrl.updateStats(ctrl.preyStats, 'prey');

        expect(ctrl.entities.prey[0].updateStats).toHaveBeenCalled();
    });

    xit("should update stats for prey when the preyStats object changes", function () {
        spyOn(ctrl, 'updateStats').and.callFake(function (val, type) {
            expect(val).toBe(ctrl.preyStats);
            expect(type).toBe('prey');
        });

        scope.$apply();

        ctrl.preyStats.speed = 3.0;

        scope.$apply();

        expect(ctrl.updateStats).toHaveBeenCalled();
    });

    xit("should update stats for predators when the predatorStats object changes", function () {
        spyOn(ctrl, 'updateStats').and.callFake(function (val, type) {
            expect(val).toBe(ctrl.predatorStats);
            expect(type).toBe('predators');
        });

        scope.$apply();

        ctrl.predatorStats.speed = 3.0;

        scope.$apply();

        expect(ctrl.updateStats).toHaveBeenCalled();
    });

    it("should toggle the game type and call clear", function () {
        ctrl.gameType = 'Wolves';
        spyOn(ctrl, 'clear').and.callThrough();

        ctrl.toggleGameType();

        expect(ctrl.gameType).toBe('Zombies');
        expect(ctrl.clear).toHaveBeenCalled();

        ctrl.toggleGameType();

        expect(ctrl.gameType).toBe('Wolves');
        expect(ctrl.clear.calls.count()).toBe(2);
    });

    it("should reset the entities", function () {
        ctrl.entities = {
            prey: [{}],
            predators: [{}]
        };

        spyOn(ctrl, 'createPreyArray').and.callFake(function (amt) {
            expect(amt).toBe(ctrl.preyAmount);
            return [];
        });
        spyOn(ctrl, 'createPredatorsArray').and.callFake(function (amt) {
            expect(amt).toBe(ctrl.predatorAmount);
            return [];
        });

        ctrl.reset();

        expect(ctrl.createPreyArray).toHaveBeenCalled();
        expect(ctrl.createPredatorsArray).toHaveBeenCalled();

        expect(ctrl.entities.prey.length).toBe(0);
        expect(ctrl.entities.predators.length).toBe(0);
    });

    it("should create a FlockEntity", function () {
        var pv = {
            position: new Vector({x: 1, y: 2}),
            velocity: new Vector({x: 3, y: 4})
        };

        spyOn(DrawUtils, 'getRandomGreen').and.callThrough();

        var result = ctrl.createFlockEntity(ctrl.preyStats, pv, FlockEntity.PREY);

        expect(result.position).toBe(pv.position);
        expect(result.velocity).toBe(pv.velocity);
        expect(result.speed).toBe(ctrl.preyStats.speed);
        expect(result.cohesionWeight).toBe(ctrl.preyStats.cohesionWeight);
        expect(result.avoidWeight).toBe(ctrl.preyStats.avoidWeight);
        expect(result.separateWeight).toBe(ctrl.preyStats.separateWeight);
        expect(result.alignWeight).toBe(ctrl.preyStats.alignWeight);
        expect(result.type).toBe(FlockEntity.PREY);
        expect(result.color).toBeDefined();

        expect(DrawUtils.getRandomGreen).toHaveBeenCalled();
    });

    it("should create an array of prey FlockEntities", function () {
        var ent = new FlockEntity();

        ctrl.box = {
            width: 10,
            height: 10
        };

        spyOn(MathUtils, 'getRandomNumber').and.callFake(function (min, max) {
            return 0;
        });
        spyOn(ctrl, 'createFlockEntity').and.callFake(function (stats, pav, type) {
            expect(stats).toBe(ctrl.preyStats);
            expect(pav.position).toBeDefined();
            expect(pav.velocity).toBeDefined();
            expect(type).toBe(FlockEntity.PREY);

            return ent;
        });

        var results = ctrl.createPreyArray(1);

        expect(ctrl.createFlockEntity).toHaveBeenCalled();
        expect(MathUtils.getRandomNumber.calls.count()).toBe(4);

        expect(results.length).toBe(1);
        expect(results[0]).toBe(ent);
    });

    it("should create an array of predator FlockEntities", function () {
        var ent = new FlockEntity();

        ctrl.box = {
            width: 10,
            height: 10
        };

        spyOn(MathUtils, 'getRandomNumber').and.callFake(function (min, max) {
            return 0;
        });
        spyOn(ctrl, 'createFlockEntity').and.callFake(function (stats, pav, type) {
            expect(stats).toBe(ctrl.predatorStats);
            expect(pav.position).toBeDefined();
            expect(pav.velocity).toBeDefined();
            expect(type).toBe(FlockEntity.PREDATOR);

            return ent;
        });

        var results = ctrl.createPredatorsArray(1);

        expect(ctrl.createFlockEntity).toHaveBeenCalled();
        expect(MathUtils.getRandomNumber.calls.count()).toBe(4);

        expect(results.length).toBe(1);
        expect(results[0]).toBe(ent);
    });

    it("should update an entity", function () {
        var entity = new FlockEntity(),
            entities = [new FlockEntity(), new FlockEntity()];

        ctrl.entities.prey = entities;
        ctrl.entities.predators = entities;

        spyOn(entity, 'update').and.callFake(function (params) {
            expect(params.box).toBe(ctrl.box);
            expect(params.prey).toBe(entities);
            expect(params.predators).toBe(entities);
        });

        ctrl.updateEntity(entity);

        expect(entity.update).toHaveBeenCalled();
    });

    it("should update", function () {
        ctrl.entities = {
            predators: [{}],
            prey: [{}]
        };

        spyOn(ctrl, 'updateEntity').and.callFake(function (en) {
        });
        spyOn(ctrl, 'predatorsKillPrey').and.callFake(function () {
        });
        spyOn(scope, '$apply').and.callThrough();

        ctrl.update();

        expect(ctrl.updateEntity.calls.count()).toBe(2);
        expect(ctrl.predatorsKillPrey).toHaveBeenCalled();
        expect(scope.$apply).toHaveBeenCalled();
    });

    it("should kill prey as zombies", function () {
        var prey1 = new FlockEntity(),
            prey2 = new FlockEntity();
        ctrl.entities.prey = [prey1, prey2];
        ctrl.entities.predators = [];

        spyOn(ctrl, 'createFlockEntity').and.callFake(function (stats, obj, type) {
            expect(stats).toBe(ctrl.predatorStats);
            expect(obj).toBe(prey1);
            expect(type).toBe(FlockEntity.PREDATOR);
        });

        ctrl.killPreyZombies(ctrl.entities.prey[0]);

        expect(ctrl.entities.prey.length).toBe(1);
        expect(ctrl.entities.prey[0]).toBe(prey2);
        expect(ctrl.entities.predators.length).toBe(1);
        expect(ctrl.createFlockEntity).toHaveBeenCalled();
    });

    it("should kill prey as wolves", function () {
        var prey1 = new FlockEntity(),
            prey2 = new FlockEntity();
        ctrl.entities.prey = [prey1, prey2];

        ctrl.killPreyWolves(ctrl.entities.prey[0]);

        expect(ctrl.entities.prey.length).toBe(1);
        expect(ctrl.entities.prey[0]).toBe(prey2);
    });

    it("should have predators kill nearby prey", function () {
        ctrl.entities.prey = [
            new FlockEntity({})
        ];
        ctrl.entities.predators = [
            new FlockEntity({})
        ];
        ctrl.gameType = 'Wolves';

        spyOn(ctrl, 'killPreyWolves').and.callFake(function (deadPrey) {
            expect(deadPrey).toBe(ctrl.entities.prey[0]);
        });

        spyOn(ctrl, 'killPreyZombies').and.callFake(function (deadPrey) {
            expect(deadPrey).toBe(ctrl.entities.prey[0]);
        });

        spyOn(MathUtils, 'getNearestObjects').and.callFake(function (entities, entity, range) {
            expect(entities).toBe(ctrl.entities.prey);
            expect(range).toBe(7);

            return ctrl.entities.prey;
        });

        ctrl.predatorsKillPrey();

        expect(ctrl.killPreyWolves).toHaveBeenCalled();
        expect(ctrl.killPreyZombies).not.toHaveBeenCalled();


        ctrl.gameType = 'Zombies';

        ctrl.predatorsKillPrey();

        expect(ctrl.killPreyWolves.calls.count()).toBe(1);
        expect(ctrl.killPreyZombies).toHaveBeenCalled();
    });

    it("should clear entities", function () {
        ctrl.entities.prey = [{}];
        ctrl.entities.predators = [{}];

        ctrl.clear();

        expect(ctrl.entities.prey.length).toBe(0);
        expect(ctrl.entities.predators.length).toBe(0);
    });
});
