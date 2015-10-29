(function (ng) {
    'use strict';

    ng.module('aidemo.models.lifeCell', [
        'aidemo.service.utils',
        'aidemo.service.drawUtils'
    ])
        .factory('LifeCell', ['Utils', 'DrawUtils',
            function (Utils, DrawUtils) {
                function LifeCell(params) {
                    this.neighbors = [];
                    this.box = _.isObject(params.box) ? params.box : {};
                    this.status = params.status === this.DEAD || params.status === this.ALIVE ? params.status : this.DEAD;
                    this.DEAD_COLOR = params.DEAD_COLOR || this.DEAD_COLOR;
                    this.ALIVE_COLOR = params.ALIVE_COLOR || this.ALIVE_COLOR;
                    this.color = this.status == this.DEAD ? this.DEAD_COLOR : this.ALIVE_COLOR;
                }

                LifeCell.prototype.DEAD_COLOR = "#222222";
                LifeCell.prototype.ALIVE_COLOR = "#00FF00";
                LifeCell.prototype.DEAD = "DEAD";
                LifeCell.prototype.ALIVE = "ALIVE";

                LifeCell.DEAD = LifeCell.prototype.DEAD;
                LifeCell.ALIVE = LifeCell.prototype.ALIVE;

                LifeCell.prototype.fillNeighbors = function (neighbors) {
                    this.neighbors = _.isArray(neighbors) ? neighbors : [];
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
                    this.status = status === this.DEAD || status === this.ALIVE ? status : this.DEAD;
                    this.color = this[this.status + '_COLOR'];
                };

                LifeCell.prototype.update = function () {
                    var alive = 0,
                        self = this;
                    this.neighbors.forEach(function (n) {
                        if (n.status === self.ALIVE) {
                            alive++;
                        }
                    });
                    return this.rules(alive);
                };

                LifeCell.prototype.render = function (ctx) {
                    DrawUtils.drawSquare(ctx, this.box, this.color);
                };

                return LifeCell;
            }
        ]);
})(angular);