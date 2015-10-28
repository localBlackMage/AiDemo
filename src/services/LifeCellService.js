(function (ng) {
    'use strict';
    ng.module('aidemo.service.lifeCellService', [
        'aidemo.models.lifeCell',
        'aidemo.service.utils'
    ])
        .service('LifeCellService', ['LifeCell', 'Utils',
            function (LifeCell, Utils) {
                var service = this;

                this.getNeighbors = function (x, y, xLen, yLen, grid, noDiagonal) {
                    noDiagonal = _.isBoolean(noDiagonal) ? noDiagonal : false;
                    var neighbors = [];
                    neighbors.push(x - 1 >= 0 ? grid[y][x - 1] : null); // 0, -1
                    neighbors.push(x + 1 < xLen ? grid[y][x + 1] : null); // 0, 1
                    neighbors.push(y - 1 >= 0 ? grid[y - 1][x] : null); // -1, 0
                    neighbors.push(y + 1 < yLen ? grid[y + 1][x] : null); // 1, 0

                    if (!noDiagonal) {
                        neighbors.push(x - 1 >= 0 && y - 1 >= 0 ? grid[y - 1][x - 1] : null); // -1, -1
                        neighbors.push(x - 1 >= 0 && y + 1 < yLen ? grid[y + 1][x - 1] : null); // 1, -1
                        neighbors.push(x + 1 < xLen && y - 1 >= 0 ? grid[y - 1][x + 1] : null); // -1, 1
                        neighbors.push(x + 1 < xLen && y + 1 < yLen ? grid[y + 1][x + 1] : null); // 1, 1
                    }
                    return neighbors.filter(function (neighbor) {
                        return !Utils.isNullOrUndefined(neighbor);
                    });
                };

                this.fillGridNeighbors = function (grid, noDiagonal) {
                    noDiagonal = _.isBoolean(noDiagonal) ? noDiagonal : false;
                    var yLen = grid.length,
                        xLen = grid[0].length;
                    for (var y = 0; y < grid.length; y++) {
                        for (var x = 0; x < grid[y].length; x++) {
                            if (grid[y][x]) {
                                grid[y][x].fillNeighbors(service.getNeighbors(x, y, xLen, yLen, grid, noDiagonal));
                            }
                        }
                    }
                    return grid;
                };

                this.deepCopyGrid = function (grid, noDiagonal) {
                    noDiagonal = _.isBoolean(noDiagonal) ? noDiagonal : false;
                    var gridCopy = [];
                    for (var row = 0; row < grid.length; row++) {
                        var currentRow = [];
                        for (var col = 0; col < grid[row].length; col++) {
                            currentRow.push(new LifeCell({
                                box: grid[row][col].box,
                                status: grid[row][col].status
                            }));
                        }
                        gridCopy.push(currentRow);
                    }
                    return this.fillGridNeighbors(gridCopy, noDiagonal);
                };
            }
        ]);
})(angular);