(function (ng) {
    'use strict';

    ng.module('aidemo.models.ants.ant', [
        'aidemo.service.utils',
        'aidemo.service.mathUtils',
        'aidemo.service.drawUtils',
        'aidemo.models.flockEntity',
        'aidemo.models.vector',
        'aidemo.models.ants.pheromone'

    ])
        .factory('Ant', ['Utils', 'DrawUtils', 'MathUtils', 'FlockEntity', 'Vector', 'Pheromone',
            function (Utils, DrawUtils, MathUtils, FlockEntity, Vector, Pheromone) {
                function Ant(params) {
                    params = params || {};
                    FlockEntity.call(this, params);

                    this.previousPosition = this.position;
                    this.pheromoneWeight = _.isNumber(params.pheromoneWeight) ? params.pheromoneWeight : 0.0;
                    this.color = "#000000";//"#FF9D00";
                    this.hasFood = false;
                    this.steps = 0;
                    this.stepsToNextPheromone = 40.0;
                    this.id = _.isNumber(params.id) ? params.id : 0;
                }

                Ant.prototype = Object.create(FlockEntity.prototype);

                Ant.prototype.constructor = Ant;

                Ant.prototype.attemptToSpawnPheromone = function () {
                    if (this.steps >= this.stepsToNextPheromone) {
                        this.steps = 0;
                        return new Pheromone({
                            position: new Vector(this.position),
                            id: this.id,
                            hasFood: this.hasFood
                        });
                    }
                    else {
                        return null;
                    }
                };

                Ant.prototype._getPheromoneWeight = function (pheromone) {
                    if (this.hasFood && pheromone.hasFood) {
                        return 0;
                    }
                    else if (this.hasFood && !pheromone.hasFood) {
                        return pheromone.id === this.id ? 1.0 : 0.2;
                    }
                    else {
                        return pheromone.hasFood ? 0.2 : 0;
                    }
                };

                Ant.prototype._calculatePheromoneForceForTarget = function (target) {
                    var distance = target.position
                        .subNew(this.position)
                        .normalize();

                    //var weightedPheromoneDistance = distance.mulNew(target.getAgeWeight());
                    var weightedPheromoneDistance = distance.mulNew(this._getPheromoneWeight(target));

                    //return weightedPheromoneDistance.mulNew(this._getPheromoneWeight(target));
                    return weightedPheromoneDistance.mulNew(target.getAgeWeight());
                };

                Ant.prototype.calculatePheromones = function (pheromones) {
                    if (pheromones.length === 0) {
                        return new Vector();
                    }

                    var self = this,
                        pheromoneVector = new Vector();

                    pheromones.forEach(function (pheromone) {
                        pheromoneVector.add(self._calculatePheromoneForceForTarget(pheromone));
                    });

                    return pheromoneVector.normalize();
                };

                Ant.prototype._getFoodWeight = function () {
                    return this.hasFood ? 0 : 1.0;
                };

                Ant.prototype._getNestWeight = function () {
                    return this.hasFood ? 1.0 : 0;
                };

                Ant.prototype.updateVelocity = function (params) {
                    var peers = MathUtils.getNearestObjects(params.ants, this, 100.0),
                        food = MathUtils.getNearestObjects(params.food, this, 100.0),
                        pheromones = MathUtils.getNearestObjects(params.pheromones, this, 100.0),
                        nest = MathUtils.getNearestObjects([params.nest], this, 100.0);

                    var cohesionAnts = this.calculateCohesion(peers).mulNew(this.cohesionWeight),
                        cohesionFood = this.calculateCohesion(food).mulNew(this._getFoodWeight()),
                        cohesionPheromones = this.calculatePheromones(pheromones).mulNew(this.pheromoneWeight),
                        cohesionNest = this.calculateCohesion(nest).mulNew(this._getNestWeight()),
                        separate = this.calculateSeparation(peers).mulNew(this.separateWeight),
                        align = this.calculateAlignment(peers).mulNew(this.alignWeight),
                        avoidWalls = this.avoidWalls(params.box).mulNew(0.1);

                    return cohesionAnts
                        .addNew(cohesionFood)
                        .addNew(cohesionPheromones)
                        .addNew(cohesionNest)
                        .addNew(separate)
                        .addNew(align)
                        .addNew(avoidWalls)
                        .addNew(this.velocity)
                        .normalize()
                        .mulNew(this.speed);
                };

                Ant.prototype._updateStepsAndGetNewPosition = function(velocity) {
                    var updatedPosition = velocity.addNew(this.position);

                    this.steps += updatedPosition.subNew(this.previousPosition).length();

                    this.previousPosition = updatedPosition;

                    return updatedPosition;
                };

                Ant.prototype.update = function (params) {
                    this.velocity = this.updateVelocity(params);
                    this.position = this._updateStepsAndGetNewPosition(this.velocity);
                    this._bounceOffWalls(params.box);
                    this._keepInBounds(params.box);
                };

                Ant.prototype._calcHead = function () {
                    var head = this.velocity.normalize().mulNew(4);
                    return head.addNew(this.position);
                };

                Ant.prototype._calcRear = function () {
                    var rear = this.velocity.normalize().mulNew(-4);
                    return rear.addNew(this.position);
                };

                Ant.prototype.render = function (ctx) {
                    var head = this._calcHead(),
                        rear = this._calcRear();
                    DrawUtils.drawCircle(ctx, this.position.x, this.position.y, 2.0, this.color);
                    DrawUtils.drawCircle(ctx, head.x, head.y, 2.0, this.color);
                    DrawUtils.drawCircle(ctx, rear.x, rear.y, 2.0, this.color);
                };

                return Ant;
            }
        ]);
})(angular);