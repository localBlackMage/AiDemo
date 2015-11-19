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

                function FlockEntity(params) {
                    params = params || {};

                    // Basic statistics for this entity
                    this.position = params.position || new Vector();
                    this.velocity = params.velocity || new Vector();
                    this.speed = _.isNumber(params.speed) ? params.speed : 3;

                    // Characteristics about this entity
                    this.radius = _.isNumber(params.radius) ? params.radius : 5;
                    this.type = _.isString(params.type) ? params.type : FlockEntity.PREY;
                    this.color = this.type === FlockEntity.PREY ? DrawUtils.getRandomGreen('D') : DrawUtils.getRandomRed('D');
                    this.renderExclamation = false;

                    // This entity's weight factors
                    this.cohesionWeight = _.isNumber(params.cohesionWeight) ? params.cohesionWeight : 0.0;
                    this.separateWeight = _.isNumber(params.separateWeight) ? params.separateWeight : 0.0;
                    this.alignWeight = _.isNumber(params.alignWeight) ? params.alignWeight : 0.0;
                    this.avoidWeight = _.isNumber(params.avoidWeight) ? params.avoidWeight : 0.0;
                }

                FlockEntity.PREY = 'Prey';
                FlockEntity.PREDATOR = 'Predator';
                FlockEntity.EXCLAMATION_COLOR = '#FFFF00';

                FlockEntity.prototype.updateStats = function (params) {
                    params = params || {};

                    // Basic statistics for this entity
                    this.position = params.position || this.position;
                    this.velocity = params.velocity || this.velocity;
                    this.speed = _.isNumber(params.speed) ? params.speed : this.speed;

                    // Characteristics about this entity
                    this.radius = _.isNumber(params.radius) ? params.radius : this.radius;
                    this.type = _.isString(params.type) ? params.type : this.type;
                    this.color = this.type === FlockEntity.PREY ? DrawUtils.getRandomGreen('D') : DrawUtils.getRandomRed('D');

                    // This entity's weight factors
                    this.cohesionWeight = _.isNumber(params.cohesionWeight) ? params.cohesionWeight : this.cohesionWeight;
                    this.separateWeight = _.isNumber(params.separateWeight) ? params.separateWeight : this.separateWeight;
                    this.alignWeight = _.isNumber(params.alignWeight) ? params.alignWeight : this.alignWeight;
                    this.avoidWeight = _.isNumber(params.avoidWeight) ? params.avoidWeight : this.avoidWeight;
                };

                FlockEntity.prototype.calculateCohesion = function (objects) {
                    if (objects.length === 0) {
                        return new Vector();
                    }

                    var cohesionVector = new Vector();

                    objects.forEach(function (other) {
                        cohesionVector.add(other.position);
                    });

                    return cohesionVector
                        .divNew(objects.length)
                        .subNew(this.position)
                        .normalize();
                };

                FlockEntity.prototype._calculateSeparationForceForTarget = function (target) {
                    return this.position
                        .subNew(target.position)
                        .normalize();
                };

                FlockEntity.prototype.calculateSeparation = function (objects) {
                    var self = this,
                        separationVector = new Vector();

                    objects.forEach(function (other) {
                        separationVector.add(self._calculateSeparationForceForTarget(other));
                    });

                    return separationVector.normalize();
                };

                FlockEntity.prototype.calculateAlignment = function (objects) {
                    var alignmentVector = new Vector();

                    objects.forEach(function (other) {
                        alignmentVector.add(other.velocity);
                    });

                    return alignmentVector.normalize();
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

                /**
                 * Prey will try to group with other prey, stay away from other prey, align with
                 * other prey, and avoid walls IF there are NO predators nearby
                 * @param options - Object containing predators and prey arrays, as well as a box object
                 * @returns Vector - updated velocity of this entity
                 */
                FlockEntity.prototype.updateAsPrey = function (options) {
                    var predators = MathUtils.getNearestObjects(options.predators, this, 80.0);
                    if (predators.length !== 0) {
                        this.renderExclamation = true;
                        var avoidPredators = this.calculateSeparation(predators).mulNew(this.avoidWeight);
                        return this.velocity.addNew(avoidPredators);
                    }
                    else {
                        this.renderExclamation = false;
                        var neighbors = MathUtils.getNearestObjects(options.prey, this, 80.0);

                        var cohesion = this.calculateCohesion(neighbors).mulNew(this.cohesionWeight),
                            separate = this.calculateSeparation(neighbors).mulNew(this.separateWeight),
                            align = this.calculateAlignment(neighbors).mulNew(this.alignWeight),
                            avoidWalls = this.avoidWalls(options.box).mulNew(0.1);

                        var total = cohesion
                            .addNew(separate)
                            .addNew(align)
                            .addNew(avoidWalls);
                        return this.velocity.addNew(total);
                    }
                };

                /**
                 * Predators will try to group with the prey, stay away from other predators, align with
                 * other predators, and avoid walls
                 * @param options - Object with prey, predators, and box properties
                 * @returns Vector - updated velocity of this entity
                 */
                FlockEntity.prototype.updateAsPredator = function (options) {
                    var preyCloseEnough = MathUtils.getNearestObjects(options.prey, this, 80.0),
                        predatorsCloseEnough = MathUtils.getNearestObjects(options.predators, this, 80.0);

                    var cohesion = this.calculateCohesion(preyCloseEnough).mulNew(this.cohesionWeight),
                        separate = this.calculateSeparation(predatorsCloseEnough).mulNew(this.separateWeight),
                        align = this.calculateAlignment(predatorsCloseEnough).mulNew(this.alignWeight),
                        avoidWalls = this.avoidWalls(options.box).mulNew(0.1);

                    var total = cohesion
                        .addNew(separate)
                        .addNew(align)
                        .addNew(avoidWalls);
                    return this.velocity.addNew(total);
                };

                /**
                 * Calls the appropriate update function depending on this FlockEntity's type field,
                 * normalizes the velocity, multiplies it by this entity's spead field and returns it
                 * @param options - Object with prey, predators, and box properties
                 * @returns {Vector} - The entity's new velocity
                 */
                FlockEntity.prototype.updateVelocity = function (options) {
                    var velocity = this['updateAs' + this.type](options);
                    return velocity.normalize().mulNew(this.speed);
                };

                FlockEntity.prototype._bounceOffWalls = function (box) {
                    if ((this.position.x < this.radius) || (this.position.x > box.width - this.radius)) {
                        this.velocity.x *= -1;
                    }

                    if ((this.position.y < this.radius) || (this.position.y > box.height - this.radius)) {
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
                    this.nose = this.velocity.normalize();
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