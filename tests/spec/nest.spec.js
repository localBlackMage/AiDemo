describe("Nest Model", function () {
    var Nest, MathUtils, DrawUtils, Vector, Ant,
        defaultOptions;

    beforeEach(function () {
        module('aidemo.service.mathUtils',
            'aidemo.service.drawUtils',
            'aidemo.models.vector',
            'aidemo.models.ants.ant',
            'aidemo.models.ants.nest');

        inject(function (_Nest_, _MathUtils_, _DrawUtils_, _Vector_, _Ant_) {
            Nest = _Nest_;
            MathUtils = _MathUtils_;
            DrawUtils = _DrawUtils_;
            Vector = _Vector_;
            Ant = _Ant_;

            defaultOptions = {
                position: new Vector({x: 10, y: 20}),
                foodStore: 5,
                weights: {
                    cohesionWeight: 0.5,
                    separateWeight: 0.5,
                    alignWeight: 0.5,
                    avoidWeight: 0.5,
                    pheromoneWeight: 0.5
                }
            };
        });
    });

    it("should instantiate properly", function(){
        var blue = '#0000AA', red = "#AA0000";

        spyOn(DrawUtils, 'getRandomRed').and.callFake(function(min) {
            expect(min).toBe('A');
            return red;
        });
        spyOn(DrawUtils, 'getRandomBlue').and.callFake(function(min) {
            expect(min).toBe('A');
            return blue;
        });

        var nest = new Nest(defaultOptions);

        expect(DrawUtils.getRandomRed).toHaveBeenCalled();
        expect(DrawUtils.getRandomBlue).toHaveBeenCalled();

        expect(nest.position).toBe(defaultOptions.position);
        expect(nest.radius).toBe(10.0);
        expect(nest.colorInner).toBe(blue);
        expect(nest.colorOuter).toBe(red);

        expect(nest.foodStore).toBe(5);

        expect(nest.weights).toEqual(defaultOptions.weights);

        expect(nest.id).toBe(0);
        expect(nest.currentTime).toBe(0);
        expect(nest.timeToNextAnt).toBe(2.0);
    });

    it("should update the current time and evaluate if it is greater than timeToNextAnt", function() {
        var nest = new Nest(defaultOptions);

        nest.currentTime = 1.0;

        var result = nest._updateTime(0.1);

        expect(result).toBeFalsy();
        expect(nest.currentTime).toBe(1.1);


        nest.currentTime = nest.timeToNextAnt;

        result = nest._updateTime(0.1);

        expect(result).toBeTruthy();
        expect(nest.currentTime).toBe(0);
    });

    it("should create an Ant and return it", function() {
        var nest = new Nest(defaultOptions);

        spyOn(MathUtils, 'getRandomNumber').and.callFake(function(min, max) {
            expect(min).toBe(-1);
            expect(max).toBe(1);
            return 1;
        });

        nest.id = 122;

        var result = nest._spawnAnt();

        expect(result instanceof Ant).toBeTruthy();
        expect(result.position.x).toBe(nest.position.x);
        expect(result.position.y).toBe(nest.position.y);
        expect(result.velocity.x).toBe(1);
        expect(result.velocity.y).toBe(1);
        expect(result.speed).toBe(0.5);
        expect(result.cohesionWeight).toBe(nest.weights.cohesionWeight);
        expect(result.avoidWeight).toBe(nest.weights.avoidWeight);
        expect(result.separateWeight).toBe(nest.weights.separateWeight);
        expect(result.alignWeight).toBe(nest.weights.alignWeight);
        expect(result.pheromoneWeight).toBe(nest.weights.pheromoneWeight);
        expect(result.id).toBe(123);
        expect(nest.id).toBe(123);
    });

    it("should NOT spawn an ant if there is not enough food OR if NOT enough time has passed", function() {
        var nest = new Nest(defaultOptions),
            call = 0;

        spyOn(nest, '_spawnAnt').and.callThrough();
        spyOn(nest, '_updateTime').and.callFake(function(delta){
            return call === 0;
        });

        nest.foodStore = 0;

        var result = nest.updateTimeAndAttemptToSpawnAnt();

        expect(result).toBe(null);
        expect(nest._spawnAnt.calls.count()).toBe(0);

        call = 1;
        nest.foodStore = 1;

        result = nest.updateTimeAndAttemptToSpawnAnt();

        expect(result).toBe(null);
        expect(nest._spawnAnt.calls.count()).toBe(0);
    });

    it("should spawn an ant if there is enough food AND enough time has passed", function() {
        var nest = new Nest(defaultOptions);

        spyOn(nest, '_updateTime').and.callFake(function(delta){
            return true;
        });
        spyOn(nest, '_spawnAnt').and.callFake(function(){
            return new Ant();
        });

        nest.foodStore = 1;

        var result = nest.updateTimeAndAttemptToSpawnAnt();

        expect(nest._spawnAnt.calls.count()).toBe(1);
        expect(result instanceof Ant).toBeTruthy();
        expect(nest.foodStore).toBe(0);
    });

    it("should increment it's food storage", function() {
        var nest = new Nest(defaultOptions);

        nest.foodStore = 1;

        nest.addFood();

        expect(nest.foodStore).toBe(1.1);
    });

    it("should render itself", function () {
        var nest = new Nest(defaultOptions),
            context = document.createElement("canvas").getContext('2d');

        spyOn(DrawUtils, 'drawCircle').and.callFake(function (ctx, x, y, radius, color) {
            expect(ctx).toBe(context);
            expect(x).toBe(nest.position.x);
            expect(y).toBe(nest.position.y);
            expect(radius).toBe(nest.radius);
            expect(color).toBe(nest.colorInner);
        });
        spyOn(DrawUtils, 'drawRing').and.callFake(function (ctx, x, y, radius, color) {
            expect(ctx).toBe(context);
            expect(x).toBe(nest.position.x);
            expect(y).toBe(nest.position.y);
            expect(radius).toBe(nest.radius);
            expect(color).toBe(nest.colorOuter);
        });

        nest.render(context);

        expect(DrawUtils.drawCircle.calls.count()).toBe(1);
        expect(DrawUtils.drawRing.calls.count()).toBe(1);
    });
});