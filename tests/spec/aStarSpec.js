describe("AStar Tests", function () {
    beforeEach(module("DemoApp"));

    it("should instantiate a ReconRetValue properly", function () {
        var recRetValueObj = New(ReconRetValue, {});

        expect(recRetValueObj.constructor).toBeDefined();
    });
});