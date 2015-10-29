describe("LifeCell Model", function () {
    var box, LifeCell, Utils, MathUtils, DrawUtils, Vector, GridService,
        ALIVE = "ALIVE", DEAD = "DEAD", ALIVE_COLOR = "#00FF00", DEAD_COLOR = "#222222";

    beforeEach(function () {
        module('aidemo.service.utils', 'aidemo.service.mathUtils',
            'aidemo.service.drawUtils', 'aidemo.service.gridService',
            'aidemo.models.vector', 'aidemo.models.lifeCell');

        inject(function (_LifeCell_, _Utils_, _MathUtils_, _DrawUtils_,
                         _Vector_, _GridService_) {
            LifeCell = _LifeCell_;
            Utils = _Utils_;
            MathUtils = _MathUtils_;
            DrawUtils = _DrawUtils_;
            Vector = _Vector_;
            GridService = _GridService_;

            box = {
                width: 10, height: 10,
                center: new Vector({
                    x: 10,
                    y: 10
                })
            };
        });
    });

    it("should instantiate properly", function () {
        var cellOne = new LifeCell({box: box, status: DEAD}),
            cellTwo = new LifeCell({box: box, status: ALIVE});

        expect(cellOne.box).toEqual(box);
        expect(cellOne.status).toEqual(DEAD);
        expect(cellOne.color).toEqual(DEAD_COLOR);
        
        expect(cellTwo.box).toEqual(box);
        expect(cellTwo.status).toEqual(ALIVE);
        expect(cellTwo.color).toEqual(ALIVE_COLOR);
    });

    it("should fill out neighbors", function () {
        var cellObj = new LifeCell({}),
            neighbors = [
                new LifeCell({box: box, status: ALIVE}),
                new LifeCell({box: box, status: DEAD})
            ];

        cellObj.fillNeighbors(neighbors);

        expect(cellObj.neighbors).toEqual(neighbors);
    });

    it("should set it's status and color accordingly", function () {
        var cellObj = new LifeCell({status: ALIVE});

        cellObj.setStatus(DEAD);
        expect(cellObj.status).toEqual(DEAD);
        expect(cellObj.color).toEqual(DEAD_COLOR);

        cellObj.setStatus(ALIVE);
        expect(cellObj.status).toEqual(ALIVE);
        expect(cellObj.color).toEqual(ALIVE_COLOR);

        cellObj.setStatus();
        expect(cellObj.status).toEqual(DEAD);
        expect(cellObj.color).toEqual(DEAD_COLOR);
    });

    it("should update accordingly", function () {
        var cellObj = new LifeCell({status: ALIVE}),
            neighbors = [];
        for (var i = 0; i < 8; i++) {
            neighbors.push(new LifeCell({status: i % 2 == 0 ? ALIVE : DEAD}));
        }
        cellObj.fillNeighbors(neighbors);
        spyOn(cellObj, 'rules').and.callFake(function (alive) {
            expect(alive).toBe(4);
        });

        cellObj.update();
    });

    it("should render", function () {
        var cellObj = new LifeCell({box: box, status: ALIVE}),
            context = document.createElement("canvas").getContext('2d');
        spyOn(DrawUtils, 'drawSquare').and.callFake(function (ctx, box, color) {
            expect(ctx).toBe(context);
            expect(box).toBe(cellObj.box);
            expect(color).toBe(cellObj.color);
        });

        cellObj.render(context);

        expect(DrawUtils.drawSquare).toHaveBeenCalled();
    });

    it("should follow it's rules", function () {
        var cellObj = new LifeCell({box: box, status: ALIVE}),
            result;

        for (var i = 0; i < 9; i++) {
            result = cellObj.rules(i);
            if (i === 2 || i === 3)
                expect(result).toBe(ALIVE);
            else
                expect(result).toBe(DEAD);
        }

        cellObj.setStatus(DEAD);

        for (var j = 0; j < 9; j++) {
            result = cellObj.rules(j);
            if (j === 3)
                expect(result).toBe(ALIVE);
            else
                expect(result).toBe(DEAD);
        }
    });
});