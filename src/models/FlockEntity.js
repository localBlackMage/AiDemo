(function (ng) {
    'use strict';

    ng.module('aidemo.models.flockEntity', [
        'aidemo.service.utils',
        'aidemo.service.mathUtils',
        'aidemo.service.drawUtils',
        'aidemo.models.vector'
    ])
        .factory('FlockEntity', ['Utils', 'DrawUtils', 'MathUtils', 'Vector',
            function (Utils, DrawUtils, MathUtils, Vector) {
                /**
                 * Constructor, with class name
                 */
                function FlockEntity(params) {
                    this.pos = Utils.isNotNullOrUndefined(params.pos) ? params.pos : Vector.build();
                    this.vel = Utils.isNotNullOrUndefined(params.vel) ? params.vel : Vector.build();

                    this.radius = Utils.isNotNullOrUndefined(params.radius) ? params.radius : 0;
                    this.color = Utils.isNotNullOrUndefined(params.color) ? params.color : '#FFFFFF';
                    this.speed = Utils.isNotNullOrUndefined(params.speed) ? params.speed : 3;

                    this.cohW = Utils.isNotNullOrUndefined(params.cohW) ? params.cohW : 0.0;
                    this.sepW = Utils.isNotNullOrUndefined(params.sepW) ? params.sepW : 0.0;
                    this.aliW = Utils.isNotNullOrUndefined(params.aliW) ? params.aliW : 0.0;
                    this.avoW = Utils.isNotNullOrUndefined(params.avoW) ? params.avoW : 0.0;
                    this.wanW = Utils.isNotNullOrUndefined(params.wanW) ? params.wanW : 0.5;

                    this.type = Utils.isNotNullOrUndefined(params.type) ? params.type : this.PREY;
                }

                FlockEntity.build = function (data) {
                    return new FlockEntity(data);
                };

                FlockEntity.prototype.PREY = 'PREY';
                FlockEntity.prototype.PREDATOR = 'PREDATOR';
                FlockEntity.prototype.EXC_COLOR = '#FFFF00';

                FlockEntity.prototype.cohesion = function (herd) {
                    var target = Vector.build();
                    herd.forEach(function (other) {
                        target.add(other.pos);
                    });

                    if (target.length() !== 0) {
                        return target.divNew(herd.length).subNew(this.pos).normalize(1);
                    }
                    else {
                        return target;
                    }
                };

                FlockEntity.prototype.separation = function (herd) {
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
                };

                FlockEntity.prototype.alignment = function (herd) {
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
                };

                FlockEntity.prototype.wander = function () {
                    var angle = this.vel.vectorToAngle() + MathUtils.getRand(-0.5, 0.5);
                    return Vector.angleToVector(angle).normalize(1);
                };

                FlockEntity.prototype.avoidWalls = function (box) {
                    var target = Vector.build();
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
                };

                FlockEntity.prototype.avoidPredators = function (pred) {
                    var target = Vector.build();
                    pred.forEach(function (other) {
                        target.add(other.pos);
                    });
                    if (target.length() !== 0) {
                        return target.divNew(pred.length).subNew(this.pos).normalize(1).mulNew(-1);
                    }
                    else {
                        return target;
                    }
                };

                FlockEntity.prototype.updatePrey = function (options) {
                    var coh = Vector.build(), sep = Vector.build(),
                        ali = Vector.build(), wan = Vector.build(),
                        wal = Vector.build(), avo = Vector.build();
                    avo = this.avoidPredators(options.pred).mulNew(this.avoW);
                    if (avo.length() > 0) {
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
                };

                FlockEntity.prototype.updatePredator = function (options) {
                    var coh = Vector.build(), sep = Vector.build(),
                        ali = Vector.build(), wan = Vector.build(),
                        wal = Vector.build();

                    coh = this.cohesion(options.herd).mulNew(this.cohW);
                    sep = this.separation(options.pred).mulNew(this.sepW);
                    ali = this.alignment(options.pred).mulNew(this.aliW);
                    wan = this.wander().mulNew(this.wanW);
                    wal = this.avoidWalls(options.box).mulNew(0.5);

                    var total = coh.addNew(sep).addNew(ali).addNew(wan).addNew(wal);
                    this.vel.add(total);
                };

                FlockEntity.prototype.updateVelocity = function (options) {
                    if (this.type === this.PREY) {
                        this.updatePrey(options);
                    }
                    else {
                        this.updatePredator(options);
                    }
                    return this.vel.normalize(1).mulNew(this.speed);
                };

                FlockEntity.prototype.avoidWall = function (box) {
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
                };

                FlockEntity.prototype.keepInBounds = function (box) {
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
                };

                FlockEntity.prototype.update = function (options) {
                    this.vel = this.updateVelocity(options);
                    this.pos = this.vel.addNew(this.pos);
                    this.avoidWall(options.box);
                    this.keepInBounds(options.box);
                };

                FlockEntity.prototype.calcNose = function () {
                    this.nose = this.pos.addNew(this.vel);
                    this.nose = this.vel.normalize(1);
                    this.nose = this.nose.mulNew(10);
                    this.nose = this.nose.addNew(this.pos);
                };

                FlockEntity.prototype.render = function (ctx) {
                    this.calcNose();
                    if (this.exc) {
                        DrawUtils.drawExclamation(ctx, this.pos.x, this.pos.y - 10, this.EXC_COLOR);
                    }
                    DrawUtils.drawCircle(ctx, this.pos.x, this.pos.y, this.radius, this.color);
                    DrawUtils.drawLine(ctx, this.pos.x, this.pos.y, this.nose.x, this.nose.y, this.color);
                };

                return FlockEntity;
            }
        ]);
})(angular);