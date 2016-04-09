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
                function Node(params) {
                    params = params || {};
                    this.id = params.id ? params.id : null;
                    this.position = params.position ? params.position : new Vector();
                    this.distance = params.distance ? params.distance : 0;
                    this.box = params.box ? params.box : {};

                    this.neighbors = params.neighbors ? params.neighbors : [];
                    this.selected = params.selected ? params.selected : false;
                    this.special = params.special ? params.special : false;
                    this.path = params.path ? params.path : false;
                }

                Node.prototype.SELECTED_COLOR = "#FFFFFF";
                Node.prototype.SPECIAL_COLOR = "#FF0000";
                Node.prototype.RENDER_COLOR = "#000000";
                Node.prototype.PATH_COLOR = "#00FF00";
                Node.prototype.RANGE = 10;

                Node.prototype.getNeighbors = function () {
                    return this.neighbors;
                };

                Node.prototype.fillNeighbors = function (neighbors) {
                    this.neighbors = _.isArray(neighbors) ? neighbors : [];
                };

                Node.prototype.reset = function () {
                    this.selected = false;
                    this.special = false;
                    this.path = false;
                };

                Node.prototype.eligibleForSelect = function (position) {
                    //return this.selected && !this.special && this.specialSelect(position);
                    return !this.special && this.specialSelect(position);
                };

                Node.prototype.select = function (position) {
                    var dist = this.position.subNew(position).length();
                    this.selected = dist <= this.RANGE;
                };

                Node.prototype.specialSelect = function (position) {
                    var dist = this.position.subNew(position).length();
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
                        if (neighbor.position) {
                            var color = ((neighbor.path || neighbor.special) && (self.path || self.special)) ? self.PATH_COLOR : self.RENDER_COLOR;
                            DrawUtils.drawLine(ctx, self.position.x, self.position.y, neighbor.position.x, neighbor.position.y, color);
                        }
                    });
                };

                Node.prototype.getColor = function () {
                    if (this.special) {
                        return this.SPECIAL_COLOR;
                    }
                    else if (this.path) {
                        return this.PATH_COLOR;
                    }
                    else if (this.selected) {
                        return this.SELECTED_COLOR;
                    }
                    else {
                        return this.RENDER_COLOR;
                    }
                };

                Node.prototype.render = function (ctx) {
                    DrawUtils.drawCircle(ctx, this.position.x, this.position.y, 5, this.getColor());

                    this.renderPaths(ctx);
                };

                return Node;
            }
        ]);
})(angular);