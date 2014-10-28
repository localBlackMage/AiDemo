describe("DrawUtils Tests", function () {
    var canvas, context, letters = '0123456789ABCDEF';
    beforeEach(module("DemoApp"));

    beforeEach(function() {
        canvas = document.createElement("canvas");
        canvas.height = 100;
        canvas.width = 100;
        context = canvas.getContext("2d")
    });

    it("should clear a canvas", function () {
        spyOn(context, 'clearRect');

        DrawUtils.clearCanvas(canvas);

        expect(context.clearRect.calls.count()).toEqual(1);
        expect(context.clearRect).toHaveBeenCalledWith(0, 0, canvas.width+1, canvas.height+1);
    });

    it("should fill a canvas", function () {
        var color = "#CCCCCC";
        spyOn(context, 'fillRect');

        DrawUtils.fillCanvas(canvas, color);

        expect(context.fillStyle.toLowerCase()).toEqual(color.toLowerCase());
        expect(context.fillRect.calls.count()).toEqual(1);
        expect(context.fillRect).toHaveBeenCalledWith(0, 0, canvas.width+1, canvas.height+1);
    });

    it("should draw a circle on the canvas", function () {
        var x = 10, y = 10, radius = 5, color = "#CCCCCC";
        spyOn(context, 'beginPath');
        spyOn(context, 'arc');
        spyOn(context, 'fill');
        spyOn(context, 'stroke');
        spyOn(context, 'closePath');

        DrawUtils.drawCircle(context, x, y, radius, color);

        expect(context.fillStyle.toLowerCase()).toEqual(color.toLowerCase());
        expect(context.strokeStyle.toLowerCase()).toEqual(color.toLowerCase());
        expect(context.beginPath.calls.count()).toEqual(1);
        expect(context.arc.calls.count()).toEqual(1);
        expect(context.arc).toHaveBeenCalledWith(x, y, radius, 0, 2 * Math.PI, false);
        expect(context.fill.calls.count()).toEqual(1);
        expect(context.stroke.calls.count()).toEqual(1);
        expect(context.closePath.calls.count()).toEqual(1);
    });

    it("should draw a ring on the canvas", function () {
        var x = 10, y = 10, radius = 5, color = "#CCCCCC";
        spyOn(context, 'beginPath');
        spyOn(context, 'arc');
        spyOn(context, 'stroke');
        spyOn(context, 'closePath');

        DrawUtils.drawCircle(context, x, y, radius, color);

        expect(context.strokeStyle.toLowerCase()).toEqual(color.toLowerCase());
        expect(context.beginPath.calls.count()).toEqual(1);
        expect(context.arc.calls.count()).toEqual(1);
        expect(context.arc).toHaveBeenCalledWith(x, y, radius, 0, 2 * Math.PI, false);
        expect(context.stroke.calls.count()).toEqual(1);
        expect(context.closePath.calls.count()).toEqual(1);
    });

    it("should draw a square on the canvas", function () {
        var box = {
                x: 10, y: 10,
                width: 20, height: 20
            },
            color = "#CCCCCC";
        spyOn(context, 'fillRect');

        DrawUtils.drawSquare(context, box, color);

        expect(context.fillStyle.toLowerCase()).toEqual(color.toLowerCase());
        expect(context.fillRect.calls.count()).toEqual(1);
        expect(context.fillRect).toHaveBeenCalledWith(box.x, box.y, box.width, box.height);
    });

    it("should draw a line on the canvas", function () {
        var sX = 10, sY = 20, eX = 30, eY = 40, color = "#CCCCCC";
        spyOn(context, 'beginPath');
        spyOn(context, 'moveTo');
        spyOn(context, 'lineTo');
        spyOn(context, 'stroke');
        spyOn(context, 'closePath');

        DrawUtils.drawLine(context, sX, sY, eX, eY, color);

        expect(context.strokeStyle.toLowerCase()).toEqual(color.toLowerCase());
        expect(context.beginPath.calls.count()).toEqual(1);
        expect(context.moveTo.calls.count()).toEqual(1);
        expect(context.moveTo).toHaveBeenCalledWith(sX, sY);
        expect(context.lineTo.calls.count()).toEqual(1);
        expect(context.lineTo).toHaveBeenCalledWith(eX, eY);
        expect(context.stroke.calls.count()).toEqual(1);
        expect(context.closePath.calls.count()).toEqual(1);
    });

    it("should draw a grid on the canvas", function () {
        var box = {
                x: 0, y: 0,
                width: 100, height: 100
            },
            spacing = 50, color = "#CCCCCC";
        spyOn(DrawUtils, 'drawLine');

        DrawUtils.drawGrid(context, box, spacing, color);

        expect(DrawUtils.drawLine.calls.count()).toEqual(4);
        expect(DrawUtils.drawLine).toHaveBeenCalledWith(context, 0, 0, box.width, 0, color);
        expect(DrawUtils.drawLine).toHaveBeenCalledWith(context, 0, 50, box.width, 50, color);
        expect(DrawUtils.drawLine).toHaveBeenCalledWith(context, 0, 0, 0, box.height, color);
        expect(DrawUtils.drawLine).toHaveBeenCalledWith(context, 50, 0, 50, box.height, color);
    });

    it("should draw a exclamation on the canvas", function () {
        var x = 10, y = 10, color = "#CCCCCC";
        spyOn(DrawUtils, 'drawLine');

        DrawUtils.drawExclamation(context, x, y, color);

        expect(DrawUtils.drawLine.calls.count()).toEqual(2);
        expect(DrawUtils.drawLine).toHaveBeenCalledWith(context, x, y, x, y - 1, color);
        expect(DrawUtils.drawLine).toHaveBeenCalledWith(context, x, y - 3, x, y - 13, color);
    });

    it("should draw text on the canvas", function () {
        var x = 10, y = 10, txt = "Test", color = "#CCCCCC";
        spyOn(context, 'fillText');

        DrawUtils.drawText(context, x, y, color, txt);

        expect(context.font.toLowerCase()).toEqual(DrawUtils.defaultFont.toLowerCase());
        expect(context.fillStyle.toLowerCase()).toEqual(color.toLowerCase());
        expect(context.fillText.calls.count()).toEqual(1);
        expect(context.fillText).toHaveBeenCalledWith(txt, x, y);
    });

    it("should generate a random color hex value", function () {
        var res = DrawUtils.getRandomColor();

        expect(res.length).toEqual(7);
        expect(res).toContain("#");
        for(var idx=1; idx<res.length;idx++) {
            expect(letters.toLowerCase()).toContain(res[idx].toLowerCase());
        }
    });

    it("should generate a random green color hex value", function () {
        var res = DrawUtils.getRandomGreen(), greenLetters = '56789ABCDEF';

        expect(res.length).toEqual(7);
        expect(res).toContain("#");
        for(var x=1; x<3;x++) {
            expect(res[x]).toBe('0');
        }
        expect(greenLetters).toContain(res[3]);
        expect(greenLetters).toContain(res[4]);
        for(var y=5; y<res.length;y++) {
            expect(res[y]).toBe('0');
        }
    });

    it("should generate a random red color hex value", function () {
        var res = DrawUtils.getRandomRed(), redLetters = '56789ABCDEF';

        expect(res.length).toEqual(7);
        expect(res).toContain("#");
        expect(redLetters).toContain(res[1]);
        expect(redLetters).toContain(res[2]);
        for(var idx=3; idx<res.length;idx++) {
            expect(res[idx]).toBe('0');
        }
    });
});
describe("Flock Entity Tests", function () {
    var defaultOptionsPrey = {
            pos: New(Vector, {x: 10, y: 10}),
            vel: New(Vector, {x: 1, y: -1}),
            radius: 5, speed: 1.5, cohW: 0.4, sepW: 0.4, aliW: 0.2, wanW: 0.2, avoW: 1.0,
            type: PREY, color: "#0F0"
        },
        defaultOptionsPred = {
            pos: New(Vector, {x: 10, y: 10}),
            vel: New(Vector, {x: 1, y: -1}),
            radius: 5, speed: 3.0, cohW: 0.2, sepW: 0.2, aliW: 0.1, wanW: 0.5,
            type: PREDATOR, color: "#F00"
        },
        defaultOptionsUpdate = {
            box: {
                width: 200, height: 200,
                center: 100, y: 100
            },
            herd: null, pred: null
        },
        herd, preds;

    beforeEach(module("DemoApp"));

    beforeEach(function() {
        herd = [];
        for(var x=0;x<5;x++){
            var ent = New (Entity, defaultOptionsPrey);
            ent.pos = New (Vector, {x: ent.pos.x * x, y: ent.pos.y * x});
            herd.push(ent);
        }

        preds = [];
        for(var y=0;y<5;y++){
            var ent = New (Entity, defaultOptionsPred);
            ent.pos = New (Vector, {x: (ent.pos.x+10) * y, y: ent.pos.y * y});
            preds.push(ent);
        }
        defaultOptionsUpdate.herd = herd;
        defaultOptionsUpdate.pred = preds;
    });

    it("should instantiate properly", function () {
        var entObj = New (Entity, defaultOptionsPrey);

        expect(entObj.pos).toEqual(defaultOptionsPrey.pos);
        expect(entObj.vel).toEqual(defaultOptionsPrey.vel);
        expect(entObj.radius).toEqual(defaultOptionsPrey.radius);
        expect(entObj.color).toEqual(defaultOptionsPrey.color);
        expect(entObj.speed).toEqual(defaultOptionsPrey.speed);

        expect(entObj.cohW).toEqual(defaultOptionsPrey.cohW);
        expect(entObj.sepW).toEqual(defaultOptionsPrey.sepW);
        expect(entObj.aliW).toEqual(defaultOptionsPrey.aliW);
        expect(entObj.avoW).toEqual(defaultOptionsPrey.avoW);
        expect(entObj.wanW).toEqual(defaultOptionsPrey.wanW);

        expect(entObj.type).toEqual(defaultOptionsPrey.type);
    });

    it("should apply cohesion", function () {
        var entObj = New (Entity, defaultOptionsPrey), target = New(Vector, {}), res;
        herd.forEach(function (other) { target.add(other.pos); });
        target = target.divNew(herd.length).subNew(entObj.pos).normalize(1);

        res = entObj.cohesion(herd);

        expect(res.x).toEqual(target.x);
        expect(res.y).toEqual(target.y);
    });

    it("should apply separation", function () {
        var entObj = New (Entity, defaultOptionsPrey), target = New(Vector, {}), res;
        herd.forEach(function (other) { target.add(other.pos); });
        target = target.divNew(herd.length).subNew(entObj.pos).normalize(1).mulNew(-1);

        res = entObj.separation(herd);

        expect(res.x).toEqual(target.x);
        expect(res.y).toEqual(target.y);
    });

    it("should align itself", function () {
        var entObj = New (Entity, defaultOptionsPrey), target = New(Vector, {}), res;
        herd.forEach(function (other) { target.add(other.vel); });
        target = target.divNew(herd.length).normalize(1);

        res = entObj.alignment(herd);

        expect(res.x).toEqual(target.x);
        expect(res.y).toEqual(target.y);
    });

    it("should avoid predators", function () {
        var entObj = New (Entity, defaultOptionsPrey), target = New(Vector, {}), res;
        preds.forEach(function (other) { target.add(other.pos); });
        target = target.divNew(preds.length).subNew(entObj.pos).normalize(1).mulNew(-1);

        res = entObj.avoidPredators(preds);

        expect(res.x).toEqual(target.x);
        expect(res.y).toEqual(target.y);
    });

    it("should update as a PREDATOR", function () {
        var entObj = New (Entity, defaultOptionsPred);
        entObj.vel = New (Vector, {x: 1});
        spyOn(entObj, 'cohesion').and.callFake(function(){ return New(Vector, {x:1}); });
        spyOn(entObj, 'separation').and.callFake(function(){ return New(Vector, {x:1}); });
        spyOn(entObj, 'alignment').and.callFake(function(){ return New(Vector, {x:1}); });
        spyOn(entObj, 'wander').and.callFake(function(){ return New(Vector, {x:1}); });
        spyOn(entObj, 'avoidWalls').and.callFake(function(){ return New(Vector, {x:1}); });

        entObj.updatePredator(defaultOptionsUpdate);

        expect(entObj.exc).toBe(false);
        expect(entObj.vel.x).toBe(2.5);
        expect(entObj.vel.y).toBe(0);
    });

    it("should update as a PREY", function () {
        var entObj = New (Entity, defaultOptionsPrey);
        entObj.vel = New (Vector, {x: 1});
        spyOn(entObj, 'avoidPredators').and.callFake(function(){ return New(Vector, {x: 1}); });

        entObj.updatePrey(defaultOptionsUpdate);

        expect(entObj.exc).toBe(true);
        expect(entObj.vel.x).toBe(2);
        expect(entObj.vel.y).toBe(0);

        var entObjTwo = New (Entity, defaultOptionsPrey);
        entObjTwo.vel = New (Vector, {x: 1});
        spyOn(entObjTwo, 'avoidPredators').and.callFake(function(){ return New(Vector, {}); });
        spyOn(entObjTwo, 'cohesion').and.callFake(function(){ return New(Vector, {x:1}); });
        spyOn(entObjTwo, 'separation').and.callFake(function(){ return New(Vector, {x:1}); });
        spyOn(entObjTwo, 'alignment').and.callFake(function(){ return New(Vector, {x:1}); });
        spyOn(entObjTwo, 'wander').and.callFake(function(){ return New(Vector, {x:1}); });
        spyOn(entObjTwo, 'avoidWalls').and.callFake(function(){ return New(Vector, {x:1}); });

        entObjTwo.updatePrey(defaultOptionsUpdate);

        expect(entObjTwo.exc).toBe(false);
        expect(entObjTwo.vel.x).toBe(2.7);
        expect(entObjTwo.vel.y).toBe(0);
    });

    it("should wander", function () {
        var entObj = New (Entity, defaultOptionsPrey),
            vel = New (Vector, {x: 1, y: 0}),
            expected = MathUtils.angleToVector(MathUtils.vectorToAngle(vel) + 0.5).normalize(1),
            res;
        entObj.vel = vel;

        spyOn(MathUtils, 'getRand').and.callFake(function(){ return 0.5; });

        res = entObj.wander(defaultOptionsUpdate.box);
        expect(res.x).toEqual(expected.x);
        expect(res.y).toEqual(expected.y);
    });

    it("should avoid walls", function () {
        var entObj = New (Entity, defaultOptionsPrey), res;
        entObj.pos = New (Vector, {x: 49, y: 49});

        res = entObj.avoidWalls(defaultOptionsUpdate.box);

        expect(res.x).toEqual(1);
        expect(res.y).toEqual(1);


        entObj.pos = New (Vector, {
            x: defaultOptionsUpdate.box.width-49,
            y: defaultOptionsUpdate.box.height-49
        });

        res = entObj.avoidWalls(defaultOptionsUpdate.box);

        expect(res.x).toEqual(-1);
        expect(res.y).toEqual(-1);
    });

    it("should update it's velocity based upon it's type", function () {
        var entObj = New (Entity, defaultOptionsPrey), res,
            newVel;
        entObj.vel = New (Vector, {x: 1, y: 0});
        newVel = entObj.vel.normalize(1).mulNew(entObj.speed);

        spyOn(entObj, 'updatePrey').and.callFake(function(options){  });

        res = entObj.updateVelocity(defaultOptionsUpdate);

        expect(entObj.updatePrey.calls.count()).toBe(1);
        expect(res.x).toBe(newVel.x);
        expect(res.y).toBe(newVel.y);



        entObj = New (Entity, defaultOptionsPred);
        entObj.vel = New (Vector, {x: 1, y: 0});
        newVel = entObj.vel.normalize(1).mulNew(entObj.speed);
        spyOn(entObj, 'updatePredator').and.callFake(function(options){  });

        res = entObj.updateVelocity(defaultOptionsUpdate);

        expect(entObj.updatePredator.calls.count()).toBe(1);
        expect(res.x).toBe(newVel.x);
        expect(res.y).toBe(newVel.y);
    });

    it("should bounce off of walls", function () {
        var entObj = New (Entity, defaultOptionsPrey);

        entObj.pos = New (Vector, {x: -1, y: -1});
        entObj.vel = New (Vector, {x: -1, y: -1});

        entObj.avoidWall(defaultOptionsUpdate.box);

        expect(entObj.vel.x).toEqual(1);
        expect(entObj.vel.y).toEqual(1);


        entObj.pos = New (Vector, {
            x: defaultOptionsUpdate.box.width+1,
            y: defaultOptionsUpdate.box.height+1
        });
        entObj.vel = New (Vector, {x: 1, y: 1});

        entObj.avoidWall(defaultOptionsUpdate.box);

        expect(entObj.vel.x).toEqual(-1);
        expect(entObj.vel.y).toEqual(-1);
    });

    it("should keep itself in bounds", function () {
        var entObj = New (Entity, defaultOptionsPrey);
        entObj.pos = New (Vector, {x: -1, y: -1});
        entObj.keepInBounds(defaultOptionsUpdate.box);

        expect(entObj.pos.x).toEqual(0);
        expect(entObj.pos.y).toEqual(0);

        entObj.pos = New (Vector, {
            x: defaultOptionsUpdate.box.width+1,
            y: defaultOptionsUpdate.box.height+1
        });
        entObj.keepInBounds(defaultOptionsUpdate.box);

        expect(entObj.pos.x).toEqual(defaultOptionsUpdate.box.width);
        expect(entObj.pos.y).toEqual(defaultOptionsUpdate.box.height);
    });

    it("should calculate it's nose", function () {
        var entObj = New (Entity, defaultOptionsPrey),
            nose = New(Vector, {x: entObj.pos.x+10, y: entObj.pos.y});
        entObj.vel = New (Vector, {x: 1, y: 0});

        entObj.calcNose();

        expect(entObj.nose.x).toEqual(nose.x);
        expect(entObj.nose.y).toEqual(nose.y);
    });

    it("should update accordingly", function() {
        var entObj = New (Entity, defaultOptionsPrey);

        spyOn(entObj, 'updateVelocity').and.callFake(function(options){ return New(Vector, {x: 0, y: 0})});
        spyOn(entObj, 'avoidWall').and.callFake(function(box){ });
        spyOn(entObj, 'keepInBounds').and.callFake(function(box){ });

        entObj.update(defaultOptionsUpdate);
        expect(entObj.updateVelocity.calls.count()).toEqual(1);

        expect(entObj.avoidWall.calls.count()).toEqual(1);
        expect(entObj.keepInBounds.calls.count()).toEqual(1);
    });

    it("should render", function() {
        var entObj = New (Entity, defaultOptionsPrey),
            nose = New(Vector, {x: 20, y: 20}),
            context = document.createElement("canvas").getContext('2d');
        spyOn(entObj, 'calcNose').and.callFake(function(){ entObj.nose = nose; });
        spyOn(DrawUtils, 'drawCircle').and.callFake(function(ctx, x, y, radius, color){
            expect(ctx).toBe(context);
            expect(x).toBe(entObj.pos.x);
            expect(y).toBe(entObj.pos.y);
            expect(radius).toBe(entObj.radius);
            expect(color).toBe(entObj.color);
        });
        spyOn(DrawUtils, 'drawLine').and.callFake(function(ctx, sx, sy, ex, ey, color){
            expect(ctx).toBe(context);
            expect(sx).toBe(entObj.pos.x);
            expect(sy).toBe(entObj.pos.y);
            expect(ex).toBe(nose.x);
            expect(ey).toBe(nose.y);
            expect(color).toBe(entObj.color);
        });
        spyOn(DrawUtils, 'drawExclamation').and.callFake(function(ctx, x, y, color){
            expect(ctx).toBe(context);
            expect(x).toBe(entObj.pos.x);
            expect(y).toBe(entObj.pos.y-10);
            expect(color).toBe(EXC_COLOR);
        });
        entObj.render(context);

        entObj.exc = true;
        entObj.render(context);
    });
});


//  it("", function () {
//  });
describe("Life Entity Tests", function () {
    var box = {
            width: 10, height: 10,
            center: New(Vector, {x: 10, y: 10})
        };
    beforeEach(module("DemoApp"));

    it("should instantiate properly", function () {
        var cellOne = New (Cell, {box: box, status: DEAD}),
            cellTwo = New (Cell, {box: box, status: ALIVE});

        expect(cellOne.box).toEqual(box);
        expect(cellOne.status).toEqual(DEAD);
        expect(cellOne.color).toEqual(DEAD_COLOR);
        expect(cellTwo.box).toEqual(box);
        expect(cellTwo.status).toEqual(ALIVE);
        expect(cellTwo.color).toEqual(ALIVE_COLOR);
    });

    it("should fill out neighbors", function () {
        var cellObj = New (Cell, {}),
            neighbors = [New (Cell, {box: box, status: ALIVE}), New (Cell, {box: box, status: DEAD})];

        cellObj.fillNeighbors(neighbors);

        expect(cellObj.neighbors).toEqual(neighbors);
    });

    it("should set it's status and color accordingly", function () {
        var cellObj = New (Cell, {status: ALIVE});

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

    it("should update accordingly", function() {
        var cellObj = New (Cell, {status: ALIVE}),
            neighbors = [];
        for(var i=0;i<8;i++){ neighbors.push(New (Cell, {status: i % 2 == 0 ? ALIVE : DEAD})); }
        cellObj.fillNeighbors(neighbors);
        spyOn(cellObj, 'rules').and.callFake(function(alive){
            expect(alive).toBe(4);
        });

        cellObj.update();
    });

    it("should render", function() {
        var cellObj = New (Cell, {box: box, status: ALIVE}),
            context = document.createElement("canvas").getContext('2d');
        spyOn(DrawUtils, 'drawSquare').and.callFake(function(ctx, box, color){
            expect(ctx).toBe(context);
            expect(box).toBe(cellObj.box);
            expect(color).toBe(cellObj.color);
        });

        cellObj.render(context);
    });

    it("should follow it's rules", function() {
        var cellObj = New (Cell, {box: box, status: ALIVE}),
            result;

        for(var i=0;i<9;i++){
            result = cellObj.rules(i);
            if (i === 2 || i === 3)
                expect(result).toBe(ALIVE);
            else
                expect(result).toBe(DEAD);
        }

        cellObj.setStatus(DEAD);

        for(var j=0;j<9;j++){
            result = cellObj.rules(j);
            if (j === 3)
                expect(result).toBe(ALIVE);
            else
                expect(result).toBe(DEAD);
        }
    });
});
describe("MathUtils Tests", function () {
    beforeEach(module("DemoApp"));

    it("should generate a random number", function () {
        var min = 0, max = 10, expected = 5, res;
        spyOn(Math, 'random').and.callFake(function() { return .5; });

        res = MathUtils.getRand(min, max);

        expect(Math.random.calls.count()).toEqual(1);
        expect(res).toEqual(expected);
    });

    it("should calculate the distance between two vectors", function () {
        var vecOne = New(Vector, {x: 10, y: 5}),
            vecTwo = New(Vector, {x: 5, y: 10}),
            expected = vecOne.subNew(vecTwo).length(), res;

        res = MathUtils.distance(vecOne, vecTwo);

        expect(res).toEqual(expected);
    });

    it("should get the nearest items to a given point", function () {
        var array = [
                {pos:New (Vector, {x:10,y:0})},
                {pos:New (Vector, {x:30,y:30})},
                {pos:New (Vector, {x:70,y:70})}
            ],
            origin = {pos:New (Vector, {x:40,y:40})},
            tolerance = 20, res;

        res = MathUtils.getNearest(array, origin, tolerance);

        expect(res).not.toContain(array[0]);
        expect(res).toContain(array[1]);
        expect(res).not.toContain(array[2]);
    });

    it("should calculate a vector from a given angle", function () {
        var angle = 90, res,
            expected = New(Vector, {x: parseFloat(Math.sin(angle)), y: -parseFloat(Math.cos(angle))});

        res = MathUtils.angleToVector(angle);

        expect(res.x).toEqual(expected.x);
        expect(res.y).toEqual(expected.y);
    });

    it("should calculate an angle from a given vector", function () {
        var vec = New(Vector, {x:10,y:10}), res,
            expected = parseFloat(Math.atan2(vec.x, -vec.y));

        res = MathUtils.vectorToAngle(vec);

        expect(res).toEqual(expected);
    });
});
describe("MinHeapNodes Tests", function () {
    var itemOne =   New(Node, {id: 0, distance: 7}),
        itemTwo =   New(Node, {id: 1, distance: 5}),
        itemThree = New(Node, {id: 2, distance: 9}),
        itemFour =  New(Node, {id: 3, distance: 3}),
        itemFive =  New(Node, {id: 4, distance: 1});

    beforeEach(module("DemoApp"));

    it("should instantiate properly", function () {
        var minHeap = New (MinHeapNodes, {});

        expect(minHeap._currentCapacity).toBe(20);
        expect(minHeap._collection).toBeDefined();
        expect(minHeap._collection.length).toBe(20);
        for(var idx=0;idx<minHeap._collection.length;idx++) {
            expect(minHeap._collection[idx]).toBe(null);
        }
        expect(minHeap._index).toBe(0);
    });

    it("should return it's count", function () {
        var minHeap = New (MinHeapNodes, {}), res;

        res = minHeap.Count();

        expect(res).toBe(-1);
    });

    it("should return it's minimum object", function () {
        var minHeap = New (MinHeapNodes, {capacity:3}), res;

        res = minHeap.Minimum();

        expect(res).toBe(null);

        minHeap._collection[0] = itemOne;
        minHeap._collection[1] = itemTwo;
        minHeap._collection[2] = itemThree;

        res = minHeap.Minimum();

        expect(res).toBe(itemOne);
    });

    it("should return the parent of a given child in the heap", function () {
        var minHeap = New (MinHeapNodes, {capacity:3}), res;
        minHeap._collection[0] = itemOne;
        minHeap._collection[1] = itemTwo;
        minHeap._collection[2] = itemThree;

        res = minHeap.GetParent(2);

        expect(res.index).toBe(0);
        expect(res.other).toBe(itemOne);

        res = minHeap.GetParent(1);

        expect(res.index).toBe(0);
        expect(res.other).toBe(itemOne);

        res = minHeap.GetParent(0);

        expect(res.index).toBe(-1);
        expect(res.other).toBe(null);
    });

    it("should return the left child of a given parent in the heap", function () {
        var minHeap = New (MinHeapNodes, {capacity:5}), res;
        minHeap._collection[0] = itemOne;
        minHeap._collection[1] = itemTwo;
        minHeap._collection[2] = itemThree;
        minHeap._collection[3] = itemFour;
        minHeap._collection[4] = itemFive;

        res = minHeap.GetLeftChild(0);

        expect(res.index).toBe(1);
        expect(res.other).toBe(itemTwo);

        res = minHeap.GetLeftChild(1);

        expect(res.index).toBe(3);
        expect(res.other).toBe(itemFour);
    });

    it("should return the right child of a given parent in the heap", function () {
        var minHeap = New (MinHeapNodes, {capacity:5}), res;
        minHeap._collection[0] = itemOne;
        minHeap._collection[1] = itemTwo;
        minHeap._collection[2] = itemThree;
        minHeap._collection[3] = itemFour;
        minHeap._collection[4] = itemFive;

        res = minHeap.GetRightChild(0);

        expect(res.index).toBe(2);
        expect(res.other).toBe(itemThree);

        res = minHeap.GetRightChild(1);

        expect(res.index).toBe(4);
        expect(res.other).toBe(itemFive);
    });

    it("should insert a node into it's collection at it's current index", function () {
        var minHeap = New (MinHeapNodes, {capacity:5}), expected;
        spyOn(minHeap, "HeapifyUp").and.callFake(function(index) {
            expect(index).toBe(expected);
        });
        expected = 0;
        minHeap.Insert(itemOne);

        expect(minHeap._collection[0]).toBe(itemOne);
        expect(minHeap._index).toBe(1);

        expected = 1;
        minHeap.Insert(itemFive);

        expect(minHeap._collection[0]).toBe(itemOne);
        expect(minHeap._collection[1]).toBe(itemFive);
        expect(minHeap._index).toBe(2);
    });

    it("should return out if there is nothing at the given index in HeapifyUp", function () {
        var minHeap = New (MinHeapNodes, {capacity:5});
        spyOn(minHeap, "GetParent").and.callThrough();
        spyOn(minHeap, "Swap").and.callThrough();

        minHeap.HeapifyUp(0);

        expect(minHeap.GetParent.calls.count()).toBe(1);
        expect(minHeap.Swap.calls.count()).toBe(0);
    });

    it("should swap the parent and the child if the parent is not null and has a greater distance than the child in HeapifyUp", function () {
        var minHeap = New (MinHeapNodes, {capacity:5});
        spyOn(minHeap, "GetParent").and.callThrough();
        spyOn(minHeap, "Swap").and.callThrough();
        minHeap._collection[0] = itemOne;
        minHeap._collection[1] = itemTwo;
        minHeap._index = 2;

        minHeap.HeapifyUp(1);

        expect(minHeap.GetParent.calls.count()).toBe(1);
        expect(minHeap.Swap.calls.count()).toBe(1);
        expect(minHeap._collection[0]).toBe(itemTwo);
        expect(minHeap._collection[1]).toBe(itemOne);
    });

    it("should swap the parent and the child if the parent is null and the parentIndex is greater than or equal to 0 in HeapifyUp", function () {
        var minHeap = New (MinHeapNodes, {capacity:5});
        spyOn(minHeap, "GetParent").and.callThrough();
        spyOn(minHeap, "Swap").and.callThrough();
        minHeap._collection[1] = itemTwo;
        minHeap._index = 2;

        minHeap.HeapifyUp(1);

        expect(minHeap.GetParent.calls.count()).toBe(1);
        expect(minHeap.Swap.calls.count()).toBe(1);
        expect(minHeap._collection[0]).toBe(itemTwo);
        expect(minHeap._collection[1]).toBe(null);
    });

    it("should swap the parent and the child if the parent is null and the parentIndex is greater than or equal to 0 in HeapifyUp", function () {
        var minHeap = New (MinHeapNodes, {capacity:5});
        spyOn(minHeap, "GetParent").and.callThrough();
        spyOn(minHeap, "Swap").and.callThrough();
        minHeap._collection[1] = itemTwo;
        minHeap._index = 2;

        minHeap.HeapifyUp(1);

        expect(minHeap.GetParent.calls.count()).toBe(1);
        expect(minHeap.Swap.calls.count()).toBe(1);
        expect(minHeap._collection[0]).toBe(itemTwo);
        expect(minHeap._collection[1]).toBe(null);
    });

    it("should return out if no other conditions are met in HeapifyUp", function () {
        var minHeap = New (MinHeapNodes, {capacity:5});
        spyOn(minHeap, "GetParent").and.callThrough();
        spyOn(minHeap, "Swap").and.callThrough();
        minHeap._collection[0] = itemOne;

        minHeap.HeapifyUp(0);

        expect(minHeap.GetParent.calls.count()).toBe(1);
        expect(minHeap.Swap.calls.count()).toBe(0);
    });

    it("should swap nodes at two given indecies", function () {
        var minHeap = New (MinHeapNodes, {capacity:2});
        minHeap._collection[0] = itemOne;
        minHeap._collection[1] = itemTwo;

        minHeap.Swap(0, 1);

        expect(minHeap._collection[0]).toBe(itemTwo);
        expect(minHeap._collection[1]).toBe(itemOne);
    });

    it("should extract the minimum node and call HeapifyResetCurIndex", function () {
        var minHeap = New (MinHeapNodes, {capacity:5}), res;
        minHeap._collection[0] = itemOne;
        minHeap._collection[1] = itemTwo;
        minHeap._collection[2] = itemThree;
        minHeap._collection[3] = itemFour;
        minHeap._collection[4] = itemFive;
        minHeap._index = 5;

        spyOn(minHeap, "HeapifyResetCurIndex");

        res = minHeap.ExtractMinimum();

        expect(res).toBe(itemOne);
        expect(minHeap._index).toBe(4);
        expect(minHeap._collection[0]).toBe(itemFive);
        expect(minHeap._collection[4]).toBe(null);
        expect(minHeap.HeapifyResetCurIndex.calls.count()).toBe(1);
    });

    it("should reset the currentIndex and call Heapify", function () {
        var minHeap = New (MinHeapNodes, {capacity:5});
        minHeap._currentIndex = 5;

        spyOn(minHeap, "Heapify").and.callFake(function(index) {
            expect(index).toBe(0);
        });

        minHeap.HeapifyResetCurIndex();

        expect(minHeap._currentIndex).toBe(0);
    });

    it("should know if a node is in the heap", function () {
        var minHeap = New (MinHeapNodes, {capacity:5}), res;
        minHeap._collection[0] = itemOne;
        minHeap._collection[1] = itemTwo;
        minHeap._collection[2] = itemThree;
        minHeap._collection[3] = itemFour;

        res = minHeap.NodeInHeap(itemThree);

        expect(res).toBe(true);

        res = minHeap.NodeInHeap(itemFive);

        expect(res).toBe(false);
    });

    it("should know if the heap is empty", function () {
        var minHeap = New (MinHeapNodes, {capacity:5}), res;

        res = minHeap.Empty();

        expect(res).toBe(true);

        minHeap._collection[0] = itemOne;

        res = minHeap.Empty();

        expect(res).toBe(false);
    });
});
describe("Queue Tests", function () {
    beforeEach(module("DemoApp"));

    it("should instantiate properly", function () {
        var queue = New (Queue, {});

        expect(queue.queue).toBeDefined();
        expect(queue.queue.length).toBe(0);
        expect(queue.offset).toBeDefined();
        expect(queue.offset).toBe(0);
    });

    it("should return the length of the queue", function () {
        var queue = New (Queue, {}), res;
        queue.queue = [{}, {}];
        queue.offset = 1;

        res = queue.count();

        expect(res).toBe(1);
    });

    it("should know if the queue is empty", function () {
        var queue = New (Queue, {}), res;

        res = queue.isEmpty();

        expect(res).toBe(true);

        queue.queue = [{}];

        res = queue.isEmpty();

        expect(res).toBe(false);
    });

    it("should push an item into the queue when enqueue is called", function () {
        var queue = New (Queue, {}), res;

        queue.enqueue({id: 0});

        expect(queue.queue.length).toBe(1);
        expect(queue.queue).toContain({id:0});
    });

    it("should remove an item from the queue when dequeue is called", function () {
        var queue = New (Queue, {}), res, itemOne = {id: 0}, itemTwo = {id: 1};
        queue.queue = [itemOne, itemTwo];

        res = queue.dequeue();

        expect(queue.queue.length).toBe(1);
        expect(queue.queue[0]).toBe(itemTwo);
        expect(queue.offset).toBe(0);
        expect(res).toBe(itemOne);
    });

    it("should peek at the last element in the queue", function () {
        var queue = New (Queue, {}), res;
        queue.queue = [{id: 0},{id:1}];
        queue.offset = 1;

        res = queue.peek();

        expect(res).toBe(queue.queue[1]);

        queue.queue = [];

        res = queue.peek();

        expect(res).toBe(undefined);
    });
});
describe("Utils Tests", function () {
    var grid = [
        [{id:0}, {id:1}, {id:2}],
        [{id:3}, {id:4}, {id:5}],
        [{id:6}, {id:7}, {id:8}]
    ];
    beforeEach(module("DemoApp"));

    it("should determine if an object is null or undefined", function () {
        var objA = {field:0}, objB = null, objC = undefined,
            resA, resB, resC;

        resA = IsNotNullOrUndefined(objA);
        resB = IsNotNullOrUndefined(objB);
        resC = IsNotNullOrUndefined(objC);

        expect(resA).toEqual(true);
        expect(resB).toEqual(false);
        expect(resC).toEqual(false);
    });

    it("should determine if an object is greater than a minimum or NaN", function () {
        var min = 5, objA = 6, objB = NaN, objC = 4,
            resA, resB, resC;

        resA = IsGreaterThanOrNaN(objA, min);
        resB = IsGreaterThanOrNaN(objB, min);
        resC = IsGreaterThanOrNaN(objC, min);

        expect(resA).toEqual(true);
        expect(resB).toEqual(true);
        expect(resC).toEqual(false);
    });

    it("should return an array of neighboring nodes on a grid including diagonals", function () {
        var x = 1, y = 1, xLen = 3, yLen = 3, res;

        res = getNeighbors(x, y, xLen, yLen, grid, false);

        expect(res).toContain(grid[0][0]);
        expect(res).toContain(grid[0][1]);
        expect(res).toContain(grid[0][2]);
        expect(res).toContain(grid[1][0]);
        expect(res).not.toContain(grid[1][1]);
        expect(res).toContain(grid[1][2]);
        expect(res).toContain(grid[2][0]);
        expect(res).toContain(grid[2][1]);
        expect(res).toContain(grid[2][2]);
    });

    it("should return an array of neighboring nodes on a grid excluding diagonals", function () {
        var x = 1, y = 1, xLen = 3, yLen = 3, res;

        res = getNeighbors(x, y, xLen, yLen, grid, true);

        expect(res).not.toContain(grid[0][0]);
        expect(res).toContain(grid[0][1]);
        expect(res).not.toContain(grid[0][2]);
        expect(res).toContain(grid[1][0]);
        expect(res).not.toContain(grid[1][1]);
        expect(res).toContain(grid[1][2]);
        expect(res).not.toContain(grid[2][0]);
        expect(res).toContain(grid[2][1]);
        expect(res).not.toContain(grid[2][2]);
    });

    it("should fill the neighbors of each node in a given grid", function () {
        var cellGrid = [
                [New (Cell, {}), New (Cell, {}), New (Cell, {})],
                [New (Cell, {}), New (Cell, {}), New (Cell, {})],
                [New (Cell, {}), New (Cell, {}), New (Cell, {})]
            ],
            res;
        spyOn(cellGrid[0][0], "fillNeighbors");
        spyOn(cellGrid[0][1], "fillNeighbors");
        spyOn(cellGrid[0][2], "fillNeighbors");
        spyOn(cellGrid[1][0], "fillNeighbors");
        spyOn(cellGrid[1][1], "fillNeighbors");
        spyOn(cellGrid[1][2], "fillNeighbors");
        spyOn(cellGrid[2][0], "fillNeighbors");
        spyOn(cellGrid[2][1], "fillNeighbors");
        spyOn(cellGrid[2][2], "fillNeighbors");

        res = fillNeighbors(cellGrid, false);

        expect(cellGrid[0][0].fillNeighbors.calls.count()).toEqual(1);
        expect(cellGrid[0][1].fillNeighbors.calls.count()).toEqual(1);
        expect(cellGrid[0][2].fillNeighbors.calls.count()).toEqual(1);

        expect(cellGrid[1][0].fillNeighbors.calls.count()).toEqual(1);
        expect(cellGrid[1][1].fillNeighbors.calls.count()).toEqual(1);
        expect(cellGrid[1][2].fillNeighbors.calls.count()).toEqual(1);

        expect(cellGrid[2][0].fillNeighbors.calls.count()).toEqual(1);
        expect(cellGrid[2][1].fillNeighbors.calls.count()).toEqual(1);
        expect(cellGrid[2][2].fillNeighbors.calls.count()).toEqual(1);
    });
});
describe("Vector Tests", function () {
    var defVec = {x: 1, y: 1};
    beforeEach(module("DemoApp"));

    it("should instantiate properly", function () {
        var vecOne = New (Vector, {}),
            vecTwo = New (Vector, {x: 1}),
            vecThree = New (Vector, {y: 1}),
            vecFour = New (Vector, {x: 1, y: 1});

        expect(vecOne.x).toBe(0);
        expect(vecOne.y).toBe(0);

        expect(vecTwo.x).toBe(1);
        expect(vecTwo.y).toBe(0);

        expect(vecThree.x).toBe(0);
        expect(vecThree.y).toBe(1);

        expect(vecFour.x).toBe(1);
        expect(vecFour.y).toBe(1);
    });

    it("should calculate it's length", function () {
        var vec = New (Vector, defVec), res,
            expected = Math.sqrt(Math.pow(defVec.x, 2) + Math.pow(defVec.y, 2));

        res = vec.length();

        expect(res).toBe(expected);
    });

    it("should calculate it's normal", function () {
        var vec = New (Vector, defVec), scalar = 1, res, length = vec.length(),
            expected = New(Vector, {x: (this.x / length) * scalar, y: (this.y / length) * scalar});

        res = vec.normalize();

        expect(res.x).toEqual(expected.x);
        expect(res.y).toEqual(expected.y);
    });

    it("should add two vectors and return a new instance", function () {
        var vecOne = New (Vector, defVec),
            vecTwo = New (Vector, {x:-1, y:2}), res,
            expected = {x: vecOne.x + vecTwo.x, y: vecOne.y + vecTwo.y};

        res = vecOne.addNew(vecTwo);

        expect(res.x).toEqual(expected.x);
        expect(res.y).toEqual(expected.y);
    });

    it("should add two vectors and mutate the original", function () {
        var vecOne = New (Vector, defVec),
            vecTwo = New (Vector, {x:-1, y:2}),
            expected = {x: vecOne.x + vecTwo.x, y: vecOne.y + vecTwo.y};

        vecOne.add(vecTwo);

        expect(vecOne.x).toEqual(expected.x);
        expect(vecOne.y).toEqual(expected.y);
    });

    it("should subtract two vectors and return a new instance", function () {
        var vecOne = New (Vector, defVec),
            vecTwo = New (Vector, {x:-1, y:2}), res,
            expected = {x: vecOne.x - vecTwo.x, y: vecOne.y - vecTwo.y};

        res = vecOne.subNew(vecTwo);

        expect(res.x).toEqual(expected.x);
        expect(res.y).toEqual(expected.y);
    });

    it("should subtract two vectors and mutate the original", function () {
        var vecOne = New (Vector, defVec),
            vecTwo = New (Vector, {x:-1, y:2}),
            expected = {x: vecOne.x - vecTwo.x, y: vecOne.y - vecTwo.y};

        vecOne.sub(vecTwo);

        expect(vecOne.x).toEqual(expected.x);
        expect(vecOne.y).toEqual(expected.y);
    });

    it("should multiply a vector by a scalar and return a new instance", function () {
        var vec = New (Vector, {x: 2, y: -2}), res, scalar = 4,
            expected = {x: vec.x * scalar, y: vec.y * scalar};

        res = vec.mulNew(scalar);

        expect(res.x).toEqual(expected.x);
        expect(res.y).toEqual(expected.y);
    });

    it("should multiply a vector by a scalar and mutate the original", function () {
        var vec = New (Vector, {x: 2, y: -2}), scalar = 4,
            expected = {x: vec.x * scalar, y: vec.y * scalar};

        vec.mul(scalar);

        expect(vec.x).toEqual(expected.x);
        expect(vec.y).toEqual(expected.y);
    });

    it("should divide a vector by a scalar and return a new instance", function () {
        var vec = New (Vector, {x: 2, y: -2}), res, scalar = 4,
            expected = {x: vec.x / scalar, y: vec.y / scalar};

        res = vec.divNew(scalar);

        expect(res.x).toEqual(expected.x);
        expect(res.y).toEqual(expected.y);
    });

    it("should divide a vector by a scalar and mutate the original", function () {
        var vec = New (Vector, {x: 2, y: -2}), scalar = 4,
            expected = {x: vec.x / scalar, y: vec.y / scalar};

        vec.div(scalar);

        expect(vec.x).toEqual(expected.x);
        expect(vec.y).toEqual(expected.y);
    });

    it("should return itself as a JSON object when converted to a string", function () {
        var vec = New (Vector, {x: 2, y: -2}), res,
            expected = {x: vec.x, y: vec.y};

        res = vec.toString();

        expect(res.x).toEqual(expected.x);
        expect(res.y).toEqual(expected.y);
    });
});