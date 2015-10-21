(function (ng) {
    'use strict';

    ng.module('aidemo.models.lifeCell', [
        'aidemo.service.utils',
        'aidemo.service.drawUtils'
    ])
        .factory('LifeCell', ['Utils', 'DrawUtils',
            function (Utils, DrawUtils) {
                /**
                 * Constructor, with class name
                 */
                function LifeCell(params) {
                    this.neighbors = [];
                    this.box = Utils.isNotNullOrUndefined(params.box) ? params.box : {};
                    this.status = params.status === this.DEAD || params.status === this.ALIVE ? params.status : this.DEAD;
                    this.color = this.status == this.DEAD ? this.DEAD_COLOR : this.ALIVE_COLOR;
                }

                LifeCell.build = function (data) {
                    return new LifeCell(data);
                };

                LifeCell.prototype.DEAD_COLOR = "#222222";
                LifeCell.prototype.ALIVE_COLOR = "#00FF00";
                LifeCell.prototype.DEAD = "DEAD";
                LifeCell.prototype.ALIVE = "ALIVE";

                LifeCell.prototype.fillNeighbors = function (neighbors) {
                    this.neighbors = Utils.isNotNullOrUndefined(neighbors) ? neighbors : [];
                };

                LifeCell.prototype.rules = function (alive) {
                    if (this.status == this.DEAD) {
                        if (alive == 3) {
                            return this.ALIVE;
                        }
                        else {
                            return this.DEAD;
                        }
                    }
                    else {
                        if (alive == 2 || alive == 3) {
                            return this.ALIVE;
                        }
                        else if (alive < 2 || alive > 3) {
                            return this.DEAD;
                        }
                    }
                };

                LifeCell.prototype.setStatus = function (status) {
                    this.status = status == this.DEAD || status == this.ALIVE ? status : this.DEAD;
                    this.color = this.status == this.DEAD ? this.DEAD_COLOR : this.ALIVE_COLOR;
                };

                LifeCell.prototype.update = function () {
                    var alive = 0;
                    this.neighbors.forEach(function (n) {
                        if (n.status == this.ALIVE) {
                            alive++;
                        }
                    });
                    return this.rules(alive);
                };

                LifeCell.prototype.render = function (ctx) {
                    DrawUtils.drawSquare(ctx, this.box, this.color);
                };

                LifeCell.prototype.deepCopyGrid = function (grid, udlr) {
                    udlr = udlr === true || udlr === false ? udlr : false;
                    var gridCopy = [];
                    for (var y = 0; y < grid.length; y++) {
                        var row = [];
                        for (var x = 0; x < grid[y].length; x++) {
                            row.push(LifeCell.build({
                                box: grid[y][x].box,
                                status: grid[y][x].status
                            }));
                        }
                        gridCopy.push(row);
                    }
                    return Utils.fillNeighbors(gridCopy, udlr);
                };

                return LifeCell;
            }
        ]);
})(angular);