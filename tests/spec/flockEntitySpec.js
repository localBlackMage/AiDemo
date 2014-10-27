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