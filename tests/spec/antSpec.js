describe("Ant Model", function () {
    var Ant, Utils, MathUtils, DrawUtils, Vector, Pheromone,
        defaultOptions;

    beforeEach(function () {
        module('aidemo.service.utils', 'aidemo.service.mathUtils', 'aidemo.service.drawUtils', 'aidemo.models.vector', 'aidemo.models.ant');

        inject(function (_Ant_, _Utils_, _MathUtils_, _DrawUtils_, _Vector_, _Pheromone_) {
            Ant = _Ant_;
            Utils = _Utils_;
            MathUtils = _MathUtils_;
            DrawUtils = _DrawUtils_;
            Vector = _Vector_;
            Pheromone = _Pheromone_;

            defaultOptions = {
                position: new Vector({x: 10, y: 10}),
                velocity: new Vector({x: 1, y: 0}),
                speed: 1.0,
                cohesionWeight: 0.5,
                separateWeight: 0.5,
                alignWeight: 0.5,
                avoidWeight: 0.5,
                pheromoneWeight: 0.5,
                id: 123
            };
        });
    });

    it("should instantiate properly", function () {
        var ant = new Ant(defaultOptions);

        expect(ant.position).toEqual(defaultOptions.position);
        expect(ant.velocity).toEqual(defaultOptions.velocity);
        expect(ant.speed).toEqual(defaultOptions.speed);
        expect(ant.color).toEqual("#FF9D00");

        expect(ant.cohesionWeight).toEqual(defaultOptions.cohesionWeight);
        expect(ant.separateWeight).toEqual(defaultOptions.separateWeight);
        expect(ant.alignWeight).toEqual(defaultOptions.alignWeight);
        expect(ant.avoidWeight).toEqual(defaultOptions.avoidWeight);
        expect(ant.pheromoneWeight).toEqual(defaultOptions.pheromoneWeight);
    });

    it("should attempt to spawn a pheromone", function () {
        var ant = new Ant(defaultOptions);

        var result = ant.attemptToSpawnPheromone(0);

        expect(result).toBe(null);

        ant.currentTime = ant.timeToNextPheromone;

        result = ant.attemptToSpawnPheromone(0.1);

        expect(result instanceof Pheromone).toBeTruthy();
        expect(result.position.x).toBe(ant.position.x);
        expect(result.position.y).toBe(ant.position.y);
        expect(result.id).toBe(ant.id);
        expect(result.hasFood).toBe(ant.hasFood);
    });

    it("should retrieve a weight a pheromone when the ant has no food", function () {
        var ant = new Ant(defaultOptions),
            pheromone = new Pheromone({
                hasFood: false
            });

        ant.hasFood = false;

        var result = ant._getPheromoneWeight(pheromone);

        expect(result).toBe(0);


        pheromone.hasFood = true;

        result = ant._getPheromoneWeight(pheromone);

        expect(result).toBe(0.2);
    });

    it("should retrieve a weight a pheromone when it has food", function () {
        var ant = new Ant(defaultOptions),
            pheromone = new Pheromone({
                hasFood: false
            });

        ant.hasFood = true;

        var result = ant._getPheromoneWeight(pheromone);

        expect(result).toBe(0.2);


        pheromone.hasFood = true;

        result = ant._getPheromoneWeight(pheromone);

        expect(result).toBe(0);
    });

    it("should calculate the separation force for a given target", function () {
        var ant = new Ant(defaultOptions),
            pheromone = new Pheromone({
                position: ant.position.addNew(new Vector({x: 1}))
            });

        spyOn(ant, '_getPheromoneWeight').and.callFake(function (p) {
            expect(p).toBe(pheromone);
            return 1.0;
        });

        var result = ant._calculatePheromoneForceForTarget(pheromone);

        expect(result.x).toEqual(1);
        expect(result.y).toEqual(0);
    });

    it("should calculate force for pheromones", function () {
        var ant = new Ant(defaultOptions),
            pheromones = [new Pheromone()];

        spyOn(ant, '_calculatePheromoneForceForTarget').and.callFake(function (p) {
            expect(p).toBe(pheromones[0]);
            return new Vector({x: 1});
        });

        var result = ant.calculatePheromones(pheromones);

        expect(result.x).toEqual(1);
        expect(result.y).toEqual(0);

        result = ant.calculatePheromones([]);

        expect(result.x).toEqual(0);
        expect(result.y).toEqual(0);
    });

    it("should retrieve a weight for food", function () {
        var ant = new Ant(defaultOptions);

        ant.hasFood = false;

        var result = ant._getFoodWeight();

        expect(result).toBe(1.0);


        ant.hasFood = true;

        result = ant._getFoodWeight();

        expect(result).toBe(0);
    });

    it("should retrieve a weight for the nest", function () {
        var ant = new Ant(defaultOptions);

        ant.hasFood = false;

        var result = ant._getNestWeight();

        expect(result).toBe(0);


        ant.hasFood = true;

        result = ant._getNestWeight();

        expect(result).toBe(1.0);
    });

    it("should update velocity", function () {
        var ant = new Ant(defaultOptions),
            params = {
                ants: [],
                food: [],
                pheromones: [],
                nest: [],
                box: {}
            };

        spyOn(MathUtils, 'getNearestObjects').and.callFake(function (array, obj, range) {
            expect(array).toBeDefined();
            expect(obj).toBe(ant);
            expect(range).toBe(50.0);

            return [{}];
        });
        spyOn(ant, 'calculateCohesion').and.callFake(function () {
            return new Vector({x: 1});
        });
        spyOn(ant, 'calculatePheromones').and.callFake(function () {
            return new Vector({x: 1});
        });
        spyOn(ant, 'calculateSeparation').and.callFake(function () {
            return new Vector({x: 1});
        });
        spyOn(ant, 'calculateAlignment').and.callFake(function () {
            return new Vector({x: 1});
        });
        spyOn(ant, 'avoidWalls').and.callFake(function () {
            return new Vector({x: 1});
        });
        spyOn(ant, '_getFoodWeight').and.callFake(function () {
            return 1.0;
        });
        spyOn(ant, '_getNestWeight').and.callFake(function () {
            return 0;
        });

        var result = ant.updateVelocity(params);

        expect(MathUtils.getNearestObjects).toHaveBeenCalled();
        expect(ant.calculateCohesion.calls.count()).toBe(3);
        expect(ant.calculatePheromones).toHaveBeenCalled();
        expect(ant.calculateSeparation).toHaveBeenCalled();
        expect(ant.calculateAlignment).toHaveBeenCalled();
        expect(ant.avoidWalls).toHaveBeenCalled();
        expect(ant._getFoodWeight).toHaveBeenCalled();
        expect(ant._getNestWeight).toHaveBeenCalled();
        expect(result.x).toBe(1);
        expect(result.y).toBe(0);
    });

    it("should update", function () {
        var ant = new Ant(defaultOptions),
            updateParams = {
                box: {}
            };

        spyOn(ant, 'updateVelocity').and.callFake(function (params) {
            expect(params).toBe(updateParams);
            return new Vector({x: 1});
        });
        spyOn(ant, '_bounceOffWalls').and.callFake(function (box) {
            expect(box).toBe(updateParams.box);
        });
        spyOn(ant, '_keepInBounds').and.callFake(function (box) {
            expect(box).toBe(updateParams.box);
        });

        ant.update(updateParams);

        expect(ant.position.x).toBe(11);
        expect(ant.position.y).toBe(10);
        expect(ant.updateVelocity).toHaveBeenCalled();
        expect(ant._bounceOffWalls).toHaveBeenCalled();
        expect(ant._keepInBounds).toHaveBeenCalled();
    });
})
;