describe("Pheromone Model", function () {
    var Pheromone, MathUtils, DrawUtils, Vector,
        defaultOptions;

    beforeEach(function () {
        module('aidemo.service.mathUtils', 'aidemo.service.drawUtils', 'aidemo.models.vector', 'aidemo.models.ants.pheromone');

        inject(function (_Pheromone_, _Utils_, _MathUtils_, _DrawUtils_, _Vector_) {
            Pheromone = _Pheromone_;
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
        expect(pheromone.timeToLive).toBe(15.0);
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

        expect(pheromone.currentTime).toBe(15.1);
        expect(result).toBeTruthy();
    });

    it("should calculate it's age weight", function() {
        var pheromone = new Pheromone(defaultOptions);

        pheromone.currentTime = 7.5;

        var result = pheromone.getAgeWeight();

        expect(result).toBe(.5);
    });

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