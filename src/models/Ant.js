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
                }

                Pheromone.prototype.update = function () {

                };

                Pheromone.prototype.render = function () {

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
                    this.color = "#FF9D00"
                }

                Ant.prototype = Object.create(FlockEntity.prototype);

                Ant.prototype.constructor = Ant;

                Ant.prototype.update = function () {

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
                }

                Nest.prototype.attemptToSpawnAnt = function() {
                    if (this.foodStore === 0) {
                        return null;
                    }
                    else {
                        this.foodStore--;
                        return new Ant({
                            position: new Vector(this.position),
                            velocity: new Vector(1, 0),
                            speed: 1.0,
                            cohesionWeight: this.weights.cohesionWeight,
                            avoidWeight: this.weights.avoidWeight,
                            separateWeight: this.weights.separateWeight,
                            alignWeight: this.weights.alignWeight,
                            pheromoneWeight: this.weights.pheromoneWeight
                        });
                    }
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