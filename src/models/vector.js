(function (ng) {
    'use strict';

    ng.module('aidemo.models.vector', [])
        .factory('Vector', [
            function () {
                /**
                 * Constructor, with class name
                 */
                function Vector(params) {
                    this.x = params.x ? params.x : 0;
                    this.y = params.y ? params.y : 0;
                }

                Vector.build = function (data) {
                    return new Vector(data);
                };

                Vector.prototype.length = function () {
                    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
                };

                Vector.prototype.normalize = function (scalar) {
                    scalar = scalar === null ? 1 : scalar;
                    var length = this.length();
                    return Vector.build({x: (this.x / length) * scalar, y: (this.y / length) * scalar});
                };

                Vector.prototype.addNew = function (other) {
                    return Vector.build({x: this.x + other.x, y: this.y + other.y});
                };

                Vector.prototype.add = function (other) {
                    this.x += other.x;
                    this.y += other.y;
                };

                Vector.prototype.subNew = function (other) {
                    return Vector.build({x: this.x - other.x, y: this.y - other.y});
                };

                Vector.prototype.sub = function (other) {
                    this.x -= other.x;
                    this.y -= other.y;
                };

                Vector.prototype.mulNew = function (scalar) {
                    return Vector.build({x: this.x * scalar, y: this.y * scalar});
                };

                Vector.prototype.mul = function (scalar) {
                    this.x *= scalar;
                    this.y *= scalar;
                };

                Vector.prototype.divNew = function (scalar) {
                    return Vector.build({x: this.x / scalar, y: this.y / scalar});
                };

                Vector.prototype.div = function (div) {
                    this.x /= div;
                    this.y /= div;
                };

                Vector.prototype.angleToVector = function (angle) {
                    return Vector.build({x: parseFloat(Math.sin(angle)), y: -parseFloat(Math.cos(angle))});
                };

                Vector.prototype.vectorToAngle = function () {
                    return parseFloat(Math.atan2(this.x, -this.y));
                };

                Vector.prototype.distance = function (other) {
                    return this.subNew(other).length();
                };

                Vector.prototype.toString = function () {
                    return {x: this.x, y: this.y};
                };

                return Vector;
            }
        ]);
})(angular);