(function (ng) {
    'use strict';

    ng.module('aidemo.models.vector', [])
        .factory('Vector', [
            function () {
                /**
                 * Constructor, with class name
                 */
                function Vector(params) {
                    params = params || {};
                    this.x = params.x || 0;
                    this.y = params.y || 0;
                }

                Vector.build = function (data) {
                    return new Vector(data);
                };

                Vector.prototype.length = function () {
                    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
                };

                Vector.prototype.normalize = function (scalar) {
                    scalar = scalar || 1;
                    var length = this.length();
                    return new Vector({x: (this.x / length) * scalar, y: (this.y / length) * scalar});
                };

                Vector.prototype.addNew = function (other) {
                    return new Vector({x: this.x + other.x, y: this.y + other.y});
                };

                Vector.prototype.add = function (other) {
                    this.x += other.x;
                    this.y += other.y;
                };

                Vector.prototype.subNew = function (other) {
                    return new Vector({x: this.x - other.x, y: this.y - other.y});
                };

                Vector.prototype.sub = function (other) {
                    this.x -= other.x;
                    this.y -= other.y;
                };

                Vector.prototype.mulNew = function (scalar) {
                    return new Vector({x: this.x * scalar, y: this.y * scalar});
                };

                Vector.prototype.mul = function (scalar) {
                    this.x *= scalar;
                    this.y *= scalar;
                };

                Vector.prototype.divNew = function (scalar) {
                    return new Vector({x: this.x / scalar, y: this.y / scalar});
                };

                Vector.prototype.div = function (div) {
                    this.x /= div;
                    this.y /= div;
                };

                Vector.angleToVector = function (angle) {
                    angle = angle * Math.PI / 180.0;
                    return new Vector({
                        x: Math.round(parseFloat(Math.cos(angle)) * 100) / 100,
                        y: Math.round(parseFloat(Math.sin(angle)) * 100) / 100
                    });
                };

                Vector.prototype.vectorToAngleRadians = function () {
                    return parseFloat(Math.atan2(this.y, this.x));
                };

                Vector.prototype.vectorToAngleDegrees = function () {
                    return this.vectorToAngleRadians() * 180 / Math.PI;
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