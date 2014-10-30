describe("Neuron Tests", function () {
    beforeEach(module("DemoApp"));

    it("should instantiate properly", function () {
        var neuron = New (Neuron, {});

        expect(neuron.constructor).toBeDefined();
    });

//    it("should update accordingly", function() {
//
//    });

//    it("should render", function() {
//
//    });
});