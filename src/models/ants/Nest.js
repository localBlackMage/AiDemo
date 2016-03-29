(function (ng) {
    'use strict';

    ng.module('aidemo.models.ants.nest', [
        'aidemo.service.mathUtils',
        'aidemo.service.drawUtils',
        'aidemo.models.vector',
        'aidemo.models.ants.ant'

    ])
        .factory('Nest', ['MathUtils', 'DrawUtils', 'Vector', 'Ant',
            function (MathUtils, DrawUtils, Vector, Ant) {

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

                    this.currentTime = 0;
                    this.timeToNextAnt = 2.0;
                }


                Nest.prototype._updateTime = function (delta) {
                    this.currentTime += delta;
                    if (this.currentTime >= this.timeToNextAnt) {
                        this.currentTime = 0;
                        return true;
                    }
                    else {
                        return false;
                    }
                };

                Nest.prototype._spawnAnt = function () {
                    this.id++;
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
                        id: this.id
                    });
                };

                Nest.prototype.updateTimeAndAttemptToSpawnAnt = function (delta) {
                    var shouldAttemptToSpawnAnt = this._updateTime(delta);
                    if (!shouldAttemptToSpawnAnt || this.foodStore < 1.0) {
                        return null;
                    }
                    else {
                        this.foodStore -= 1.0;
                        return this._spawnAnt();
                    }
                };

                Nest.prototype.addFood = function () {
                    this.foodStore += 0.1;
                };

                Nest.prototype.render = function (ctx) {
                    DrawUtils.drawCircle(ctx, this.position.x, this.position.y, this.radius, this.colorInner);
                    DrawUtils.drawRing(ctx, this.position.x, this.position.y, this.radius, this.colorOuter);
                };

                return Nest;
            }
        ]);
})(angular);