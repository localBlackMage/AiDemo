(function (ng) {
    'use strict';

    ng.module('aidemo.models.ants.pheromone', [
        'aidemo.service.mathUtils',
        'aidemo.service.drawUtils',
        'aidemo.models.vector'
    ])
        .factory('Pheromone', ['Utils', 'DrawUtils', 'MathUtils', 'Vector',
            function (Utils, DrawUtils, MathUtils, Vector) {

                function Pheromone(params) {
                    params = params || {};
                    this.position = params.position || new Vector();
                    this.timeToLive = 15.0;
                    this.currentTime = 0;
                    this.id = _.isNumber(params.id) ? params.id : 0;
                    this.hasFood = params.hasFood;
                    this.color = this.hasFood ? "#FF00FF" : "#FFFFFF";
                }

                Pheromone.prototype.getAgeWeight = function() {
                    return this.currentTime / this.timeToLive;
                };

                Pheromone.prototype.update = function (deltaTime) {
                    this.currentTime += deltaTime;
                    return this.currentTime >= this.timeToLive;
                };

                Pheromone.prototype.render = function (ctx) {
                    DrawUtils.drawCircle(ctx, this.position.x, this.position.y, 2.0, this.color);
                };

                return Pheromone;
            }
        ]);
})(angular);