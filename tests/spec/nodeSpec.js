describe("Node Tests", function () {
    var box = {
            width: 10, height: 10,
            center: New(Vector, {x: 10, y: 10})
        },
        defaultOptions = {
            id: 1, box: box, distance: 10, pos: New(Vector, {x:1, y:-1}),
            neighbors: [New (Node, {id:2})],
            selected: false, special: false, path: false
        };
    beforeEach(module("DemoApp"));

    it("should instantiate properly", function () {
        var node = New(Node, defaultOptions);


        expect(node.id).toEqual(defaultOptions.id);
        expect(node.box).toEqual(box);
        expect(node.distance).toEqual(defaultOptions.distance);
        expect(node.neighbors).toEqual(defaultOptions.neighbors);
        expect(node.pos).toEqual(defaultOptions.pos);
        expect(node.selected).toEqual(defaultOptions.selected);
        expect(node.special).toEqual(defaultOptions.special);
        expect(node.path).toEqual(defaultOptions.path);
    });

    it("should return it's neighbors", function () {
        var node = New(Node, defaultOptions),
            neighbors = [New(Node, {id: 3}), New(Node, {id: 4})],
            res;
        node.neighbors = neighbors;

        res = node.getNeighbors();

        expect(res).toEqual(neighbors);
    });

    it("should fill out neighbors", function () {
        var node = New(Node, defaultOptions),
            neighbors = [New(Node, {id: 3}), New(Node, {id: 4})];

        node.fillNeighbors(neighbors);

        expect(node.neighbors).toEqual(neighbors);
    });

    it("should reset selected", function () {
        var node = New(Node, defaultOptions);
        node.selected = true;

        node.resetSelect();

        expect(node.selected).toBe(false);
    });

    it("should know if it is selected", function () {
        var node = New(Node, defaultOptions);
        node.pos = New(Vector, {});

        node.select(New (Vector,{x:RANGE+1}));

        expect(node.selected).toBe(false);

        node.select(New (Vector,{x:RANGE}));

        expect(node.selected).toBe(true);
    });

    it("should know if it is specially selected", function () {
        var node = New(Node, defaultOptions), res;
        node.pos = New(Vector, {});

        res = node.specialSelect(New (Vector,{x:RANGE+1}));

        expect(res).toBe(false);
        expect(node.special).toBe(false);

        res = node.specialSelect(New (Vector,{x:RANGE}));

        expect(res).toBe(true);
        expect(node.special).toBe(true);
    });

    it("should know if it is path selected", function () {
        var node = New(Node, defaultOptions), res;
        node.special = true;

        node.pathSelect();

        expect(node.path).toBe(false);

        node.special = false;

        node.pathSelect();

        expect(node.path).toBe(true);
    });

//    it("should update accordingly", function () {
//        var node = New(Node, defaultOptions);
//        node.update();
//    });

    it("should render it's paths", function () {
        var node = New(Node, defaultOptions),
            context = document.createElement("canvas").getContext('2d'),
            neighbors = [];

        spyOn(DrawUtils, 'drawLine').and.callFake(function (ctx, x, y, color, str) {
            expect(ctx).toBe(context);
            expect(x).toBe(node.pos.x+10);
            expect(y).toBe(node.pos.y-10);
            expect(color).toBe(SELECTED_COLOR);
            expect(str).toBe(node.id.toString());
        });
        spyOn(DrawUtils, 'drawCircle').and.callFake(function(ctx, x, y, radius, color){
            expect(ctx).toBe(context);
            expect(x).toBe(node.pos.x);
            expect(y).toBe(node.pos.y);
            expect(radius).toBe(5);
            expect(color).toBe(expectedColor);
        });
        expectedColor = RENDER_COLOR;
        node.render(context);
        expect(DrawUtils.drawText.calls.count()).toBe(1);
        expect(DrawUtils.drawCircle.calls.count()).toBe(1);
        expect(node.getColor.calls.count()).toBe(1);
    });

    it("should return the correct color", function() {
        var node = New(Node, defaultOptions), res;

        res = node.getColor();
        expect(res).toBe(RENDER_COLOR);

        node.selected = true;
        res = node.getColor();
        expect(res).toBe(SELECTED_COLOR);

        node.path = true;
        res = node.getColor();
        expect(res).toBe(PATH_COLOR);

        node.special = true;
        res = node.getColor();
        expect(res).toBe(SPECIAL_COLOR);
    });

    it("should render", function () {
        var node = New(Node, defaultOptions),
            context = document.createElement("canvas").getContext('2d'),
            expectedColor;
        spyOn(node, 'getColor').and.callFake(function(){
            return RENDER_COLOR;
        });
        spyOn(DrawUtils, 'drawText').and.callFake(function (ctx, x, y, color, str) {
            expect(ctx).toBe(context);
            expect(x).toBe(node.pos.x+10);
            expect(y).toBe(node.pos.y-10);
            expect(color).toBe(SELECTED_COLOR);
            expect(str).toBe(node.id.toString());
        });
        spyOn(DrawUtils, 'drawCircle').and.callFake(function(ctx, x, y, radius, color){
            expect(ctx).toBe(context);
            expect(x).toBe(node.pos.x);
            expect(y).toBe(node.pos.y);
            expect(radius).toBe(5);
            expect(color).toBe(expectedColor);
        });
        expectedColor = RENDER_COLOR;
        node.render(context);
        expect(DrawUtils.drawText.calls.count()).toBe(1);
        expect(DrawUtils.drawCircle.calls.count()).toBe(1);
        expect(node.getColor.calls.count()).toBe(1);
    });

});