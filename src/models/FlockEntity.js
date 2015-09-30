var PREY = "prey", PREDATOR = "pred", EXC_COLOR = "#FF0";
var Entity = {
    pos: null,
    radius: 0, color: "",
    vel: null,
    nose: New(Vector, {}),
    speed: 0,
    cohW: 0, sepW: 0, aliW: 0, avoW: 0, wanW: 0,
    type: "",
    exc: false,
    options: {
        pos: New(Vector, {}),
        radius: 5, color: "#FFF",
        vel: New(Vector, {}),
        speed: 3,
        cohW: 0.0, sepW: 0.0, aliW: 0.0, avoW: 0.0, wanW: 0.5,
        type: PREY
    },

    constructor: function (options) {
        this.pos = IsNotNullOrUndefined(options.pos) ? options.pos : this.options.pos;
        this.vel = IsNotNullOrUndefined(options.vel) ? options.vel : this.options.vel;

        this.radius = IsNotNullOrUndefined(options.radius) ? options.radius : this.options.radius;
        this.color = IsNotNullOrUndefined(options.color) ? options.color : this.options.color;
        this.speed = IsNotNullOrUndefined(options.speed) ? options.speed : this.options.speed;

        this.cohW = IsNotNullOrUndefined(options.cohW) ? options.cohW : this.options.cohW;
        this.sepW = IsNotNullOrUndefined(options.sepW) ? options.sepW : this.options.sepW;
        this.aliW = IsNotNullOrUndefined(options.aliW) ? options.aliW : this.options.aliW;
        this.avoW = IsNotNullOrUndefined(options.avoW) ? options.avoW : this.options.avoW;
        this.wanW = IsNotNullOrUndefined(options.wanW) ? options.wanW : this.options.wanW;

        this.type = IsNotNullOrUndefined(options.type) ? options.type : this.options.type;
        return this;
    },

    cohesion: function (herd) {
        var target = New(Vector, {});
        herd.forEach(function (other) {
            target.add(other.pos);
        });

        if (target.length() !== 0) {
            return target.divNew(herd.length).subNew(this.pos).normalize(1);
        }
        else {
            return target;
        }
    },

    separation: function (herd) {
        var target = New(Vector, {});
        herd.forEach(function (other) {
            target.add(other.pos);
        });

        if (target.length() !== 0) {
            return target.divNew(herd.length).subNew(this.pos).normalize(1).mulNew(-1);
        }
        else {
            return target;
        }
    },

    alignment: function (herd) {
        var target = New(Vector, {});
        herd.forEach(function (other) {
            target.add(other.vel);
        });

        if (target.length() !== 0) {
            return target.divNew(herd.length).normalize(1);
        }
        else {
            return target;
        }
    },

    wander: function () {
        var angle = MathUtils.vectorToAngle(this.vel) + MathUtils.getRand(-0.5,0.5);
        return MathUtils.angleToVector(angle).normalize(1);
    },

    avoidWalls: function(box) {
        var target = New(Vector, {});
        if (this.pos.x < 50) {
            target.x = 1;
        }
        else if (this.pos.x > box.width - 50) {
            target.x = -1;
        }

        if (this.pos.y < 50) {
            target.y = 1;
        }
        else if (this.pos.y > box.height - 50) {
            target.y = -1;
        }
        return target;
    },

    avoidPredators: function(pred) {
        var target = New(Vector, {});
        pred.forEach(function (other) {
            target.add(other.pos);
        });
        if (target.length() !== 0) {
            return target.divNew(pred.length).subNew(this.pos).normalize(1).mulNew(-1);
        }
        else {
            return target;
        }
    },

    updatePrey: function(options) {
        var coh = New(Vector, {}), sep = New(Vector, {}),
            ali = New(Vector, {}), avo = New(Vector, {}),
            wan = New(Vector, {}), wal = New(Vector, {});
        avo = this.avoidPredators(options.pred).mulNew(this.avoW);
        if (avo.length() > 0){
            this.exc = true;
            this.vel.add(avo);
        }
        else {
            this.exc = false;
            coh = this.cohesion(options.herd).mulNew(this.cohW);
            sep = this.separation(options.herd).mulNew(this.sepW);
            ali = this.alignment(options.herd).mulNew(this.aliW);
            wan = this.wander().mulNew(this.wanW);
            wal = this.avoidWalls(options.box).mulNew(0.5);

            var total = coh.addNew(sep).addNew(ali).addNew(wan).addNew(wal);
            this.vel.add(total);
        }
    },

    updatePredator: function(options) {
        var coh = New(Vector, {}), sep = New(Vector, {}),
            ali = New(Vector, {}), wan = New(Vector, {}),
            wal = New(Vector, {});

        coh = this.cohesion(options.herd).mulNew(this.cohW);
        sep = this.separation(options.pred).mulNew(this.sepW);
        ali = this.alignment(options.pred).mulNew(this.aliW);
        wan = this.wander().mulNew(this.wanW);
        wal = this.avoidWalls(options.box).mulNew(0.5);

        var total = coh.addNew(sep).addNew(ali).addNew(wan).addNew(wal);
        this.vel.add(total);
    },

    updateVelocity: function (options) {
        if (this.type === PREY) {
            this.updatePrey(options);
        }
        else {
            this.updatePredator(options);
        }
        return this.vel.normalize(1).mulNew(this.speed);
    },

    avoidWall: function (box) {
        if (this.pos.x < 0) {
            this.vel.x *= -1;
        }
        else if (this.pos.x > box.width) {
            this.vel.x *= -1;
        }

        if (this.pos.y < 0) {
            this.vel.y *= -1;
        }
        else if (this.pos.y > box.height) {
            this.vel.y *= -1;
        }
    },

    keepInBounds: function (box) {
        if (this.pos.x < 0) {
            this.pos.x = 0;
        }
        else if (this.pos.x > box.width) {
            this.pos.x = box.width;
        }

        if (this.pos.y < 0) {
            this.pos.y = 0;
        }
        else if (this.pos.y > box.height) {
            this.pos.y = box.height;
        }
    },

    update: function (options) {
        this.vel = this.updateVelocity(options);
        this.pos = this.vel.addNew(this.pos);
        this.avoidWall(options.box);
        this.keepInBounds(options.box);
    },

    calcNose: function () {
        this.nose = this.pos.addNew(this.vel);
        this.nose = this.vel.normalize(1);
        this.nose = this.nose.mulNew(10);
        this.nose = this.nose.addNew(this.pos);
    },

    render: function (ctx) {
        this.calcNose();
        if (this.exc) {
            DrawUtils.drawExclamation(ctx, this.pos.x, this.pos.y - 10, EXC_COLOR);
        }
        DrawUtils.drawCircle(ctx, this.pos.x, this.pos.y, this.radius, this.color);
        DrawUtils.drawLine(ctx, this.pos.x, this.pos.y, this.nose.x, this.nose.y, this.color);
    }
};