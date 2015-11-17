(function (ng) {
    'use strict';

    ng.module('aidemo.models.ant', [
        'aidemo.service.utils',
        'aidemo.service.mathUtils',
        'aidemo.service.drawUtils',
        'aidemo.models.flockEntity',
        'aidemo.models.vector'
    ])
        .factory('Pheromone', ['Utils', 'DrawUtils', 'MathUtils', 'Vector',
            function (Utils, DrawUtils, MathUtils, Vector) {

                function Pheromone(params) {
                    params = params || {};
                    this.position = params.position || new Vector();
                    this.timeToLive = 20.0;
                    this.currentTime = 0;
                    this.id = _.isNumber(params.id) ? params.id : 0;
                    this.hasFood = params.hasFood;
                    this.color = this.hasFood ? "#FF00FF" : "#FFFFFF";
                }

                Pheromone.prototype.update = function (deltaTime) {
                    this.currentTime += deltaTime;
                    return this.currentTime >= this.timeToLive;
                };

                //Pheromone.prototype.getRadius = function () {
                //    var currentSizePercentage = -(this.currentTime - this.timeToLive) / this.timeToLive;
                //    return Math.max(2.0, parseFloat((currentSizePercentage * 3.0).toFixed(1)));
                //};

                Pheromone.prototype.render = function (ctx) {
                    DrawUtils.drawCircle(ctx, this.position.x, this.position.y, 2.0, this.color);
                };

                return Pheromone;
            }
        ])
        .factory('Ant', ['Utils', 'DrawUtils', 'MathUtils', 'FlockEntity', 'Vector', 'Pheromone',
            function (Utils, DrawUtils, MathUtils, FlockEntity, Vector, Pheromone) {
                function Ant(params) {
                    params = params || {};
                    FlockEntity.call(this, params);

                    this.pheromoneWeight = _.isNumber(params.pheromoneWeight) ? params.pheromoneWeight : 0.0;
                    this.color = "#FF9D00";
                    this.hasFood = false;
                    this.timeToNextPheromone = 2.0;
                    this.currentTime = 0.0;
                    this.id = _.isNumber(params.id) ? params.id : 0;
                }

                Ant.prototype = Object.create(FlockEntity.prototype);

                Ant.prototype.constructor = Ant;

                Ant.prototype.attemptToSpawnPheromone = function (deltaTime) {
                    this.currentTime += deltaTime;
                    if (this.currentTime >= this.timeToNextPheromone) {
                        this.currentTime = 0;
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
                    if (this.hasFood) {
                        return pheromone.hasFood ? 0 : 0.2;
                    }
                    else {
                        return pheromone.hasFood ? 0.2 : 0;
                    }
                };

                Ant.prototype._calculatePheromoneForceForTarget = function (target) {
                    return target.position
                        .subNew(this.position)
                        //.normalize()
                        .mulNew(this._getPheromoneWeight(target));
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
                    var peers = MathUtils.getNearestObjects(params.ants, this, 50.0),
                        food = MathUtils.getNearestObjects(params.food, this, 50.0),
                        pheromones = MathUtils.getNearestObjects(params.pheromones, this, 50.0),
                        nest = MathUtils.getNearestObjects([params.nest], this, 50.0);

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

                Ant.prototype.update = function (params) {
                    this.velocity = this.updateVelocity(params);
                    this.position = this.velocity.addNew(this.position);
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
        ])
        .factory('Nest', ['Utils', 'DrawUtils', 'MathUtils', 'Vector', 'Ant',
            function (Utils, DrawUtils, MathUtils, Vector, Ant) {

                function Nest(params) {
                    params = params || {};

                    // Render info and location
                    this.position = params.position || new Vector();
                    this.radius = 10;
                    this.colorInner = DrawUtils.getRandomBlue('A');
                    this.colorOuter = DrawUtils.getRandomRed('A');

                    // Determines if new Ants can be spawned
                    this.foodStore = _.isNumber(params.foodStore) ? params.foodStore : 5;

                    // Stats for making new Ants
                    this.weights = params.weights || {};

                    this.id = 0;
                }

                Nest.prototype.attemptToSpawnAnt = function () {
                    if (this.foodStore === 0) {
                        return null;
                    }
                    else {
                        this.foodStore--;
                        return new Ant({
                            position: new Vector(this.position),
                            velocity: new Vector({
                                x: MathUtils.getRandomNumber(-1, 1),
                                y: MathUtils.getRandomNumber(-1, 1)
                            }),
                            speed: 0.5,
                            cohesionWeight: this.weights.cohesionWeight,
                            avoidWeight: this.weights.avoidWeight,
                            separateWeight: this.weights.separateWeight,
                            alignWeight: this.weights.alignWeight,
                            pheromoneWeight: this.weights.pheromoneWeight,
                            id: ++this.id
                        });
                    }
                };

                Nest.prototype.addFood = function () {
                    this.foodStore++;
                };

                Nest.prototype.render = function (ctx) {
                    DrawUtils.drawCircle(ctx, this.position.x, this.position.y, this.radius, this.colorInner);
                    DrawUtils.drawRing(ctx, this.position.x, this.position.y, this.radius, this.colorOuter);
                };

                return Nest;
            }
        ])
        .factory('Food', ['Utils', 'DrawUtils', 'MathUtils', 'Vector',
            function (Utils, DrawUtils, MathUtils, Vector) {

                function Food(params) {
                    params = params || {};

                    this.position = params.position || new Vector();
                    this.radius = 10.0;
                    this.color = DrawUtils.getRandomGreen('A');
                }

                Food.prototype.takeBite = function () {
                    this.radius -= 0.1;

                    return this.radius <= 0;
                };

                Food.prototype.render = function (ctx) {
                    DrawUtils.drawCircle(ctx, this.position.x, this.position.y, this.radius, this.color);
                };

                return Food;
            }
        ]);
})(angular);