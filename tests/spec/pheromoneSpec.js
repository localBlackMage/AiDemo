describe("Pheromone Model", function () {
    var Pheromone, Utils, MathUtils, DrawUtils, Vector,
        defaultOptions;

    beforeEach(function () {
        module('aidemo.service.utils', 'aidemo.service.mathUtils', 'aidemo.service.drawUtils', 'aidemo.models.vector', 'aidemo.models.ant');

        inject(function (_Pheromone_, _Utils_, _MathUtils_, _DrawUtils_, _Vector_) {
            Pheromone = _Pheromone_;
            Utils = _Utils_;
            MathUtils = _MathUtils_;
            DrawUtils = _DrawUtils_;
            Vector = _Vector_;

            defaultOptions = {
                position: new Vector({x: 10, y: 10}),
                id: 123,
                hasFood: false
            };
        });
    });

    it("should instantiate properly", function(){
        var pheromone = new Pheromone(defaultOptions);

        expect(pheromone.position).toBe(defaultOptions.position);
        expect(pheromone.id).toBe(defaultOptions.id);
        expect(pheromone.hasFood).toBe(defaultOptions.hasFood);
        expect(pheromone.timeToLive).toBe(20.0);
        expect(pheromone.currentTime).toBe(0);
        expect(pheromone.color).toBe("#FFFFFF");
    });

    it("should update", function() {
        var pheromone = new Pheromone(defaultOptions);

        var result = pheromone.update(0.1);

        expect(pheromone.currentTime).toBe(0.1);
        expect(result).toBeFalsy();

        pheromone.currentTime = pheromone.timeToLive;

        result = pheromone.update(0.1);

        expect(pheromone.currentTime).toBe(20.1);
        expect(result).toBeTruthy();
    });

    //it("should calculate it's radius", function() {
    //    var pheromone = new Pheromone(defaultOptions);
    //
    //    pheromone.currentTime = 1.0;
    //
    //    var result = pheromone.getRadius();
    //
    //    expect(result).toBe(2.8);
    //});

    it("should render itself", function () {
        var pheromone = new Pheromone(defaultOptions),
            context = document.createElement("canvas").getContext('2d');

        spyOn(DrawUtils, 'drawCircle').and.callFake(function (ctx, x, y, radius, color) {
            expect(ctx).toBe(context);
            expect(x).toBe(pheromone.position.x);
            expect(y).toBe(pheromone.position.y);
            expect(radius).toBe(2.0);
            expect(color).toBe(pheromone.color);
        });

        pheromone.render(context);

        expect(DrawUtils.drawCircle.calls.count()).toBe(1);
    });
});