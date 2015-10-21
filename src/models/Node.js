(function (ng) {
    'use strict';

    ng.module('aidemo.models.node', [
        'aidemo.service.utils',
        'aidemo.service.mathUtils',
        'aidemo.service.drawUtils',
        'aidemo.models.vector'
    ])
        .factory('Node', ['Utils', 'DrawUtils', 'MathUtils', 'Vector',
            function (Utils, DrawUtils, MathUtils, Vector) {
                /**
                 * Constructor, with class name
                 */
                function Node(params) {
                    this.id = Utils.isNotNullOrUndefined(params.id) ? params.id : null;
                    this.pos = Utils.isNotNullOrUndefined(params.pos) ? params.pos : Vector.build();
                    this.distance = Utils.isNotNullOrUndefined(params.distance) ? params.distance : 0;
                    this.box = Utils.isNotNullOrUndefined(params.box) ? params.box : {};

                    this.neighbors = Utils.isNotNullOrUndefined(params.neighbors) ? params.neighbors : [];
                    this.selected = Utils.isNotNullOrUndefined(params.selected) ? params.selected : false;
                    this.special = Utils.isNotNullOrUndefined(params.special) ? params.special : false;
                    this.path = Utils.isNotNullOrUndefined(params.path) ? params.path : false;
                }

                Node.build = function (data) {
                    return new Node(data);
                };

                Node.prototype.SELECTED_COLOR = "#FFF";
                Node.prototype.SPECIAL_COLOR = "#F00";
                Node.prototype.RENDER_COLOR = "#000";
                Node.prototype.PATH_COLOR = "#0F0";
                Node.prototype.RANGE = 25;

                Node.prototype.getNeighbors = function () {
                    return this.neighbors;
                };

                Node.prototype.fillNeighbors = function (neighbors) {
                    this.neighbors = Utils.isNotNullOrUndefined(neighbors) ? neighbors : [];
                };

                Node.prototype.resetSelect = function () {
                    this.selected = false;
                };

                Node.prototype.select = function (pos) {
                    var dist = this.pos.subNew(pos).length();
                    this.selected = dist <= this.RANGE;
                };

                Node.prototype.specialSelect = function (pos) {
                    var dist = this.pos.subNew(pos).length();
                    this.special = dist <= this.RANGE;
                    return this.special;
                };

                Node.prototype.pathSelect = function () {
                    this.path = !this.special;
                };

                Node.prototype.update = function (options) {

                };

                Node.prototype.renderPaths = function (ctx) {
                    var self = this;
                    this.neighbors.forEach(function (neighbor) {
                        if (neighbor.pos) {
                            var color = ((neighbor.path || neighbor.special) && (this.path || this.special)) ? this.PATH_COLOR : this.RENDER_COLOR;
                            DrawUtils.drawLine(ctx, self.pos.x, self.pos.y, neighbor.pos.x, neighbor.pos.y, color);
                        }
                    });
                };

                Node.prototype.getColor = function () {
                    if (this.special)
                        return this.SPECIAL_COLOR;
                    else if (this.path)
                        return this.PATH_COLOR;
                    else if (this.selected)
                        return this.SELECTED_COLOR;
                    else
                        return this.RENDER_COLOR;
                };

                Node.prototype.render = function (ctx) {
                    DrawUtils.drawText(ctx, this.pos.x + 10, this.pos.y - 10, this.SELECTED_COLOR, this.id.toString());
                    DrawUtils.drawCircle(ctx, this.pos.x, this.pos.y, 5, this.getColor());
                };

                return Node;
            }
        ]);
})(angular);