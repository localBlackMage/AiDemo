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

        expect(scope.preyAmount).toBe(20);
        expect(scope.predatorAmount).toBe(5);
        expect(scope.predatorStats.speed).toBe(2.0);
        expect(scope.predatorStats.cohesionWeight).toBe(.5);
        expect(scope.predatorStats.separateWeight).toBe(.5);
        expect(scope.predatorStats.alignWeight).toBe(.5);

        expect(scope.preyStats.speed).toBe(2.2);
        expect(scope.preyStats.cohesionWeight).toBe(.5);
        expect(scope.preyStats.separateWeight).toBe(.5);
        expect(scope.preyStats.alignWeight).toBe(.5);
        expect(scope.preyStats.avoidWeight).toBe(1.0);
        expect(scope.gameType).toBe('Wolves');
    });

    it("should kill prey as zombies", function () {
        var prey1 = new FlockEntity(),
            prey2 = new FlockEntity();
        scope.entities.prey = [prey1, prey2];
        scope.entities.predators = [];

        spyOn(scope, 'createFlockEntity').and.callFake(function(stats, obj, type) {
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
