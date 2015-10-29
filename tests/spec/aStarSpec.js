describe("AStar Service", function () {
    var AStar, Queue, Vector;

    beforeEach(function () {
        module('aidemo.service.aStar', 'aidemo.models.queue', 'aidemo.models.vector');

        inject(function (_AStar_, _Queue_, _Vector_) {
            AStar = _AStar_;
            Queue = _Queue_;
            Vector = _Vector_;
        });
    });

    it("should calculate heuristic cost estimates", function () {
        var a = {position: new Vector()},
            b = {position: new Vector({x: 10})};

        var result = AStar._heuristicCostEstimate(a, b);

        expect(result).toBe(9);
    });
});