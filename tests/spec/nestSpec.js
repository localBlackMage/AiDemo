describe("Nest Model", function () {
    var Nest, Utils, MathUtils, DrawUtils, Vector, Ant,
        defaultOptions;

    beforeEach(function () {
        module('aidemo.service.utils', 'aidemo.service.mathUtils', 'aidemo.service.drawUtils', 'aidemo.models.vector', 'aidemo.models.ant');

        inject(function (_Nest_, _Utils_, _MathUtils_, _DrawUtils_, _Vector_, _Ant_) {
            Nest = _Nest_;
            Utils = _Utils_;
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
    });

    it("should NOT spawn an ant if there is not enough food", function() {
        var nest = new Nest(defaultOptions);

        nest.foodStore = 0;

        var result = nest.attemptToSpawnAnt();

        expect(result).toBe(null);
    });

    it("should spawn an ant if there is enough food", function() {
        var nest = new Nest(defaultOptions);

        nest.foodStore = 1;

        var result = nest.attemptToSpawnAnt();

        expect(result instanceof Ant).toBeTruthy();
        expect(nest.foodStore).toBe(0);
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