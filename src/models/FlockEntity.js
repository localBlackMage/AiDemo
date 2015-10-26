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
                    params = params ? params : {};
                    this.position = params.position ? params.position : new Vector();
                    this.velocity = params.velocity ? params.velocity : new Vector();

                    this.radius = _.isNumber(params.radius) ? params.radius : 5;
                    this.color = _.isString(params.color) ? params.color : '#FFFFFF';
                    this.speed = _.isNumber(params.speed) ? params.speed : 3;

                    this.cohesionWeight = _.isNumber(params.cohesionWeight) ? params.cohesionWeight : 0.0;
                    this.separateWeight = _.isNumber(params.separateWeight) ? params.separateWeight : 0.0;
                    this.alignWeight = _.isNumber(params.alignWeight) ? params.alignWeight : 0.0;
                    this.avoidWeight = _.isNumber(params.avoidWeight) ? params.avoidWeight : 0.0;
                    this.wanderWeight = _.isNumber(params.wanderWeight) ? params.wanderWeight : 0.5;

                    this.type = _.isString(params.type) ? params.type : FlockEntity.PREY;
                    this.renderExclamation = false;
                }

                FlockEntity.build = function (data) {
                    return new FlockEntity(data);
                };

                FlockEntity.PREY = 'Prey';
                FlockEntity.PREDATOR = 'Predator';
                FlockEntity.EXCLAMATION_COLOR = '#FFFF00';

                FlockEntity.prototype.updateStats = function (params) {
                    params = params ? params : {};
                    this.position = params.position || this.position;
                    this.velocity = params.velocity || this.velocity;

                    this.radius = _.isNumber(params.radius) ? params.radius : this.radius;
                    this.color = _.isString(params.color) ? params.color : this.color;
                    this.speed = _.isNumber(params.speed) ? params.speed : this.speed;

                    this.cohesionWeight = _.isNumber(params.cohesionWeight) ? params.cohesionWeight : this.cohesionWeight;
                    this.separateWeight = _.isNumber(params.separateWeight) ? params.separateWeight : this.separateWeight;
                    this.alignWeight = _.isNumber(params.alignWeight) ? params.alignWeight : this.alignWeight;
                    this.avoidWeight = _.isNumber(params.avoidWeight) ? params.avoidWeight : this.avoidWeight;
                    this.wanderWeight = _.isNumber(params.wanderWeight) ? params.wanderWeight : this.wanderWeight;

                    this.type = _.isString(params.type) ? params.type : this.type;
                };

                FlockEntity.prototype._calculateCohesionForceForTarget = function (target, others) {
                    return target.position;
                };

                FlockEntity.prototype.calculateCohesion = function (objects) {
                    if (objects.length) {
                        return new Vector();
                    }

                    var self = this,
                        cohesionVector = new Vector();

                    objects.forEach(function (other) {
                        cohesionVector.add(self._calculateCohesionForceForTarget(other, objects));
                    });

                    return cohesionVector.divNew(objects.length).subNew(this.position).normalize();
                };

                FlockEntity.prototype._calculateSeparationForceForTarget = function (target, others) {
                    var desiredVelocity = target.position.subNew(this.position)
                    var steeringForce = desiredVelocity.subNew(this.velocity);
                    return steeringForce.divNew(others.length).mulNew(-1);
                };

                FlockEntity.prototype.calculateSeparation = function (objects) {
                    var self = this,
                        separationVector = new Vector();

                    objects.forEach(function (other) {
                        separationVector.add(self._calculateSeparationForceForTarget(other, objects));
                    });

                    return separationVector.normalize();
                };

                FlockEntity.prototype._calculateAlignmentForceForTarget = function (target, others) {
                    var desiredVelocity = target.velocity.subNew(this.velocity).normalize();
                    return desiredVelocity.divNew(others.length);
                };

                FlockEntity.prototype.calculateAlignment = function (objects) {
                    if (objects.length) {
                        return new Vector();
                    }

                    var self = this,
                        alignmentVector = new Vector();

                    objects.forEach(function (other) {
                        alignmentVector.add(self._calculateAlignmentForceForTarget(other, objects));
                    });

                    return alignmentVector.normalize();
                };

                FlockEntity.prototype.calculateWander = function () {
                    var angle = this.velocity.vectorToAngleRadians() + MathUtils.getRandomNumber(-2.0, 2.0);
                    return Vector.angleToVector(angle).normalize();
                };

                FlockEntity.prototype.avoidWalls = function (box) {
                    var target = new Vector();
                    if (this.position.x < 50) {
                        target.x = 1;
                    }
                    else if (this.position.x > box.width - 50) {
                        target.x = -1;
                    }

                    if (this.position.y < 50) {
                        target.y = 1;
                    }
                    else if (this.position.y > box.height - 50) {
                        target.y = -1;
                    }
                    return target;
                };

                FlockEntity.prototype.avoidPredators = function (predators) {
                    var target = new Vector();
                    predators.forEach(function (other) {
                        target.add(other.position);
                    });
                    if (target.length() !== 0) {
                        return target.divNew(predators.length).subNew(this.position).normalize(1).mulNew(-1);
                    }
                    else {
                        return target;
                    }
                };

                /**
                 * Prey will try to group with other prey, stay away from other prey, align with
                 * other prey, calculateWander randomly to the left or right, and avoid walls
                 * @param options - Object with prey, predators, and box properties
                 */
                FlockEntity.prototype.updateAsPrey = function (options) {
                    var avoidPredators = this.avoidPredators(options.predators).mulNew(this.avoidWeight);

                    if (avoidPredators.length() > 0) {
                        this.renderExclamation = true;
                        this.velocity.add(avoidPredators);
                    }
                    else {
                        this.renderExclamation = false;
                        var neighbors = MathUtils.getNearestObjects(options.prey, this, 300.0);

                        var cohesion = this.calculateCohesion(neighbors).mulNew(this.cohesionWeight),
                            separate = this.calculateSeparation(neighbors).mulNew(this.separateWeight),
                            align = this.calculateAlignment(neighbors).mulNew(this.alignWeight),
                            wander = this.calculateWander().mulNew(this.wanderWeight),
                            avoidWalls = this.avoidWalls(options.box).mulNew(0.5);

                        var total = cohesion
                            .addNew(separate)
                            .addNew(align)
                            .addNew(wander)
                            .addNew(avoidWalls);
                        this.velocity.add(total);
                    }
                };

                /**
                 * Predators will try to group with the prey, stay away from other predators, align with
                 * other predators, align themselves with other predator's wandering path, and avoid walls
                 * @param options - Object with prey, predators, and box properties
                 */
                FlockEntity.prototype.updateAsPredator = function (options) {
                    var cohesion = this.calculateCohesion(options.prey).mulNew(this.cohesionWeight),
                        separate = this.calculateSeparation(options.predators).mulNew(this.separateWeight),
                        align = this.calculateAlignment(options.predators).mulNew(this.alignWeight),
                        wander = this.calculateAlignment(options.predators).mulNew(this.wanderWeight),
                        avoidWalls = this.avoidWalls(options.box).mulNew(0.5);

                    var total = cohesion
                        .addNew(separate)
                        .addNew(align)
                        .addNew(wander)
                        .addNew(avoidWalls);
                    this.velocity.add(total);
                };

                /**
                 * Calls the appropriate update function depending on this FlockEntity's type field,
                 * normalizes the velocity, multiplies it by this entity's spead field and returns it
                 * @param options - Object with prey, predators, and box properties
                 * @returns {Vector} - The entity's new velocity
                 */
                FlockEntity.prototype.updateVelocity = function (options) {
                    this['updateAs' + this.type](options);
                    return this.velocity.normalize(1).mulNew(this.speed);
                };

                FlockEntity.prototype._bounceOffWalls = function (box) {
                    if (this.position.x < this.radius) {
                        this.velocity.x *= -1;
                    }
                    else if (this.position.x > box.width - this.radius) {
                        this.velocity.x *= -1;
                    }

                    if (this.position.y < this.radius) {
                        this.velocity.y *= -1;
                    }
                    else if (this.position.y > box.height - this.radius) {
                        this.velocity.y *= -1;
                    }
                };

                FlockEntity.prototype._keepInBounds = function (box) {
                    if (this.position.x < this.radius) {
                        this.position.x = this.radius;
                    }
                    else if (this.position.x > box.width - this.radius) {
                        this.position.x = box.width - this.radius;
                    }

                    if (this.position.y < this.radius) {
                        this.position.y = this.radius;
                    }
                    else if (this.position.y > box.height - this.radius) {
                        this.position.y = box.height - this.radius;
                    }
                };

                FlockEntity.prototype.update = function (options) {
                    this.velocity = this.updateVelocity(options);
                    this.position = this.velocity.addNew(this.position);
                    this._bounceOffWalls(options.box);
                    this._keepInBounds(options.box);
                };

                FlockEntity.prototype.calcNose = function () {
                    this.nose = this.position.addNew(this.velocity);
                    this.nose = this.velocity.normalize(1);
                    this.nose = this.nose.mulNew(10);
                    this.nose = this.nose.addNew(this.position);
                };

                FlockEntity.prototype.render = function (ctx) {
                    this.calcNose();
                    if (this.renderExclamation) {
                        DrawUtils.drawExclamation(ctx, this.position.x, this.position.y - 10, FlockEntity.EXCLAMATION_COLOR);
                    }
                    DrawUtils.drawCircle(ctx, this.position.x, this.position.y, this.radius, this.color);
                    DrawUtils.drawLine(ctx, this.position.x, this.position.y, this.nose.x, this.nose.y, this.color);
                };

                return FlockEntity;
            }
        ]);
})(angular);