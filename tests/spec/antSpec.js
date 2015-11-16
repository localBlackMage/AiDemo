describe("Ant Model", function () {
    var Ant, Utils, MathUtils, DrawUtils, Vector,
        defaultOptions;

    beforeEach(function () {
        module('aidemo.service.utils', 'aidemo.service.mathUtils', 'aidemo.service.drawUtils', 'aidemo.models.vector', 'aidemo.models.ant');

        inject(function (_Ant_, _Utils_, _MathUtils_, _DrawUtils_, _Vector_) {
            Ant = _Ant_;
            Utils = _Utils_;
            MathUtils = _MathUtils_;
            DrawUtils = _DrawUtils_;
            Vector = _Vector_;

            defaultOptions = {
                position: new Vector({x: 10, y: 10}),
                velocity: new Vector({x: 1, y: 0}),
                speed: 1.0,
                cohesionWeight: 0.5,
                separateWeight: 0.5,
                alignWeight: 0.5,
                avoidWeight: 0.5,
                pheromoneWeight: 0.5
            };
        });
    });

    it("should instantiate properly", function(){
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
    })
});