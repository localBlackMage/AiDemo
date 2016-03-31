(function (ng) {
    'use strict';

    ng.module('aidemo.models.ants.food', [
        'aidemo.service.drawUtils',
        'aidemo.models.vector'

    ])
        .factory('Food', ['DrawUtils', 'Vector',
            function (DrawUtils, Vector) {

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