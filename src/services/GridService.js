(function (ng) {
    'use strict';
    ng.module('aidemo.service.gridService', [
        'aidemo.service.utils'
    ])
        .service('GridService', ['$log', 'Utils',
            function ($log, Utils) {
                var service = this;

                service.getNeighbors = function (x, y, xLen, yLen, grid, noDiagonal) {
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

                service.fillGridNeighbors = function (grid, noDiagonal) {
                    noDiagonal = _.isBoolean(noDiagonal) ? noDiagonal : false;
                    var yLen = grid.length,
                        xLen = grid[0].length;
                    for (var y = 0; y < grid.length; y++) {
                        for (var x = 0; x < grid[y].length; x++) {
                            if (grid[y][x] && _.isFunction(grid[y][x].fillNeighbors)) {
                                grid[y][x].fillNeighbors(service.getNeighbors(x, y, xLen, yLen, grid, noDiagonal));
                            }
                        }
                    }
                    return grid;
                };

                service.deepCopyGrid = function (grid, gridObjectType, noDiagonal) {
                    if (!_.isFunction(gridObjectType)) {
                        $log.error("gridObjectType MUST be a function!");
                        $log.log(gridObjectType);
                        return;
                    }
                    noDiagonal = _.isBoolean(noDiagonal) ? noDiagonal : false;
                    var gridCopy = [];
                    for (var row = 0; row < grid.length; row++) {
                        var currentRow = [];
                        for (var col = 0; col < grid[row].length; col++) {
                            if (grid[row][col]) {
                                currentRow.push(new gridObjectType({
                                    box: grid[row][col].box,
                                    status: grid[row][col].status
                                }));
                            }
                        }
                        gridCopy.push(currentRow);
                    }
                    return service.fillGridNeighbors(gridCopy, noDiagonal);
                };
            }
        ]);
})(angular);