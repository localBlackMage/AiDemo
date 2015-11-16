describe("Pheromone Model", function () {
    var Pheromone, Utils, MathUtils, DrawUtils, Vector;

    beforeEach(function () {
        module('aidemo.service.utils', 'aidemo.service.mathUtils', 'aidemo.service.drawUtils', 'aidemo.models.vector', 'aidemo.models.ant');

        inject(function (_Pheromone_, _Utils_, _MathUtils_, _DrawUtils_, _Vector_) {
            Pheromone = _Pheromone_;
            Utils = _Utils_;
            MathUtils = _MathUtils_;
            DrawUtils = _DrawUtils_;
            Vector = _Vector_;
        });
    });

    it("should instantiate properly", function(){
        var pheromone = new Pheromone();
    })
});