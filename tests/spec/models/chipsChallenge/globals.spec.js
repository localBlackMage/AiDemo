describe("Globals", function () {
    'use strict';
    var Globals;
    beforeEach(function () {
        module('aidemo.models.chip.globals', 'aidemo.models.vector');

        inject(function (_Globals_) {
            Globals = _Globals_;
        });
    });

    it('should have several global objects defined', function () {
        expect(Globals.TILE_SIZE).toBeDefined();

        expect(Globals.UP).toBeDefined();
        expect(Globals.DOWN).toBeDefined();
        expect(Globals.LEFT).toBeDefined();
        expect(Globals.RIGHT).toBeDefined();

        expect(Globals.DEAD).toBeDefined();
        expect(Globals.ALIVE).toBeDefined();
        expect(Globals.COMPLETE).toBeDefined();
    });
});